'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EpisodeCard } from '@/components/home/episode-card'
import { ShortCard } from '@/components/home/short-card'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import type { Episode, Short } from '@/lib/content/types'

export function CollectionPage({ locale, mode, episodes, shorts }: { locale: Locale; mode: 'podcasts' | 'videos'; episodes: Episode[]; shorts: Short[] }) {
  const t = getDictionary(locale)
  const isVideos = mode === 'videos'
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <Link href={localePath(locale)} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {t.pages.back}
      </Link>
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Corner Kona</p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">{isVideos ? t.nav.videos : t.nav.podcastsLong}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{isVideos ? t.pages.videosSub : t.pages.podcastsSub}</p>
      </header>
      {isVideos ? (
        <section aria-labelledby="videos-title" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <h2 id="videos-title" className="sr-only">{t.nav.videos}</h2>
          {shorts.map((short) => <ShortCard key={short.id} locale={locale} short={short} className="w-full" />)}
        </section>
      ) : (
        <section aria-labelledby="podcasts-title" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <h2 id="podcasts-title" className="sr-only">{t.nav.podcastsLong}</h2>
          {episodes.map((episode) => <EpisodeCard key={episode.id} locale={locale} t={t} episode={episode} />)}
        </section>
      )}
      {!episodes.length && !shorts.length && <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">{t.pages.noResults}</p>}
    </div>
  )
}
