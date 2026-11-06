'use client'

import { useState } from 'react'
import {
  Play,
  Pause,
  FileText,
  Volume2,
  Video,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils' // adjust if your path differs
import type { Episode } from '@/lib/content/types'
import { useAudio } from '@/components/audio/audio-context'
import type { Locale } from '@/lib/i18n'

function getYouTubeId(url: string) {
  const m = url.match(
    /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/
  )
  return m ? m[1] : null
}

export function EpisodePlayAction({
  locale,
  episode,
}: {
  locale: Locale
  episode: Episode
}) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    pauseTrack,
  } = useAudio()

  const [showVideo, setShowVideo] = useState(false)

  const isThisPlaying =
    currentTrack?.id === episode.id && isPlaying

  const isThisCurrent =
    currentTrack?.id === episode.id

  const audioUrl = episode.formats.find(
    (f) => f.format === 'audio'
  )?.href

  const videoUrl = episode.formats.find(
    (f) => f.format === 'video'
  )?.href

  const ytId = videoUrl ? getYouTubeId(videoUrl) : null

  const isHi = locale === 'hi'

  // Listen Audio: close video, then play/pause audio
  const handlePlayClick = () => {
    setShowVideo(false)
    if (isThisCurrent) {
      togglePlay()
    } else {
      playTrack(episode)
    }
  }

  // Watch Video: pause audio, then open video
  const handleWatchVideo = () => {
    pauseTrack()
    setShowVideo(true)
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        {audioUrl && (
          <button
            type="button"
            onClick={handlePlayClick}
            className={cn(
              'inline-flex h-13 items-center gap-2.5 rounded-full px-6 font-bold text-sm shadow-xl transition-all hover:scale-105',
              isThisPlaying
                ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white'
                : 'bg-primary text-primary-foreground'
            )}
          >
            {isThisPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}

            {isThisPlaying
              ? isHi
                ? 'ऑडियो रोकें'
                : 'Pause Audio'
              : isHi
                ? 'अभी सुनें'
                : 'Listen Now'}
          </button>
        )}

        {videoUrl && (
          <button
            type="button"
            onClick={handleWatchVideo}
            className="inline-flex h-13 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-red-700"
          >
            <Video className="size-5" />
            {isHi ? 'वीडियो देखें' : 'Watch Video'}
          </button>
        )}

        <button
          type="button"
          onClick={() => playTrack(episode, true)}
          className="inline-flex h-13 items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-5 text-sm font-bold hover:bg-purple-500/20"
        >
          <FileText className="size-4 text-purple-500" />
          {isHi ? 'ट्रांसक्रिप्ट देखें' : 'Synchronized Transcript'}
        </button>
      </div>

      {showVideo && videoUrl && (
        <div className="w-full overflow-hidden rounded-2xl border bg-black">
          <div className="flex items-center justify-between p-3 text-white">
            <span className="font-bold">
              {isHi ? 'वीडियो प्लेयर' : 'Video Player'}
            </span>

            <button
              type="button"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
              className="rounded-full p-2 hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          {ytId ? (
            <div className="aspect-video w-full">
              <iframe
                key={ytId}
                className="size-full"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title={episode.title[locale]}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-black"
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>
      )}

      {isThisPlaying && (
        <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600">
          <Volume2 className="size-3.5 animate-pulse" />
          {isHi ? 'ऑडियो चल रहा है' : 'Audio is playing'}
        </span>
      )}
    </div>
  )
}
