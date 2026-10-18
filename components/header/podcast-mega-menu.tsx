'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, AudioWaveform, BookOpen, ChevronDown, Play } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Category, Episode } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'

interface Props {
  locale: Locale
  t: Dictionary
  latest: Episode[]
  categories: Category[]
}

export function PodcastMegaMenu({ locale, t, latest, categories }: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const show = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  const [lead, ...rest] = latest

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
          open && 'bg-muted',
        )}
      >
        <AudioWaveform className="size-4" aria-hidden="true" />
        {t.nav.podcastsLong}
        <ChevronDown className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-0 w-[min(46rem,calc(100vw-2rem))] pt-3"
      >
        <div className="grid animate-rise grid-cols-5 gap-6 rounded-2xl border bg-popover p-5 text-popover-foreground shadow-2xl">
          <div className="col-span-3 flex flex-col gap-3">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{t.mega.latest}</p>
            {lead && (
              <Link
                href={localePath(locale, `/podcasts/${lead.slug}`)}
                onClick={() => setOpen(false)}
                className="group relative flex overflow-hidden rounded-xl bg-ink text-ink-foreground"
              >
                <Image
                  src={lead.image || '/placeholder.svg'}
                  alt=""
                  width={160}
                  height={160}
                  className="size-28 shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-col justify-center gap-1 p-4">
                  <span className={cn('text-xs font-bold', sectionStyle[lead.category].text)}>{lead.show[locale]}</span>
                  <span className="line-clamp-2 font-display text-base leading-snug font-bold">{lead.title[locale]}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Play className="size-3.5 fill-current" aria-hidden="true" />
                    {t.mega.play}
                  </span>
                </div>
              </Link>
            )}
            <ul className="flex flex-col">
              {rest.map((ep) => (
                <li key={ep.id}>
                  <Link
                    href={localePath(locale, `/podcasts/${ep.slug}`)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Play className="size-3.5 fill-current" aria-hidden="true" />
                      <span className="sr-only">{t.mega.play}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{ep.title[locale]}</span>
                      <span className="block text-xs text-muted-foreground">
                        {ep.show[locale]} · {ep.durationMin} {t.home.min}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 flex flex-col gap-3 border-l pl-6">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{t.mega.categories}</p>
            <ul className="flex flex-col gap-0.5">
              {categories.map((c) => (
                <li key={c.key}>
                  <Link
                    href={localePath(locale, `/podcasts?topic=${c.slug}`)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <span className={cn('size-2.5 rounded-full', sectionStyle[c.key].bg)} aria-hidden="true" />
                    {c.name[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={localePath(locale, '/podcasts?kind=audiobook')}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <BookOpen className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  {t.mega.audiobooks}
                </Link>
              </li>
            </ul>
            <Link
              href={localePath(locale, '/podcasts')}
              onClick={() => setOpen(false)}
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
            >
              {t.mega.browseAll}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
