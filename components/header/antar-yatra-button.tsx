'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function AntarYatraButton({
  locale,
  t,
  className,
}: {
  locale: Locale
  t: Dictionary
  className?: string
}) {
  const pathname = usePathname()
  const targetHref = localePath(locale, '/antar-yatra')
  const isActive = pathname === targetHref || pathname?.startsWith(targetHref + '/')

  return (
    <Link
      href={targetHref}
      aria-label={t.nav.antarYatra}
      className={cn(
        'relative inline-flex h-10 animate-glow items-center gap-2 rounded-full border border-antar/60 bg-antar/15 px-4 text-sm font-bold text-foreground transition-all duration-300 hover:bg-antar/25 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-antar cursor-pointer shadow-sm',
        isActive && 'bg-antar/30 ring-2 ring-antar/60 shadow-amber-500/20',
        className,
      )}
    >
      <Sparkles className="size-4 text-antar" aria-hidden="true" />
      <span>{t.nav.antarYatra}</span>
      <span className="rounded-full bg-antar px-1.5 py-0.5 text-[10px] leading-none font-extrabold tracking-wide text-primary-foreground uppercase">
        {t.nav.premium}
      </span>
    </Link>
  )
}
