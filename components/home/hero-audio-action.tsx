'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Play, Pause, Volume2, Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Episode } from '@/lib/content/types'
import { Waveform } from './waveform'
import { LikeButton } from '@/components/like-button'
import { cn } from '@/lib/utils'

export function HeroAudioAction({
  locale,
  t,
  episode,
}: {
  locale: Locale
  t: Dictionary
  episode: Episode
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsPlayed, setSecondsPlayed] = useState(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsPlayed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Interactive Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            'group inline-flex h-14 items-center gap-3 rounded-full pr-6 pl-2 font-bold shadow-xl transition-all duration-300 active:scale-95 cursor-pointer',
            isPlaying
              ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white ring-4 ring-purple-500/30'
              : 'bg-primary text-primary-foreground hover:scale-[1.03] hover:shadow-primary/30'
          )}
          aria-label={isPlaying ? 'Pause Podcast' : 'Play Podcast'}
        >
          <span
            className={cn(
              'grid size-10 place-items-center rounded-full transition-transform duration-300',
              isPlaying
                ? 'bg-white text-[#9333EA] scale-105'
                : 'bg-primary-foreground text-primary group-hover:scale-105'
            )}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current animate-pulse" aria-hidden="true" />
            ) : (
              <Play className="size-5 translate-x-px fill-current" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span>{isPlaying ? (locale === 'hi' ? 'बजा रहे हैं' : 'Playing...') : t.home.listen}</span>
            <span className="text-xs opacity-75 font-medium">
              {isPlaying ? formatTime(secondsPlayed) : `${episode.durationMin} ${t.home.min}`}
            </span>
          </span>
        </button>

        {/* Full Episode Link */}
        <Link
          href={localePath(locale, `/podcasts/${episode.slug}`)}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          {locale === 'hi' ? 'पूरा एपिसोड' : 'Full Episode'}
        </Link>

        {/* Like Button */}
        <LikeButton id={episode.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={22} tone="ink" />

        {/* Interactive Waveform */}
        <Waveform
          playing={isPlaying}
          interactive
          onToggle={togglePlay}
          className="hidden sm:flex"
        />
      </div>

      {isPlaying && (
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 animate-rise">
          <Volume2 className="size-4 animate-pulse" />
          <span>
            {locale === 'hi'
              ? 'ऑडियो प्रीव्यू चल रहा है · कोना टॉक्स एक्सक्लूसिव'
              : 'Streaming Preview · Kona Talks Exclusive'}
          </span>
        </div>
      )}
    </div>
  )
}
