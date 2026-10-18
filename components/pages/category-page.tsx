import { getCategoryContent } from '@/lib/content/repository'
import type { Category } from '@/lib/content/types'
import { getDictionary, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { EpisodeCard } from '@/components/home/episode-card'
import { StoryCard } from '@/components/home/story-card'
import { ShortCard } from '@/components/home/short-card'
import { PageHeader } from './page-header'

export async function CategoryPage({ locale, category }: { locale: Locale; category: Category }) {
  const t = getDictionary(locale)
  const { episodes, stories, shorts } = await getCategoryContent(category.key)
  const empty = episodes.length + stories.length + shorts.length === 0

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHeader title={category.name[locale]} sub={category.blurb[locale]} accent={sectionStyle[category.key].bg} />

      {empty && (
        <p className="mx-auto w-full max-w-7xl px-4 text-muted-foreground md:px-6">{t.pages.noResults}</p>
      )}

      {stories.length > 0 && (
        <Block id="cat-stories" title={t.home.stories}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <li key={s.id}>
                <StoryCard locale={locale} t={t} story={s} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </Block>
      )}

      {episodes.length > 0 && (
        <Block id="cat-episodes" title={t.home.episodes}>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {episodes.map((ep) => (
              <li key={ep.id}>
                <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </Block>
      )}

      {shorts.length > 0 && (
        <Block id="cat-shorts" title={t.home.shorts}>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((s) => (
              <li key={s.id}>
                <ShortCard locale={locale} short={s} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  )
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 md:px-6">
      <h2 id={id} className="text-2xl font-extrabold">
        {title}
      </h2>
      {children}
    </section>
  )
}
