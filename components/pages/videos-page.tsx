import { getCategories, getShorts } from '@/lib/content/repository'
import { getDictionary, type Locale } from '@/lib/i18n'
import { PageHeader } from './page-header'
import { VideosContainer } from '@/components/videos/videos-container'

export async function VideosPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const [categories, shorts] = await Promise.all([getCategories(), getShorts()])

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader
        title={t.nav.videos}
        sub={locale === 'hi' ? 'इंस्टाग्राम स्टाइल स्टोरीज़: टैप से अगला वीडियो, स्वाइप से नई कैटेगरी' : 'Instagram-Style Stories: Tap to advance in category, Swipe to change category'}
      />
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <VideosContainer
          locale={locale}
          categories={categories}
          shorts={shorts}
          initialCategoryKey="sports"
        />
      </div>
    </div>
  )
}
