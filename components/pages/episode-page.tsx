import Link from 'next/link'
import { ArrowLeft, Clock, Sparkles } from 'lucide-react'
import { getCategory, getEpisodes } from '@/lib/content/repository'
import type { Episode } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { LikeButton } from '@/components/like-button'
import { FormatChips } from '@/components/home/format-chips'
import { EpisodeCard } from '@/components/home/episode-card'
import { MediaStage } from './media-stage'

export async function EpisodePage({ locale, episode, view }: { locale: Locale; episode: Episode; view?: string }) {
  const t = getDictionary(locale)
  const s = sectionStyle[episode.category]
  const isVideo = view === 'video' && episode.formats.some((f) => f.format === 'video')
  const [category, pool] = await Promise.all([
    getCategory(episode.category),
    getEpisodes({ premium: episode.premium }),
  ])
  const related = pool.filter((e) => e.id !== episode.id).slice(0, 4)
  const backHref = localePath(locale, episode.premium ? '/antar-yatra' : '/podcasts')

  return (
    <div className="flex flex-col gap-14 pb-16">
      <article className="mx-auto grid w-full max-w-7xl gap-8 px-4 pt-6 md:px-6 md:pt-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <MediaStage
          image={episode.image}
          label={isVideo ? t.home.watch : t.home.listen}
          note={episode.premium ? t.pages.freePreview : isVideo ? t.pages.videoSoon : t.pages.audioSoon}
          ratio={isVideo ? 'aspect-video' : 'aspect-square'}
          priority
        />
        <div className="flex flex-col gap-5">
          <Link href={backHref} className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.pages.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold text-primary-foreground', s.bg)}>
                {category.name[locale]}
              </span>
            )}
            {episode.premium && (
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-extrabold">
                <Sparkles className="size-3" aria-hidden="true" />
                {t.nav.premium}
              </span>
            )}
            {episode.kind === 'audiobook' && (
              <span className="rounded-full border px-3 py-1 text-xs font-extrabold">{t.mega.audiobooks}</span>
            )}
          </div>
          <p className={cn('text-sm font-bold', s.text)}>{episode.show[locale]}</p>
          <h1 className="font-display text-4xl leading-tight font-extrabold text-balance md:text-5xl">{episode.title[locale]}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              {episode.durationMin} {t.home.min}
            </span>
            <LikeButton id={episode.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={18} />
          </div>
          <FormatChips locale={locale} t={t} formats={episode.formats} />
          {episode.premium && (
            <Link
              href={localePath(locale, '/antar-yatra')}
              className="inline-flex h-12 w-fit items-center rounded-full bg-primary px-6 font-bold text-primary-foreground hover:opacity-90"
            >
              {t.home.antarCta}
            </Link>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-h" className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 md:px-6">
          <h2 id="related-h" className="text-2xl font-extrabold">
            {t.pages.related}
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((ep) => (
              <li key={ep.id}>
                <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
