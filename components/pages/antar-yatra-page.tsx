import { getEpisodes } from '@/lib/content/repository'
import { getDictionary, type Locale } from '@/lib/i18n'
import { EpisodeCard } from '@/components/home/episode-card'
import { PageHeader } from './page-header'

export async function AntarYatraPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const episodes = await getEpisodes({ premium: true })
  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader title={t.home.antarTitle} sub={t.home.antarBody} eyebrow={t.nav.premium} accent="bg-bhakti" />
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-4">
        {episodes.map((ep) => (
          <li key={ep.id}>
            <EpisodeCard locale={locale} t={t} episode={ep} className="w-full sm:w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
