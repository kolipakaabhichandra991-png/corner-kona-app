import Link from 'next/link'
import { ArrowUpRight, AudioWaveform, CirclePlay, Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function FormatEntries({ locale, t }: { locale: Locale; t: Dictionary }) {
  const entries = [
    {
      href: localePath(locale, '/podcasts'),
      label: t.nav.podcastsLong,
      sub: t.home.episodesSub,
      icon: AudioWaveform,
      className: 'bg-primary text-primary-foreground',
    },
    {
      href: localePath(locale, '/videos'),
      label: t.nav.videos,
      sub: t.home.shortsSub,
      icon: CirclePlay,
      className: 'bg-ink text-ink-foreground',
    },
    {
      href: localePath(locale, '/antar-yatra'),
      label: t.nav.antarYatra,
      sub: t.nav.premium,
      icon: Sparkles,
      className: 'bg-antar/15 text-foreground ring-1 ring-antar/50 ring-inset',
    },
  ]

  return (
    <nav aria-label="Formats" className="mx-auto -mt-6 w-full max-w-7xl px-4 md:-mt-8 md:px-6">
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {entries.map(({ href, label, sub, icon: Icon, className }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'group flex h-full flex-col gap-3 rounded-2xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:p-4 cursor-pointer',
                className,
              )}
            >
              <span className="flex items-center justify-between sm:contents">
                <Icon className="size-6 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-7" aria-hidden="true" />
                <ArrowUpRight className="size-4 opacity-60 transition-all duration-300 group-hover:rotate-45 group-hover:scale-125 group-hover:opacity-100 sm:order-last sm:ml-auto" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-display text-sm leading-tight font-bold sm:text-base">{label}</span>
                <span className="hidden truncate text-xs opacity-70 sm:block">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
