import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function AntarYatraButton({ locale, t, className }: { locale: Locale; t: Dictionary; className?: string }) {
  return (
    <Link
      href={localePath(locale, '/antar-yatra')}
      className={cn(
        'relative inline-flex h-10 animate-glow items-center gap-2 rounded-full border border-antar/60 bg-antar/15 px-4 text-sm font-bold text-foreground transition-all duration-300 hover:bg-antar/25 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-antar cursor-pointer shadow-sm',
        className,
      )}
    >
      <Sparkles className="size-4 text-antar" aria-hidden="true" />
      {t.nav.antarYatra}
      <span className="rounded-full bg-antar px-1.5 py-0.5 text-[10px] leading-none font-extrabold tracking-wide text-primary-foreground uppercase">
        {t.nav.premium}
      </span>
    </Link>
  )
}
