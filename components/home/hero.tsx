'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Flame, Headphones, Play, Sparkles, Star, Video } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { HomePayload } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { FormatChips } from './format-chips'
import { HeroAudioAction } from './hero-audio-action'

export function Hero({ locale, t, hero }: { locale: Locale; t: Dictionary; hero: HomePayload['hero'] }) {
  const { episode } = hero
  const s = sectionStyle[episode.category] ?? { bg: 'bg-primary', text: 'text-primary' }

  return (
    <section aria-labelledby="hero-title" className="relative mx-auto w-full max-w-7xl px-4 pt-3 md:px-6 md:pt-6">
      {/* Dynamic Aurora Ambient Glow behind the card */}
      <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2.5rem] bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-amber-500/30 blur-2xl dark:from-purple-900/40 dark:via-pink-900/30 dark:to-amber-900/40 opacity-70 animate-pulse" />

      <div className="relative isolate overflow-hidden rounded-3xl bg-ink text-ink-foreground border border-ink-foreground/15 shadow-2xl md:corner-cut">
        {/* Background Image with Cinematic Overlay */}
        <Image
          src={episode.image || '/placeholder.svg'}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 object-cover opacity-60 transition-transform duration-700 md:object-[70%_center] hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/20 md:bg-gradient-to-r md:from-ink md:via-ink/80 md:to-transparent" />

        <div className="flex min-h-[34rem] flex-col justify-end gap-5 p-6 sm:p-10 md:min-h-[38rem] md:max-w-3xl md:p-14">
          {/* Top Live Badges & Highlights */}
          <div className="flex flex-wrap items-center gap-2 animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1 text-xs font-black tracking-wide text-white uppercase shadow-lg shadow-purple-600/30">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t.home.featured}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <Flame className="size-3 text-amber-300" aria-hidden="true" />
              {locale === 'hi' ? '#1 ट्रेंडिंग शो' : '#1 Trending'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm border border-white/10">
              <Headphones className="size-3 text-cyan-400" aria-hidden="true" />
              {episode.durationMin} {locale === 'hi' ? 'मिनट' : 'mins'}
            </span>
            <span className={cn('text-sm font-bold tracking-wide', s.text)}>{hero.kicker}</span>
          </div>

          {/* Show Title & Kicker */}
          <div className="flex flex-col gap-3 animate-rise [animation-delay:80ms]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-ink-foreground/60">{episode.show[locale]}</span>
              <span className="text-ink-foreground/40">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                <Star className="size-3 fill-current" /> 4.9 (2.4k+ {locale === 'hi' ? 'समीक्षाएँ' : 'reviews'})
              </span>
            </div>

            <h1 id="hero-title" className="text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl md:text-6xl drop-shadow-md">
              {episode.title[locale]}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-pretty text-ink-foreground/80 md:text-lg">
              {hero.summary}
            </p>
          </div>

          {/* Interactive Play & Audio Action */}
          <div className="animate-rise [animation-delay:160ms]">
            <HeroAudioAction locale={locale} t={t} episode={episode} />
          </div>

          {/* Available Format Tags */}
          <div className="flex flex-wrap items-center gap-3 animate-rise [animation-delay:240ms] pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-foreground/50">
              {locale === 'hi' ? 'उपलब्ध फ़ॉर्मेट:' : 'Available in:'}
            </span>
            <FormatChips locale={locale} t={t} formats={episode.formats} tone="ink" />
          </div>
        </div>
      </div>
    </section>
  )
}
