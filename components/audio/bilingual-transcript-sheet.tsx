'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  X,
  Languages,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  ArrowDownCircle,
  Radio,
} from 'lucide-react'
import { useAudio } from './audio-context'
import { cn } from '@/lib/utils'

export function BilingualTranscriptSheet() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    transcripts,
    activeTranscriptLine,
    isTranscriptOpen,
    transcriptLanguage,
    setTranscriptLanguage,
    setTranscriptOpen,
    seek,
    togglePlay,
  } = useAudio()

  const [autoScroll, setAutoScroll] = useState(true)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to active line
  useEffect(() => {
    if (!autoScroll || !activeLineRef.current || !containerRef.current) return
    activeLineRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [activeTranscriptLine, autoScroll])

  if (!isTranscriptOpen || !currentTrack) return null

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background click to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setTranscriptOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div className="relative z-10 flex h-[85vh] w-full max-w-4xl mx-auto flex-col rounded-t-[2.5rem] border-t border-x border-border/80 bg-background/95 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl">
        {/* Top Drag Handle & Close */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md">
              <Image
                src={currentTrack.image || '/placeholder.svg'}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {currentTrack.show.hi}
                </span>
                <span className="size-1 rounded-full bg-muted-foreground/40" />
                <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Radio className="size-2.5 text-red-500 animate-pulse" />
                  Live Synchronized
                </span>
              </div>
              <h3 className="line-clamp-1 font-display text-base font-black sm:text-lg">
                {currentTrack.title.hi}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTranscriptOpen(false)}
            className="grid size-9 place-items-center rounded-full bg-muted/80 text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close transcript"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Subheader: Language toggles and Auto-scroll */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-muted/40 border-b border-border/40 text-xs font-bold">
          {/* Language Selector */}
          <div className="flex items-center gap-1 rounded-full bg-background p-1 border shadow-xs">
            <button
              type="button"
              onClick={() => setTranscriptLanguage('both')}
              className={cn(
                'rounded-full px-3 py-1 transition-all cursor-pointer',
                transcriptLanguage === 'both'
                  ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              दोनों (Bilingual)
            </button>
            <button
              type="button"
              onClick={() => setTranscriptLanguage('hi')}
              className={cn(
                'rounded-full px-3 py-1 transition-all cursor-pointer',
                transcriptLanguage === 'hi'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              हिन्दी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setTranscriptLanguage('en')}
              className={cn(
                'rounded-full px-3 py-1 transition-all cursor-pointer',
                transcriptLanguage === 'en'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              English
            </button>
          </div>

          {/* Auto-scroll toggle */}
          <button
            type="button"
            onClick={() => setAutoScroll((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 border transition-all cursor-pointer',
              autoScroll
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                : 'bg-background text-muted-foreground border-border hover:text-foreground'
            )}
          >
            <ArrowDownCircle className={cn('size-3.5', autoScroll && 'animate-bounce')} />
            {autoScroll ? 'ऑटो-स्क्रॉल चालू' : 'ऑटो-स्क्रॉल बंद'}
          </button>
        </div>

        {/* Scrollable Karaoke Transcript Body */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-4 scroll-smooth"
        >
          {transcripts.map((line) => {
            const isActive = activeTranscriptLine?.id === line.id
            const isPast = currentTime > line.end

            return (
              <div
                key={line.id}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.start)}
                className={cn(
                  'group relative flex flex-col gap-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer select-none',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/15 via-cyan-500/10 to-transparent border-2 border-purple-500/40 shadow-lg shadow-purple-500/5 scale-[1.01]'
                    : isPast
                    ? 'opacity-65 hover:opacity-95 hover:bg-muted/50 border border-transparent'
                    : 'opacity-90 hover:opacity-100 hover:bg-muted/40 border border-transparent'
                )}
              >
                {/* Speaker & Timestamp pill */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {line.speaker && (
                      <span
                        className={cn(
                          'rounded-md px-2 py-0.5 text-xs font-black tracking-wide uppercase',
                          isActive
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {line.speaker}
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 animate-pulse">
                        <Volume2 className="size-3.5" />
                        Speaking now
                      </span>
                    )}
                  </span>

                  <span className="rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    {formatSecs(line.start)}
                  </span>
                </div>

                {/* Hindi Text */}
                {(transcriptLanguage === 'both' || transcriptLanguage === 'hi') && (
                  <p
                    className={cn(
                      'font-display leading-relaxed transition-colors',
                      isActive
                        ? 'text-lg sm:text-xl font-black text-foreground drop-shadow-xs'
                        : 'text-base sm:text-lg font-bold text-foreground/90'
                    )}
                  >
                    {line.hi}
                  </p>
                )}

                {/* English Translation */}
                {(transcriptLanguage === 'both' || transcriptLanguage === 'en') && (
                  <p
                    className={cn(
                      'text-sm sm:text-base leading-normal font-sans italic transition-colors',
                      isActive
                        ? 'text-purple-900 dark:text-purple-200 font-semibold'
                        : 'text-muted-foreground'
                    )}
                  >
                    {line.en}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Mini Transport inside Transcript Sheet */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="grid size-11 place-items-center rounded-full bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current translate-x-px" />}
            </button>
            <div className="flex flex-col text-xs">
              <span className="font-bold">{formatSecs(currentTime)} / {formatSecs(duration)}</span>
              <span className="text-[10px] text-muted-foreground">Click any verse above to jump</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => seek(0)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            शुरू से सुनें (Restart)
          </button>
        </div>
      </div>
    </div>
  )
}
