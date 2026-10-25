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
      className: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white shadow-xl shadow-purple-600/20 hover:shadow-purple-600/35 border border-purple-400/20',
    },
    {
      href: localePath(locale, '/videos'),
      label: t.nav.videos,
      sub: t.home.shortsSub,
      icon: CirclePlay,
      className: 'bg-gradient-to-br from-pink-600 via-rose-600 to-red-700 text-white shadow-xl shadow-pink-600/20 hover:shadow-pink-600/35 border border-pink-400/20',
    },
    {
      href: localePath(locale, '/antar-yatra'),
      label: t.nav.antarYatra,
      sub: locale === 'hi' ? 'विशेष पॉडकास्ट मेंबरशिप' : 'Exclusive Patron Access',
      icon: Sparkles,
      className: 'bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 border border-amber-300/30',
    },
  ]

  return (
    <nav aria-label="Formats" className="mx-auto -mt-6 w-full max-w-7xl px-4 md:-mt-8 md:px-6">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {entries.map(({ href, label, sub, icon: Icon, className }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'group flex h-full flex-row items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer backdrop-blur-md',
                className,
              )}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-6 shrink-0" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-base leading-tight font-extrabold sm:text-lg">{label}</span>
                <span className="truncate text-xs text-white/80 font-medium">{sub}</span>
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-white/25">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
