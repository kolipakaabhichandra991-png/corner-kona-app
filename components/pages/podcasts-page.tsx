import { getCategories, getEpisodes } from '@/lib/content/repository'
import type { Episode } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { EpisodeCard } from '@/components/home/episode-card'
import { FilterPill, PageHeader } from './page-header'

interface PodcastsPageProps {
  locale: Locale
  topic?: string
  kind?: string
  release?: string
}

export async function PodcastsPage({ locale, topic, kind, release }: PodcastsPageProps) {
  const t = getDictionary(locale)
  const isHi = locale === 'hi'
  const validKind = kind === 'podcast' || kind === 'audiobook' ? (kind as Episode['kind']) : undefined
  const validRelease = release === 'series' || release === 'standalone' ? (release as 'series' | 'standalone') : undefined

  const [categories, episodes] = await Promise.all([
    getCategories(),
    getEpisodes({ topic, kind: validKind, releaseType: validRelease, premium: false }),
  ])

  const href = (next: { topic?: string; kind?: string; release?: string }) => {
    const params = new URLSearchParams()
    if (next.topic !== undefined ? next.topic : topic) params.set('topic', (next.topic !== undefined ? next.topic : topic)!)
    if (next.kind !== undefined ? next.kind : validKind) params.set('kind', (next.kind !== undefined ? next.kind : validKind)!)
    if (next.release !== undefined ? next.release : validRelease) params.set('release', (next.release !== undefined ? next.release : validRelease)!)
    const qs = params.toString()
    return localePath(locale, `/podcasts${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader title={t.nav.podcastsLong} sub={t.pages.podcastsSub}>
        <nav aria-label={t.mega.categories} className="flex flex-col gap-3">
          {/* Release Format: Series vs Individual Episodes (Client Requirement) */}
          <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-border/40">
            <span className="text-xs font-bold text-muted-foreground mr-1">
              {isHi ? 'प्रारूप:' : 'Format:'}
            </span>
            <FilterPill href={href({ release: '' })} active={!validRelease}>
              {isHi ? 'सभी रिलीज़ (All)' : 'All Releases'}
            </FilterPill>
            <FilterPill href={href({ release: 'series' })} active={validRelease === 'series'}>
              {isHi ? '📺 सीरीज़ व धारावाहिक (Series)' : '📺 Series & Shows'}
            </FilterPill>
            <FilterPill href={href({ release: 'standalone' })} active={validRelease === 'standalone'}>
              {isHi ? '🎧 एकल एपिसोड व टाइटल्स (Single)' : '🎧 Individual Episodes / Titles'}
            </FilterPill>
          </div>

          {/* Topics & Categories */}
          <div className="flex flex-wrap gap-2">
            <FilterPill href={href({ topic: '' })} active={!topic}>
              {t.pages.allTopics}
            </FilterPill>
            {categories.map((c) => (
              <FilterPill key={c.key} href={href({ topic: c.slug })} active={topic === c.slug}>
                {c.name[locale]}
              </FilterPill>
            ))}
          </div>

          {/* Media Kind: Podcasts vs Audiobooks */}
          <div className="flex flex-wrap gap-2">
            <FilterPill href={href({ kind: '' })} active={!validKind}>
              {t.pages.allKinds}
            </FilterPill>
            <FilterPill href={href({ kind: 'podcast' })} active={validKind === 'podcast'}>
              {t.pages.podcastKind}
            </FilterPill>
            <FilterPill href={href({ kind: 'audiobook' })} active={validKind === 'audiobook'}>
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
