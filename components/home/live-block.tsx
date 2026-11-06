'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clapperboard, Newspaper, Radio, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLive } from '@/hooks/use-live'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'

function timeAgo(iso: string, locale: Locale) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  return new Intl.RelativeTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { numeric: 'auto' }).format(-mins, 'minute')
}

export function LiveBlock({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { data, error, isLoading, mutate } = useLive()

  return (
    <section aria-labelledby="live-h" aria-live="polite" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-red-500/25 bg-gradient-to-br from-card via-card to-red-500/5 p-5 md:p-6 shadow-xl backdrop-blur-md">
        {/* Subtle live radar glow */}
        <div className="pointer-events-none absolute -top-14 -right-14 size-48 rounded-full bg-red-500/15 blur-2xl" />

        <div className="mb-4 flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-3" aria-hidden="true">
              {data?.active && <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75" />}
              <span className="relative inline-flex size-3 rounded-full bg-live" />
            </span>
            <h2 id="live-h" className="flex items-center gap-2 text-xl font-extrabold md:text-2xl">
              <span>{t.home.liveTitle}</span>
              <span className="rounded-full bg-live/15 px-2.5 py-0.5 text-xs font-black text-live uppercase tracking-wider">
                DESK
              </span>
            </h2>
          </div>

          {data && (
            <Link
              href={localePath(locale, `/live/${data.slug}`)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <span>{t.home.liveOpen}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3" aria-busy="true">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-sm text-muted-foreground">{t.home.liveError}</p>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => mutate()}>
              <RotateCw className="size-4" aria-hidden="true" />
              {t.home.retry}
            </Button>
          </div>
        )}

        {!isLoading && !error && !data && <p className="py-2 text-sm text-muted-foreground">{t.home.liveEmpty}</p>}

        {data && (
          <>
            <p className="mb-4 font-display text-lg leading-snug font-bold text-balance md:text-xl text-foreground/90">
              {data.title[locale]}
            </p>
            <ol className="relative flex flex-col gap-4 border-l-2 border-live/40 pl-5">
              {data.entries.slice(0, 4).map((e) => (
                <li key={e.id} className="relative group">
                  <span className="absolute top-1.5 -left-[1.6rem] size-2.5 rounded-full bg-live ring-4 ring-card transition-transform group-hover:scale-125" aria-hidden="true" />
                  <time dateTime={e.at} suppressHydrationWarning className="text-xs font-bold text-live">
                    {timeAgo(e.at, locale)}
                  </time>
                  {e.type === 'text' && <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{e.body[locale]}</p>}
                  {e.type === 'article' && e.story && (
                    <Link
                      href={localePath(locale, `/${e.story.category}/${e.story.slug}`)}
                      className="mt-1.5 flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-2.5 transition-all hover:bg-muted hover:border-primary/40 shadow-sm"
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={e.story.image || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                          <Newspaper className="size-3 text-primary" aria-hidden="true" />
                          {t.home.read}
                        </span>
                        <span className="line-clamp-2 text-sm font-bold">{e.story.title[locale]}</span>
                      </span>
                    </Link>
                  )}
                  {e.type === 'short' && e.short && (
                    <Link
                      href={localePath(locale, `/videos/${e.short.slug}`)}
                      className="mt-1.5 flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-2.5 transition-all hover:bg-muted hover:border-pink-500/40 shadow-sm"
                    >
                      <span className="relative h-16 w-9 shrink-0 overflow-hidden rounded-md">
                        <Image src={e.short.image || '/placeholder.svg'} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase">
                          <Clapperboard className="size-3 text-pink-500" aria-hidden="true" />
                          {t.home.shorts}
                        </span>
                        <span className="line-clamp-2 text-sm font-bold">{e.short.title[locale]}</span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  )
}
