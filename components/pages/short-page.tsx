import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { getCategory, getShorts } from '@/lib/content/repository'
import type { Short } from '@/lib/content/types'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { LikeButton } from '@/components/like-button'
import { ShortCard } from '@/components/home/short-card'
import { MediaStage } from './media-stage'

export async function ShortPage({ locale, short }: { locale: Locale; short: Short }) {
  const t = getDictionary(locale)
  const s = sectionStyle[short.category]
  const [category, all] = await Promise.all([getCategory(short.category), getShorts()])
  const more = all.filter((x) => x.id !== short.id)

  return (
    <div className="flex flex-col gap-14 pb-16">
      <article className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-6 md:flex-row md:items-end md:px-6 md:pt-10">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <MediaStage image={short.image} label={t.home.watch} note={t.pages.videoSoon} ratio="aspect-[9/16]" priority />
        </div>
        <div className="flex flex-col gap-4 md:pb-6">
          <Link
            href={localePath(locale, '/videos')}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.pages.back}
          </Link>
          {category && (
            <span className={cn('w-fit rounded-full px-3 py-1 text-xs font-extrabold text-primary-foreground', s.bg)}>
              {category.name[locale]}
            </span>
          )}
          <h1 className="font-display text-3xl leading-tight font-extrabold text-balance md:text-4xl">{short.title[locale]}</h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="size-4" aria-hidden="true" />
              {short.views} {t.pages.views}
            </span>
            <LikeButton id={short.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={18} />
          </div>
        </div>
      </article>

      <section aria-labelledby="more-h" className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 md:px-6">
        <h2 id="more-h" className="text-2xl font-extrabold">
          {t.pages.moreShorts}
        </h2>
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
