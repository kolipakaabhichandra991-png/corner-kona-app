import Image from 'next/image'
import Link from 'next/link'
import type { getLiveBlog } from '@/lib/content/repository'
import { categories } from '@/lib/content/seed'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'
import { PageHeader } from './page-header'

type Blog = NonNullable<Awaited<ReturnType<typeof getLiveBlog>>>

function timeAgo(iso: string, locale: Locale) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  return new Intl.RelativeTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { numeric: 'auto' }).format(-mins, 'minute')
}

export function LivePage({ locale, blog }: { locale: Locale; blog: Blog }) {
  const t = getDictionary(locale)
  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader title={blog.title[locale]} eyebrow={blog.active ? t.home.liveTitle : t.pages.liveEnded} accent="bg-live" />
      <ol className="mx-auto flex w-full max-w-3xl flex-col gap-6 border-l-2 border-live/40 px-4 pl-6 md:ml-[max(1.5rem,calc((100%-80rem)/2+1.5rem))]">
        {blog.entries.map((e) => (
          <li key={e.id} className="relative flex flex-col gap-1.5">
            <span className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-live ring-4 ring-background" aria-hidden="true" />
            <time dateTime={e.at} suppressHydrationWarning className="text-xs font-bold text-live">
              {timeAgo(e.at, locale)}
            </time>
            {e.type === 'text' && <p className="text-base leading-relaxed">{e.body[locale]}</p>}
            {e.type === 'article' && e.story && (
              <Link
                href={localePath(
                  locale,
                  `/${categories.find((c) => c.key === e.story!.category)?.slug ?? e.story.category}/${e.story.slug}`,
                )}
                className="flex items-center gap-4 rounded-2xl border p-3 transition-colors hover:bg-muted"
              >
                <span className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={e.story.image || '/placeholder.svg'} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{t.home.read}</span>
                  <span className="line-clamp-2 font-bold">{e.story.title[locale]}</span>
                </span>
              </Link>
            )}
            {e.type === 'short' && e.short && (
              <Link
                href={localePath(locale, `/videos/${e.short.slug}`)}
                className="flex items-center gap-4 rounded-2xl border p-3 transition-colors hover:bg-muted"
              >
                <span className="relative h-24 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={e.short.image || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{t.home.shorts}</span>
                  <span className="line-clamp-2 font-bold">{e.short.title[locale]}</span>
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
