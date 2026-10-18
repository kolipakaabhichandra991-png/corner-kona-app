import { getShorts } from '@/lib/content/repository'
import { getDictionary, type Locale } from '@/lib/i18n'
import { ShortCard } from '@/components/home/short-card'
import { PageHeader } from './page-header'

export async function VideosPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const shorts = await getShorts()
  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader title={t.nav.videos} sub={t.pages.videosSub} />
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-5">
        {shorts.map((s) => (
          <li key={s.id}>
            <ShortCard locale={locale} short={s} className="w-full sm:w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
