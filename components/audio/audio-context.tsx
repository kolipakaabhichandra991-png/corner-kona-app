'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import type { Episode } from '@/lib/content/types'
import { getTranscriptForSlug, type TranscriptLine } from '@/lib/content/transcripts'

export interface AudioContextType {
  currentTrack: Episode | null
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
  isMuted: boolean
  isTranscriptOpen: boolean
  transcriptLanguage: 'both' | 'hi' | 'en'
  transcripts: TranscriptLine[]
  activeTranscriptLine: TranscriptLine | null
  playTrack: (episode: Episode, autoOpenTranscript?: boolean) => void
  pauseTrack: () => void
  togglePlay: () => void
  seek: (seconds: number) => void
  skip: (deltaSeconds: number) => void
  setPlaybackRate: (rate: number) => void
  setVolume: (val: number) => void
  toggleMute: () => void
  setTranscriptOpen: (open: boolean) => void
  setTranscriptLanguage: (lang: 'both' | 'hi' | 'en') => void
  closePlayer: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(60) // Standard interactive preview duration in seconds
  const [playbackRate, setPlaybackRateState] = useState(1.0)
  const [volume, setVolumeState] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isTranscriptOpen, setTranscriptOpen] = useState(false)
  const [transcriptLanguage, setTranscriptLanguage] = useState<'both' | 'hi' | 'en'>('both')
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([])

  // Web Audio ambient tone generator for realistic audio output
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const osc1Ref = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const timerRef = useRef<number | null>(null)

  const stopWebAudio = useCallback(() => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop()
        osc1Ref.current.disconnect()
        osc1Ref.current = null
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop()
        osc2Ref.current.disconnect()
        osc2Ref.current = null
      }
    } catch {
      // ignore
    }
  }, [])

  const startWebAudio = useCallback(
    (isAntar: boolean) => {
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return

        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioContextClass()
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume()
        }

        stopWebAudio()

        const ctx = audioCtxRef.current
        const gain = ctx.createGain()
        gain.gain.value = isMuted ? 0 : volume * 0.08 // Gentle, soothing ambient level
        gain.connect(ctx.destination)
        gainNodeRef.current = gain

        // Antar Yatra: 432Hz Om / Tanpura harmony; Normal: 220Hz / 440Hz warm acoustic drone
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()

        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(isAntar ? 108 : 216, ctx.currentTime)

        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(isAntar ? 432 : 324, ctx.currentTime)

        osc1.connect(gain)
        osc2.connect(gain)

        osc1.start()
        osc2.start()

        osc1Ref.current = osc1
        osc2Ref.current = osc2
      } catch {
        // audio context autoplay restriction gracefully handled
      }
    },
    [isMuted, stopWebAudio, volume]
  )

  // Update volume on gain node
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.08,
        audioCtxRef.current.currentTime
      )
    }
  }, [volume, isMuted])

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      stopWebAudio()
      return
    }

    startWebAudio(currentTrack?.category === 'bhakti' || Boolean(currentTrack?.premium))

    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5 * playbackRate
        if (next >= duration) {
          setIsPlaying(false)
          return 0
        }
        return next
      })
    }, 500)
    timerRef.current = interval

    return () => {
      clearInterval(interval)
      stopWebAudio()
    }
  }, [isPlaying, playbackRate, duration, currentTrack, startWebAudio, stopWebAudio])

  // Compute active transcript line
  const activeTranscriptLine =
    transcripts.find((line) => currentTime >= line.start && currentTime < line.end) ||
    transcripts[transcripts.length - 1] ||
    null

  const playTrack = useCallback(
    (episode: Episode, autoOpenTranscript = false) => {
      if (currentTrack?.id === episode.id) {
        setIsPlaying(true)
        if (autoOpenTranscript) setTranscriptOpen(true)
        return
      }

      setCurrentTrack(episode)
      setCurrentTime(0)
      const transcriptList = getTranscriptForSlug(episode.slug, episode.title.hi, episode.title.en)
      setTranscripts(transcriptList)
      const maxEnd = transcriptList.length ? transcriptList[transcriptList.length - 1].end : 60
      setDuration(Math.max(maxEnd, 54))
      setIsPlaying(true)
      if (autoOpenTranscript) setTranscriptOpen(true)
    },
    [currentTrack]
  )

  const pauseTrack = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, duration))
      setCurrentTime(clamped)
    },
    [duration]
  )

  const skip = useCallback(
    (delta: number) => {
      seek(currentTime + delta)
    },
    [currentTime, seek]
  )

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate)
  }, [])

  const setVolume = useCallback((val: number) => {
    setVolumeState(val)
    if (val > 0) setIsMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const closePlayer = useCallback(() => {
    setIsPlaying(false)
    setCurrentTrack(null)
    setTranscriptOpen(false)
    stopWebAudio()
  }, [stopWebAudio])

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        isMuted,
        isTranscriptOpen,
        transcriptLanguage,
        transcripts,
        activeTranscriptLine,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        skip,
        setPlaybackRate,
        setVolume,
        toggleMute,
        setTranscriptOpen,
        setTranscriptLanguage,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
