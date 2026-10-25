import Link from 'next/link'
import { ArrowLeft, Eye, Film } from 'lucide-react'
import { getCategories, getCategory, getShorts } from '@/lib/content/repository'
import type { Short } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { ShortCard } from '@/components/home/short-card'
import { InstagramStoryViewer } from '@/components/videos/instagram-story-viewer'
import { CategoryStoryTray } from '@/components/videos/category-story-tray'

export async function ShortPage({ locale, short }: { locale: Locale; short: Short }) {
  const t = getDictionary(locale)
  const s = sectionStyle[short.category]
  const [category, allCategories, allShorts] = await Promise.all([
    getCategory(short.category),
    getCategories(),
    getShorts(),
  ])
  const more = allShorts.filter((x) => x.id !== short.id)

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Top Breadcrumb & Category Bar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-4 md:px-6">
        <Link
          href={localePath(locale, '/videos')}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {locale === 'hi' ? 'सभी वीडियो पर वापस' : 'Back to all videos'}
        </Link>

        {category && (
          <span className={cn('rounded-full px-3 py-1 text-xs font-black text-white shadow-sm', s.bg)}>
            {category.name[locale]}
          </span>
        )}
      </div>

      {/* Category Stories Tray */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-card/60 p-4 shadow-xl backdrop-blur-md">
          <CategoryStoryTray
            locale={locale}
            categories={allCategories}
            shorts={allShorts}
            activeCategoryKey={short.category}
          />
        </div>
      </div>

      {/* Centerpiece: Interactive Instagram Story Viewer */}
      <section aria-label="Story Player" className="flex flex-col items-center justify-center px-4">
        <InstagramStoryViewer
          locale={locale}
          categories={allCategories}
          shorts={allShorts}
          initialCategoryKey={short.category}
          initialShortSlug={short.slug}
        />
      </section>

      {/* More Shorts in Grid */}
      <section aria-labelledby="more-h" className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-6 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between">
          <h2 id="more-h" className="text-2xl font-extrabold tracking-tight">
            {t.pages.moreShorts}
          </h2>
          <span className="text-xs text-muted-foreground">
            {more.length} {locale === 'hi' ? 'अन्य वीडियो' : 'more clips'}
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {more.map((x) => (
            <li key={x.id}>
              <ShortCard locale={locale} short={x} className="w-full sm:w-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
