import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/content/seed'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Story } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { LikeButton } from '@/components/like-button'
import { FormatChips } from './format-chips'

export function StoryCard({
  locale,
  t,
  story,
  className,
}: {
  locale: Locale
  t: Dictionary
  story: Story
  className?: string
}) {
  const s = sectionStyle[story.category]
  const cat = categories.find((c) => c.key === story.category)
  return (
    <article className={cn('flex w-72 flex-col gap-3 sm:w-80 transition-all duration-300 hover:-translate-y-1.5', className)}>
      <Link
        href={localePath(locale, `/${cat?.slug ?? story.category}/${story.slug}`)}
        className="group flex flex-col gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm group-hover:shadow-2xl group-hover:shadow-purple-500/15 transition-all duration-500">
          <Image
            src={story.image || '/placeholder.svg'}
            alt=""
            fill
            sizes="320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-ink via-ink/80 to-transparent p-4 pt-16 text-ink-foreground">
            <span className={cn('w-fit rounded-full px-2.5 py-0.5 text-[11px] font-extrabold text-primary-foreground', s.bg)}>
              {cat?.name[locale]}
            </span>
            <h3 className="line-clamp-3 font-display text-xl leading-tight font-bold text-balance">{story.title[locale]}</h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-ink-foreground/75">{story.dek[locale]}</p>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-3">
        <FormatChips locale={locale} t={t} formats={story.formats} />
        <LikeButton id={story.id} label={locale === 'hi' ? 'पसंद करें' : 'Like'} size={16} className="shrink-0" />
      </div>
    </article>
  )
}
