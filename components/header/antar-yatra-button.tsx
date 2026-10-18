'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ChevronDown } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { AntarYatraSubscriptionCard } from '@/components/antar-yatra/antar-yatra-subscription-card'

export function AntarYatraButton({ locale, t, className }: { locale: Locale; t: Dictionary; className?: string }) {
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
    closeTimer.current = setTimeout(() => setOpen(false), 160)
  }

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative inline-flex h-10 animate-glow items-center gap-2 rounded-full border border-antar/60 bg-antar/15 px-3.5 text-sm font-bold text-foreground transition-all duration-300 hover:bg-antar/25 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-antar cursor-pointer shadow-sm',
          open && 'bg-antar/30 ring-2 ring-antar/50',
          className,
        )}
      >
        <Sparkles className="size-4 text-antar" aria-hidden="true" />
        <span>{t.nav.antarYatra}</span>
        <span className="rounded-full bg-antar px-1.5 py-0.5 text-[10px] leading-none font-extrabold tracking-wide text-primary-foreground uppercase">
          {t.nav.premium}
        </span>
        <ChevronDown
          className={cn('size-3.5 text-antar transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Flyout panel under Antar Yatra button with the full subscription details */}
      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-0 z-50 mt-2 w-[22rem] sm:w-[25rem] animate-rise"
      >
        <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-card/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <AntarYatraSubscriptionCard
            locale={locale}
            t={t}
            variant="dropdown"
            onComplete={() => setOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
