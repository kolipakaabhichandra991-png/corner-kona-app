'use client'

import { Play, Pause, FileText, Sparkles, Volume2 } from 'lucide-react'
import type { Episode } from '@/lib/content/types'
import { useAudio } from '@/components/audio/audio-context'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function EpisodePlayAction({
  locale,
  episode,
}: {
  locale: Locale
  episode: Episode
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay, setTranscriptOpen } = useAudio()

  const isThisPlaying = currentTrack?.id === episode.id && isPlaying
  const isThisCurrent = currentTrack?.id === episode.id

  const handlePlayClick = () => {
    if (isThisCurrent) {
      togglePlay()
    } else {
      playTrack(episode)
    }
  }

  const isHi = locale === 'hi'

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Play Now Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          className={cn(
            'inline-flex h-13 items-center gap-2.5 rounded-full px-6 font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer',
            isThisPlaying
              ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white ring-4 ring-purple-500/30'
              : 'bg-primary text-primary-foreground hover:shadow-primary/30'
          )}
        >
          {isThisPlaying ? (
            <Pause className="size-5 fill-current animate-pulse" />
          ) : (
            <Play className="size-5 fill-current translate-x-px" />
          )}
          <span>
            {isThisPlaying
              ? isHi
                ? 'अभी चल रहा है (Pause)'
                : 'Pause Audio'
              : isHi
              ? 'अभी सुनें (Listen Now)'
              : 'Listen Now'}
          </span>
        </button>

        {/* View Synchronized Transcript Button */}
        <button
          type="button"
          onClick={() => playTrack(episode, true)}
          className="inline-flex h-13 items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-5 text-sm font-extrabold text-foreground hover:bg-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-xs"
        >
          <FileText className="size-4 text-purple-500" />
          <span>{isHi ? 'द्विभाषी ट्रांसक्रिप्ट (Bilingual Transcript)' : 'Synchronized Transcript'}</span>
        </button>
      </div>

      {isThisPlaying && (
        <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-300 animate-rise">
          <Volume2 className="size-3.5 animate-pulse" />
          {isHi ? 'ग्लोबल ऑडियो डॉक में सक्रिय है' : 'Streaming in Global Sticky Audio Dock'}
        </span>
      )}
    </div>
  )
}
