import { getCategories, getEpisodes } from '@/lib/content/repository'
import type { Episode } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { EpisodeCard } from '@/components/home/episode-card'
import { FilterPill, PageHeader } from './page-header'

export async function PodcastsPage({ locale, topic, kind }: { locale: Locale; topic?: string; kind?: string }) {
  const t = getDictionary(locale)
  const validKind = kind === 'podcast' || kind === 'audiobook' ? (kind as Episode['kind']) : undefined
  const [categories, episodes] = await Promise.all([
    getCategories(),
    getEpisodes({ topic, kind: validKind, premium: false }),
  ])

  const href = (next: { topic?: string; kind?: string }) => {
    const params = new URLSearchParams()
    if (next.topic) params.set('topic', next.topic)
    if (next.kind) params.set('kind', next.kind)
    const qs = params.toString()
    return localePath(locale, `/podcasts${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader title={t.nav.podcastsLong} sub={t.pages.podcastsSub}>
        <nav aria-label={t.mega.categories} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <FilterPill href={href({ kind: validKind })} active={!topic}>
              {t.pages.allTopics}
            </FilterPill>
            {categories.map((c) => (
              <FilterPill key={c.key} href={href({ topic: c.slug, kind: validKind })} active={topic === c.slug}>
                {c.name[locale]}
              </FilterPill>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill href={href({ topic })} active={!validKind}>
              {t.pages.allKinds}
            </FilterPill>
            <FilterPill href={href({ topic, kind: 'podcast' })} active={validKind === 'podcast'}>
              {t.pages.podcastKind}
            </FilterPill>
            <FilterPill href={href({ topic, kind: 'audiobook' })} active={validKind === 'audiobook'}>
              {t.mega.audiobooks}
            </FilterPill>
          </div>
        </nav>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {episodes.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">{t.pages.noResults}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {episodes.map((ep) => (
              <li key={ep.id}>
                <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
