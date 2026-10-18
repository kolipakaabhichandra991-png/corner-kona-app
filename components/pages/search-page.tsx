import { Search } from 'lucide-react'
import { searchContent } from '@/lib/content/repository'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { EpisodeCard } from '@/components/home/episode-card'
import { StoryCard } from '@/components/home/story-card'
import { ShortCard } from '@/components/home/short-card'
import { PageHeader } from './page-header'

export async function SearchPage({ locale, q = '' }: { locale: Locale; q?: string }) {
  const t = getDictionary(locale)
  const query = q.slice(0, 100)
  const results = await searchContent(query)
  const total = results.episodes.length + results.stories.length + results.shorts.length

  return (
    <div className="flex flex-col gap-10 pb-16">
      <PageHeader title={t.nav.search}>
        <form action={localePath(locale, '/search')} role="search" className="relative max-w-2xl">
          <label htmlFor="q" className="sr-only">
            {t.nav.search}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={t.pages.searchPlaceholder}
            maxLength={100}
            autoFocus
            className="h-14 w-full rounded-full border bg-card pr-5 pl-12 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      </PageHeader>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 md:px-6">
        {!query && <p className="text-muted-foreground">{t.pages.searchHint}</p>}
        {query && total === 0 && <p className="text-muted-foreground">{t.pages.searchEmpty}</p>}
        {query && total > 0 && (
          <p className="text-sm font-bold text-muted-foreground" aria-live="polite">
            {total} {t.pages.results}
          </p>
        )}

        {results.episodes.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {results.episodes.map((ep) => (
              <li key={ep.id}>
                <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        )}
        {results.stories.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.stories.map((s) => (
              <li key={s.id}>
                <StoryCard locale={locale} t={t} story={s} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        )}
        {results.shorts.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {results.shorts.map((s) => (
              <li key={s.id}>
                <ShortCard locale={locale} short={s} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
