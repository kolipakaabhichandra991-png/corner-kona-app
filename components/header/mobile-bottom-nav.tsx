'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AudioWaveform, CirclePlay, Ellipsis, House, Sparkles, UserRound } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { MoreMenu } from './more-menu'

export function MobileBottomNav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const pathname = usePathname()
  const items = [
    { href: localePath(locale), label: t.nav.home, icon: House },
    { href: localePath(locale, '/podcasts'), label: t.nav.podcasts, icon: AudioWaveform },
    { href: localePath(locale, '/videos'), label: t.nav.videosShort, icon: CirclePlay },
    { href: localePath(locale, '/antar-yatra'), label: t.nav.antarYatra, icon: Sparkles, accent: true },
    { href: localePath(locale, '/profile'), label: t.nav.profile, icon: UserRound },
  ]

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-6">
        {items.map(({ href, label, icon: Icon, accent }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-11 place-items-center rounded-full transition-colors',
                    active && 'bg-primary text-primary-foreground',
                    accent && !active && 'animate-glow bg-antar/15 text-antar',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="max-w-full truncate px-0.5">{label}</span>
              </Link>
            </li>
          )
        })}
        <li>
          <MoreMenu locale={locale} t={t}>
            <button
              type="button"
              className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid h-7 w-11 place-items-center rounded-full">
                <Ellipsis className="size-5" aria-hidden="true" />
              </span>
              {t.nav.more}
            </button>
          </MoreMenu>
        </li>
      </ul>
    </nav>
  )
}
