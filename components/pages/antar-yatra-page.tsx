import { getEpisodes } from '@/lib/content/repository'
import { getDictionary, type Locale } from '@/lib/i18n'
import { EpisodeCard } from '@/components/home/episode-card'
import { AntarYatraSubscriptionCard } from '@/components/antar-yatra/antar-yatra-subscription-card'
import { PageHeader } from './page-header'
import { Sparkles } from 'lucide-react'

export async function AntarYatraPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const episodes = await getEpisodes({ premium: true })
  const isHi = locale === 'hi'

  return (
    <div className="flex flex-col gap-10 pb-16 animate-rise">
      <PageHeader
        title={t.home.antarTitle}
        sub={t.home.antarBody}
        eyebrow={t.nav.premium}
        accent="bg-bhakti"
      />

      {/* Complete Subscription & Patron Membership Section */}
      <AntarYatraSubscriptionCard locale={locale} t={t} variant="full" />

      {/* Episodes Grid with Premium Label */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-amber-500/20 text-amber-500">
              <Sparkles className="size-3.5" />
            </span>
            <h3 className="font-display text-xl font-bold">
              {isHi ? 'अंतर यात्रा के ख़ास एपिसोड्स' : 'Antar Yatra Episodes'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {episodes.length} {isHi ? 'एपिसोड्स उपलब्ध' : 'episodes available'}
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {episodes.map((ep) => (
            <li key={ep.id}>
              <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
