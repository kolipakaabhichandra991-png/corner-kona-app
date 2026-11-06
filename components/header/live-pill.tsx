'use client'

import Link from 'next/link'
import { useLive } from '@/hooks/use-live'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'

export function LivePill({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { data } = useLive()
  if (!data?.active) return null

  return (
    <Link
      href={localePath(locale, `/live/${data.slug}`)}
      className="inline-flex h-8 animate-rise items-center gap-2 rounded-full bg-live px-3 text-xs font-extrabold tracking-wider text-white shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-red-500/50 focus-visible:ring-2 focus-visible:ring-live focus-visible:ring-offset-2"
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-live rounded-full bg-background" />
        <span className="relative inline-flex size-2 rounded-full bg-background" />
      </span>
      {t.nav.live}
      <span className="sr-only">{data.title[locale]}</span>
    </Link>
  )
}
