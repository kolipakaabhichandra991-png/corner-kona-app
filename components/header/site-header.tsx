'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CirclePlay } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Category, Episode } from '@/lib/content/types'
import { cn } from '@/lib/utils'
import { PodcastMegaMenu } from './podcast-mega-menu'
import { AntarYatraButton } from './antar-yatra-button'
import { LanguagePill } from './language-pill'
import { LivePill } from './live-pill'
import { HeaderActions } from './header-actions'

interface Props {
  locale: Locale
  t: Dictionary
  latest: Episode[]
  categories: Category[]
}

export function SiteHeader({ locale, t, latest, categories }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border-border bg-background/85 shadow-sm backdrop-blur-xl'
          : 'border-transparent bg-background',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center gap-3 px-4 transition-[height] duration-300 md:px-6',
          scrolled ? 'h-14' : 'h-16 md:h-20',
        )}
      >
        <Link href={localePath(locale)} aria-label="Home" className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring">
          <Logo compact={scrolled} />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 lg:flex">
          <PodcastMegaMenu locale={locale} t={t} latest={latest} categories={categories} />
          <Link
            href={localePath(locale, '/videos')}
            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <CirclePlay className="size-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
            {t.nav.videos}
          </Link>
          <AntarYatraButton locale={locale} t={t} className="ml-1" />
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LivePill locale={locale} t={t} />
          <LanguagePill locale={locale} t={t} />
          <HeaderActions locale={locale} t={t} />
        </div>
      </div>
    </header>
  )
}
