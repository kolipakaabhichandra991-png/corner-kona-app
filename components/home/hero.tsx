import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { HomePayload } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { LikeButton } from '@/components/like-button'
import { FormatChips } from './format-chips'
import { HeroAudioAction } from './hero-audio-action'

export function Hero({ locale, t, hero }: { locale: Locale; t: Dictionary; hero: HomePayload['hero'] }) {
  const { episode } = hero
  const s = sectionStyle[episode.category]

  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-7xl px-4 pt-2 md:px-6 md:pt-4">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink text-ink-foreground md:corner-cut">
        <Image
          src={episode.image || '/placeholder.svg'}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 object-cover opacity-60 md:object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/80 md:to-transparent" />

        <div className="flex min-h-[32rem] flex-col justify-end gap-5 p-5 sm:p-8 md:min-h-[34rem] md:max-w-2xl md:p-12">
          <div className="flex flex-wrap items-center gap-2 animate-rise">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold tracking-wide text-primary-foreground uppercase">
              {t.home.featured}
            </span>
            <span className={cn('text-sm font-bold', s.text)}>{hero.kicker}</span>
          </div>

          <div className="flex flex-col gap-3 animate-rise [animation-delay:80ms]">
            <p className="text-sm font-semibold text-ink-foreground/70">{episode.show[locale]}</p>
            <h1 id="hero-title" className="text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl md:text-6xl">
              {episode.title[locale]}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-pretty text-ink-foreground/80 md:text-lg">{hero.summary}</p>
          </div>

          <div className="animate-rise [animation-delay:160ms]">
            <HeroAudioAction locale={locale} t={t} episode={episode} />
          </div>

          <div className="animate-rise [animation-delay:240ms]">
            <FormatChips locale={locale} t={t} formats={episode.formats} tone="ink" />
          </div>
        </div>
      </div>
    </section>
  )
}
