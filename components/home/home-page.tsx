import { getHome } from '@/lib/content/repository'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { Hero } from './hero'
import { FormatEntries } from './format-entries'
import { LiveBlock } from './live-block'
import { Carousel } from './carousel'
import { SectionHeading } from './section-heading'
import { EpisodeCard } from './episode-card'
import { StoryCard } from './story-card'
import { ShortCard } from './short-card'
import { CategoryCard } from './category-card'
import { AntarYatraPromo } from './antar-yatra-promo'
import { Newsletter } from './newsletter'

export async function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const home = await getHome(locale)

  return (
    <div className="flex flex-col gap-12 pb-12 md:gap-16">
      <Hero locale={locale} t={t} hero={home.hero} />
      <FormatEntries locale={locale} t={t} />

      <LiveBlock locale={locale} t={t} />

      <section aria-labelledby="episodes-h" className="flex flex-col gap-5">
        <SectionHeading id="episodes-h" title={t.home.episodes} sub={t.home.episodesSub} href={localePath(locale, '/podcasts')} />
        <Carousel label={t.home.episodes} prev={t.home.prev} next={t.home.next}>
          {home.episodes.map((ep) => (
            <EpisodeCard key={ep.id} locale={locale} t={t} episode={ep} />
          ))}
        </Carousel>
      </section>

      <section aria-labelledby="shorts-h" className="flex flex-col gap-5">
        <SectionHeading id="shorts-h" title={t.home.shorts} sub={t.home.shortsSub} href={localePath(locale, '/videos')} />
        <Carousel label={t.home.shorts} prev={t.home.prev} next={t.home.next}>
          {home.shorts.map((s) => (
            <ShortCard key={s.id} locale={locale} short={s} />
          ))}
        </Carousel>
      </section>

      <section aria-labelledby="stories-h" className="flex flex-col gap-5">
        <SectionHeading id="stories-h" title={t.home.stories} sub={t.home.storiesSub} />
        <Carousel label={t.home.stories} prev={t.home.prev} next={t.home.next}>
          {home.stories.map((s) => (
            <StoryCard key={s.id} locale={locale} t={t} story={s} />
          ))}
        </Carousel>
      </section>

      <AntarYatraPromo locale={locale} t={t} episodes={home.antarYatra} />

      <section aria-labelledby="sections-h" className="flex flex-col gap-5">
        <SectionHeading id="sections-h" title={t.home.sections} />
        <Carousel label={t.home.sections} prev={t.home.prev} next={t.home.next}>
          {home.categories.map((c) => (
            <CategoryCard key={c.key} locale={locale} category={c} />
          ))}
        </Carousel>
      </section>

      <Newsletter t={t} />
    </div>
  )
}
