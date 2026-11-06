'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Play, Volume2, Video, Pause, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Episode } from '@/lib/content/types'
import { useAudio } from '@/components/audio/audio-context'

export function MediaStage({
  image,
  label,
  note,
  ratio = 'aspect-square',
  priority,
  episode,
  isVideo = false,
  youtubeId,
}: {
  image: string
  label: string
  note: string
  ratio?: string
  priority?: boolean
  episode?: Episode
  isVideo?: boolean
  youtubeId?: string
}) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(isVideo)
  const { currentTrack, isPlaying, playTrack, togglePlay, pauseTrack } = useAudio()

  const isAudioPlaying = episode && currentTrack?.id === episode.id && isPlaying
  const activeYtId = youtubeId || episode?.youtubeId || 'dQw4w9WgXcQ'

  const handlePlayClick = () => {
    if (isVideo || activeYtId) {
      pauseTrack()
      setIsPlayingVideo(true)
    } else if (episode) {
      if (currentTrack?.id === episode.id) {
        togglePlay()
      } else {
        playTrack(episode)
      }
    }
  }

  // Active YouTube/Video Player
  if (isPlayingVideo) {
    return (
      <div className={cn('relative isolate overflow-hidden rounded-3xl bg-black shadow-2xl border border-border/40', isVideo ? 'aspect-video' : 'aspect-video w-full')}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${activeYtId}?autoplay=1&rel=0&modestbranding=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="size-full border-0"
        />
        <button
          type="button"
          onClick={() => setIsPlayingVideo(false)}
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md hover:bg-black transition-colors"
          aria-label="Close video player"
        >
          <X className="size-3.5" />
          <span>Close</span>
        </button>
      </div>
    )
  }

  return (
    <figure className={cn('group relative isolate overflow-hidden rounded-3xl bg-ink text-ink-foreground shadow-lg transition-all', ratio)}>
      <Image
        src={image || '/placeholder.svg'}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 560px, 100vw"
        className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

      {/* Badges / Header overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {isVideo ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-black text-white shadow-md backdrop-blur">
            <Video className="size-3.5" />
            YouTube Video Podcast
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-black text-primary-foreground shadow-md backdrop-blur">
            <Volume2 className="size-3.5" />
            Audio Experience
          </span>
        )}

        {episode?.premium && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-black text-white shadow-md">
            <Sparkles className="size-3" />
            Antar Yatra
          </span>
        )}
      </div>

      {/* Bottom Interactive Play Trigger */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-5 md:p-6">
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label={label}
          className="group/btn relative grid size-16 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="absolute -inset-1 rounded-full bg-primary/40 animate-ping opacity-60 pointer-events-none" />
          {isAudioPlaying ? (
            <Pause className="size-7 fill-current" aria-hidden="true" />
          ) : (
            <Play className="size-7 translate-x-0.5 fill-current" aria-hidden="true" />
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-white group-hover:text-primary transition-colors">
            {isVideo ? 'Watch Episode on YouTube' : isAudioPlaying ? 'Pause Audio' : 'Play Episode'}
          </span>
          <span className="text-xs font-medium text-white/70">{note}</span>
        </div>
      </figcaption>
    </figure>
  )
}
