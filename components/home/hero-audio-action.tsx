'use client'

import Link from 'next/link'
import { Play, Pause, Volume2, FileText, Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Episode } from '@/lib/content/types'
import { Waveform } from './waveform'
import { LikeButton } from '@/components/like-button'
import { useAudio } from '@/components/audio/audio-context'
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

  const handleOpenTranscript = () => {
    playTrack(episode, true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Interactive Play/Pause Button connected to Global Audio Dock */}
        <button
          type="button"
          onClick={handlePlayClick}
          className={cn(
            'group inline-flex h-14 items-center gap-3 rounded-full pr-6 pl-2 font-bold shadow-xl transition-all duration-300 active:scale-95 cursor-pointer',
            isThisPlaying
              ? 'bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white ring-4 ring-purple-500/30 shadow-purple-500/40'
              : 'bg-primary text-primary-foreground hover:scale-[1.03] hover:shadow-primary/30'
          )}
          aria-label={isThisPlaying ? 'Pause Podcast' : 'Play Podcast'}
        >
          <span
            className={cn(
              'grid size-10 place-items-center rounded-full transition-transform duration-300',
              isThisPlaying
                ? 'bg-white text-[#9333EA] scale-105 shadow-md'
                : 'bg-primary-foreground text-primary group-hover:scale-105'
            )}
          >
            {isThisPlaying ? (
              <Pause className="size-5 fill-current animate-pulse" aria-hidden="true" />
            ) : (
              <Play className="size-5 translate-x-px fill-current" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span>{isThisPlaying ? (locale === 'hi' ? 'बजा रहे हैं...' : 'Playing...') : t.home.listen}</span>
            <span className="text-xs opacity-75 font-medium">
              {episode.durationMin} {t.home.min}
            </span>
          </span>
        </button>

        {/* Synchronized Transcripts Trigger Button */}
        <button
          type="button"
          onClick={handleOpenTranscript}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/15 px-4 text-xs font-extrabold text-white backdrop-blur transition-all duration-300 hover:bg-purple-500/30 hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-purple-500/10"
        >
          <FileText className="size-4 text-purple-300" />
          <span>{locale === 'hi' ? 'द्विभाषी बोल (Transcripts)' : 'Bilingual Lyrics'}</span>
        </button>

        {/* Full Episode Link */}
        <Link
          href={localePath(locale, `/podcasts/${episode.slug}`)}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          {locale === 'hi' ? 'पूरा एपिसोड' : 'Full Episode'}
        </Link>

        {/* Like Button */}
        <LikeButton id={episode.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={22} tone="ink" />

        {/* Interactive Waveform connected to global playback */}
        <Waveform
          playing={isThisPlaying}
          interactive
          onToggle={handlePlayClick}
          className="hidden sm:flex"
        />
      </div>

      {isThisPlaying && (
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 animate-rise">
          <Volume2 className="size-4 animate-pulse" />
          <span>
            {locale === 'hi'
              ? 'ग्लोबल ऑडियो डॉक सक्रिय है · नीचे डॉक और ट्रांसक्रिप्ट देखें'
              : 'Global Audio Dock Active · Check sticky bar below'}
          </span>
        </div>
      )}
    </div>
  )
}
