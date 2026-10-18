'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Pause, Play } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Episode } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { LikeButton } from '@/components/like-button'
import { useAudio } from '@/components/audio/audio-context'

export function EpisodeCard({
  locale,
  t,
  episode,
  className,
}: {
  locale: Locale
  t: Dictionary
  episode: Episode
  className?: string
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio()
  const s = sectionStyle[episode.category]

  const isThisPlaying = currentTrack?.id === episode.id && isPlaying

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentTrack?.id === episode.id) {
      togglePlay()
    } else {
      playTrack(episode)
    }
  }

  return (
    <article className={cn('flex w-44 flex-col gap-2 sm:w-52 transition-all duration-300 hover:-translate-y-1', className)}>
      <Link
        href={localePath(locale, `/podcasts/${episode.slug}`)}
        className="group flex flex-col gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-shadow duration-300">
          <Image
            src={episode.image || '/placeholder.svg'}
            alt=""
            fill
            sizes="208px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className={cn('absolute top-0 left-0 h-1.5 w-full', s.bg)} aria-hidden="true" />
          {episode.kind === 'audiobook' && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[11px] font-bold text-foreground backdrop-blur">
              <BookOpen className="size-3" aria-hidden="true" />
              {t.mega.audiobooks}
            </span>
          )}

          {/* Quick Play Button: Triggers Global Sticky Dock */}
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={isThisPlaying ? 'Pause Episode' : 'Play in Audio Dock'}
            className={cn(
              'absolute right-3 bottom-3 grid size-11 place-items-center rounded-full shadow-lg transition-all duration-300 active:scale-90 cursor-pointer',
              isThisPlaying
                ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white scale-110 shadow-purple-500/40 ring-4 ring-purple-500/30'
                : 'bg-primary text-primary-foreground group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#9333EA] group-hover:to-[#0EA5E9] group-hover:text-white'
            )}
          >
            {isThisPlaying ? (
              <Pause className="size-4 fill-current animate-pulse" aria-hidden="true" />
            ) : (
              <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn('text-xs font-bold transition-colors', s.text)}>{episode.show[locale]}</span>
          <h3 className="line-clamp-2 text-base leading-snug font-bold group-hover:text-primary transition-colors">
            {episode.title[locale]}
          </h3>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {episode.durationMin} {t.home.min}
        </span>
        <LikeButton id={episode.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={14} />
      </div>
    </article>
  )
}
