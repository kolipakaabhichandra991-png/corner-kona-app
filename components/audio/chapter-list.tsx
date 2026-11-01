'use client'

import React from 'react'
import { Play, ListMusic } from 'lucide-react'
import type { Episode, Chapter } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n'
import { useAudio } from './audio-context'
import { cn } from '@/lib/utils'

interface ChapterListProps {
  episode: Episode
  locale: Locale
  className?: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function ChapterList({ episode, locale, className }: ChapterListProps) {
  const { currentTrack, currentTime, isPlaying, playTrack, seek } = useAudio()

  const chapters = episode.chapters
  if (!chapters || chapters.length === 0) return null

  const isCurrentTrack = currentTrack?.id === episode.id

  // Sort chapters by start time
  const sortedChapters = [...chapters].sort((a, b) => a.start - b.start)

  // Find active chapter containing currentTime
  let activeChapterId: string | null = null
  if (isCurrentTrack) {
    for (let i = 0; i < sortedChapters.length; i++) {
      const ch = sortedChapters[i]
      const nextCh = sortedChapters[i + 1]
      if (currentTime >= ch.start && (!nextCh || currentTime < nextCh.start)) {
        activeChapterId = ch.id
        break
      }
    }
  }

  const handleChapterClick = (chapter: Chapter) => {
    if (currentTrack?.id !== episode.id) {
      playTrack(episode, false, chapter.start)
    }
    seek(chapter.start)
  }

  const isHi = locale === 'hi'

  return (
    <section
      aria-label={isHi ? 'अध्याय सूची' : 'Chapters'}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs backdrop-blur-xs',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <ListMusic className="size-4 text-purple-600 dark:text-purple-400" />
          <span>{isHi ? 'अध्याय' : 'Chapters'}</span>
          <span className="text-xs font-normal text-muted-foreground">({sortedChapters.length})</span>
        </h3>
        {isCurrentTrack && isPlaying && (
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 animate-pulse">
            {isHi ? 'अभी चल रहा है' : 'Playing'}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5" role="list">
        {sortedChapters.map((chapter, idx) => {
          const isActive = isCurrentTrack && activeChapterId === chapter.id
          const title = chapter.title[locale] || chapter.title.en || chapter.title.hi

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => handleChapterClick(chapter)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'group flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
                isActive
                  ? 'bg-purple-500/15 border border-purple-500/40 font-bold text-foreground shadow-xs'
                  : 'border border-transparent hover:bg-muted/70 text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-xs'
                      : 'bg-muted group-hover:bg-muted-foreground/20 text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {isActive && isPlaying ? (
                    <Play className="size-3 fill-current animate-pulse translate-x-px" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </span>
                <span className="truncate">{title}</span>
              </div>
              <span
                className={cn(
                  'shrink-0 font-mono text-xs tabular-nums',
                  isActive ? 'font-bold text-purple-600 dark:text-purple-300' : 'text-muted-foreground'
                )}
              >
                {formatTime(chapter.start)}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
