'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  FileText,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Maximize2,
} from 'lucide-react'
import { useAudio } from './audio-context'
import { sectionStyle } from '@/lib/sections'
import { localePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function StickyAudioDock({ locale }: { locale: Locale }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isTranscriptOpen,
    activeTranscriptLine,
    togglePlay,
    seek,
    skip,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setTranscriptOpen,
    closePlayer,
  } = useAudio()

  const [isHoveringProgress, setIsHoveringProgress] = useState(false)

  if (!currentTrack) return null

  const s = sectionStyle[currentTrack.category]
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  const formatSecs = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const cycleSpeed = () => {
    const rates = [1.0, 1.25, 1.5, 2.0]
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length
    setPlaybackRate(rates[nextIdx])
  }

  const isHi = locale === 'hi'

  return (
    <aside
      aria-label="Audio Player Dock"
      className="fixed inset-x-3 bottom-[4.8rem] z-40 mx-auto max-w-4xl transition-all duration-300 animate-rise lg:bottom-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2.5 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl ring-1 ring-white/10 sm:p-3">
        {/* Real-time Top Progress Bar (Scrubbable) */}
        <div
          className="absolute inset-x-0 top-0 h-1.5 bg-muted/60 cursor-pointer group"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const clickPos = (e.clientX - rect.left) / rect.width
            seek(clickPos * duration)
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] transition-all duration-150 relative"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          >
            <span
              className={cn(
                'absolute -right-1.5 -top-1 size-3 rounded-full bg-white shadow-md transition-opacity',
                isHoveringProgress ? 'opacity-100 scale-125' : 'opacity-0 sm:group-hover:opacity-100'
              )}
            />
          </div>
        </div>

        {/* Content & Controls Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Left: Thumbnail & Episode Meta */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={localePath(
                locale,
                currentTrack.premium
                  ? `/antar-yatra/${currentTrack.slug}`
                  : `/podcasts/${currentTrack.slug}`
              )}
              className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md group/art"
            >
              <Image
                src={currentTrack.image || '/placeholder.svg'}
                alt=""
                fill
                sizes="48px"
                className={cn(
                  'object-cover transition-transform duration-500',
                  isPlaying && 'scale-105'
                )}
              />
              <span className="absolute inset-0 bg-black/20 opacity-0 group-hover/art:opacity-100 grid place-items-center transition-opacity">
                <Maximize2 className="size-4 text-white" />
              </span>
            </Link>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className={cn('size-2 rounded-full shrink-0', s.bg)} />
                <span className="truncate text-[11px] font-bold text-muted-foreground">
                  {currentTrack.show[locale]}
                </span>
                {currentTrack.premium && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-antar/20 px-1.5 py-0.2 text-[9px] font-black text-antar">
                    <Sparkles className="size-2.5" />
                    Premium
                  </span>
                )}
              </div>
              <h4 className="truncate font-display text-xs font-black sm:text-sm text-foreground">
                {currentTrack.title[locale]}
              </h4>
              {/* Active karaoke spoken line snippet */}
              {activeTranscriptLine && (
                <span className="hidden text-[10px] italic text-purple-600 dark:text-purple-300 truncate max-w-xs md:inline-block">
                  &ldquo;{isHi ? activeTranscriptLine.hi : activeTranscriptLine.en}&rdquo;
                </span>
              )}
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Rewind 15s */}
            <button
              type="button"
              onClick={() => skip(-15)}
              className="hidden size-8 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90 sm:grid cursor-pointer"
              aria-label="Rewind 15 seconds"
              title="-15s"
            >
              <RotateCcw className="size-4" />
            </button>

            {/* Main Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="grid size-11 place-items-center rounded-full bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current translate-x-px" />
              )}
            </button>

            {/* Forward 15s */}
            <button
              type="button"
              onClick={() => skip(15)}
              className="hidden size-8 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90 sm:grid cursor-pointer"
              aria-label="Forward 15 seconds"
              title="+15s"
            >
              <RotateCw className="size-4" />
            </button>

            {/* Time Indicator */}
            <div className="hidden font-mono text-[11px] font-semibold text-muted-foreground sm:inline-block ml-1">
              <span>{formatSecs(currentTime)}</span>
              <span className="opacity-40"> / </span>
              <span>{formatSecs(duration)}</span>
            </div>
          </div>

          {/* Right: Extra Tools (Speed, Transcripts, Volume, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Speed Button */}
            <button
              type="button"
              onClick={cycleSpeed}
              className="hidden h-7 items-center rounded-md border border-border/80 px-2 text-[11px] font-black text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 sm:inline-flex cursor-pointer"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            {/* Synchronized Bilingual Transcripts Button */}
            <button
              type="button"
              onClick={() => setTranscriptOpen(!isTranscriptOpen)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs',
                isTranscriptOpen
                  ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-md'
                  : 'border border-border/80 bg-muted/60 text-foreground hover:bg-muted hover:scale-105 active:scale-95'
              )}
              title="Open Synchronized Transcripts"
            >
              <FileText className="size-3.5" />
              <span className="hidden xs:inline">
                {isHi ? 'ट्रांसक्रिप्ट' : 'Lyrics'}
              </span>
            </button>

            {/* Volume Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="hidden size-8 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:grid cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-4 text-red-400" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>

            {/* Close Player */}
            <button
              type="button"
              onClick={closePlayer}
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90 cursor-pointer"
              aria-label="Close Player"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
