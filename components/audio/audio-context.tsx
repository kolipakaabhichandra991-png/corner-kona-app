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
  playTrack: (episode: Episode, autoOpenTranscript?: boolean, startTime?: number) => void
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

// LocalStorage helpers with try/catch and SSR safety
function getSavedProgress(episodeId: string, trackDuration: number): number {
  try {
    if (typeof window === 'undefined') return 0
    const raw = localStorage.getItem(`ck-progress-${episodeId}`)
    if (!raw) return 0
    const val = parseFloat(raw)
    if (isNaN(val) || val <= 0 || val >= trackDuration - 3) {
      localStorage.removeItem(`ck-progress-${episodeId}`)
      return 0
    }
    return val
  } catch {
    return 0
  }
}

function saveProgress(episodeId: string, time: number, trackDuration: number) {
  try {
    if (typeof window === 'undefined') return
    if (time >= trackDuration - 3) {
      localStorage.removeItem(`ck-progress-${episodeId}`)
    } else if (time > 0) {
      localStorage.setItem(`ck-progress-${episodeId}`, String(time))
    }
  } catch {
    // ignore
  }
}

function clearProgress(episodeId: string) {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(`ck-progress-${episodeId}`)
  } catch {
    // ignore
  }
}

function saveLastTrack(episode: Episode) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem('ck-last-track', JSON.stringify(episode))
  } catch {
    // ignore
  }
}

function clearLastTrack() {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem('ck-last-track')
  } catch {
    // ignore
  }
}

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

  // Live mutable refs to avoid stale closures in event listeners & timer callbacks
  const currentTrackRef = useRef<Episode | null>(null)
  const currentTimeRef = useRef(0)
  const durationRef = useRef(duration)

  useEffect(() => {
    currentTrackRef.current = currentTrack
  }, [currentTrack])

  useEffect(() => {
    currentTimeRef.current = currentTime
  }, [currentTime])

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

  // Restore last-played track and saved position on page load (paused, no autoplay)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const saved = localStorage.getItem('ck-last-track')
      if (!saved) return
      const track = JSON.parse(saved) as Episode
      if (!track || !track.id || !track.slug) return

      const transcriptList = getTranscriptForSlug(
        track.slug,
        track.title?.hi ?? '',
        track.title?.en ?? ''
      )
      const maxEnd = transcriptList.length ? transcriptList[transcriptList.length - 1].end : 60
      const trackDuration = Math.max(maxEnd, 54)
      const savedPos = getSavedProgress(track.id, trackDuration)

      setCurrentTrack(track)
      currentTrackRef.current = track
      setTranscripts(transcriptList)
      setDuration(trackDuration)
      durationRef.current = trackDuration
      setCurrentTime(savedPos)
      currentTimeRef.current = savedPos
      setIsPlaying(false) // Restore in paused state
    } catch {
      // ignore
    }
  }, [])

  // Web Audio ambient tone generator for realistic audio output
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null)
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
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
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

  // Periodic progress saving while playing (~1 sec)
  useEffect(() => {
    if (!isPlaying) return
    const interval = window.setInterval(() => {
      if (currentTrackRef.current) {
        saveProgress(
          currentTrackRef.current.id,
          currentTimeRef.current,
          durationRef.current
        )
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Save progress on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (currentTrackRef.current) {
        saveProgress(
          currentTrackRef.current.id,
          currentTimeRef.current,
          durationRef.current
        )
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

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
          if (currentTrackRef.current) {
            clearProgress(currentTrackRef.current.id)
          }
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
    (episode: Episode, autoOpenTranscript = false, startTime?: number) => {
      const transcriptList = getTranscriptForSlug(episode.slug, episode.title.hi, episode.title.en)
      const maxEnd = transcriptList.length ? transcriptList[transcriptList.length - 1].end : 60
      const trackDuration = Math.max(maxEnd, 54)

      if (currentTrackRef.current?.id === episode.id) {
        if (startTime !== undefined) {
          const clamped = Math.max(0, Math.min(startTime, trackDuration))
          setCurrentTime(clamped)
          currentTimeRef.current = clamped
          saveProgress(episode.id, clamped, trackDuration)
        }
        setIsPlaying(true)
        saveLastTrack(episode)
        if (autoOpenTranscript) setTranscriptOpen(true)
        return
      }

      // If switching from another track, save previous track's position
      if (currentTrackRef.current) {
        saveProgress(
          currentTrackRef.current.id,
          currentTimeRef.current,
          durationRef.current
        )
      }

      const initialPos =
        startTime !== undefined
          ? Math.max(0, Math.min(startTime, trackDuration))
          : getSavedProgress(episode.id, trackDuration)

      setCurrentTrack(episode)
      currentTrackRef.current = episode
      setTranscripts(transcriptList)
      setDuration(trackDuration)
      durationRef.current = trackDuration
      setCurrentTime(initialPos)
      currentTimeRef.current = initialPos
      setIsPlaying(true)
      saveLastTrack(episode)
      if (autoOpenTranscript) setTranscriptOpen(true)
    },
    []
  )

  const pauseTrack = useCallback(() => {
    setIsPlaying(false)
    if (currentTrackRef.current) {
      saveProgress(
        currentTrackRef.current.id,
        currentTimeRef.current,
        durationRef.current
      )
    }
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev
      if (!next && currentTrackRef.current) {
        saveProgress(
          currentTrackRef.current.id,
          currentTimeRef.current,
          durationRef.current
        )
      }
      return next
    })
  }, [])

  const seek = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, durationRef.current))
    setCurrentTime(clamped)
    currentTimeRef.current = clamped
    if (currentTrackRef.current) {
      saveProgress(currentTrackRef.current.id, clamped, durationRef.current)
    }
  }, [])

  const skip = useCallback(
    (delta: number) => {
      seek(currentTimeRef.current + delta)
    },
    [seek]
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
    if (currentTrackRef.current) {
      saveProgress(
        currentTrackRef.current.id,
        currentTimeRef.current,
        durationRef.current
      )
    }
    clearLastTrack()
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
