import Link from 'next/link'
import { AudioWaveform, CirclePlay, Clapperboard, Newspaper } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { MediaFormat, MediaLink } from '@/lib/content/types'
import { cn } from '@/lib/utils'

const icons: Record<MediaFormat, typeof AudioWaveform> = {
  audio: AudioWaveform,
  video: CirclePlay,
  short: Clapperboard,
  article: Newspaper,
}

/** Shows the linked variants of one piece of content (audio ↔ video ↔ short ↔ article). */
export function FormatChips({
  locale,
  t,
  formats,
  tone = 'default',
}: {
  locale: Locale
  t: Dictionary
  formats: MediaLink[]
  tone?: 'default' | 'ink'
}) {
  if (formats.length < 2) return null
  const labels: Record<MediaFormat, string> = {
    audio: t.home.listen,
    video: t.home.watch,
    short: t.home.shorts,
    article: t.home.read,
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn('text-xs font-semibold', tone === 'ink' ? 'text-ink-foreground/60' : 'text-muted-foreground')}>
        {t.home.alsoAs}
      </span>
      {formats.map((f) => {
        const Icon = icons[f.format]
        return (
          <Link
            key={f.format}
            href={localePath(locale, f.href)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer',
              tone === 'ink'
                ? 'border-ink-foreground/25 text-ink-foreground hover:bg-ink-foreground/15 hover:border-white/50'
                : 'hover:bg-muted hover:border-primary/50',
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {labels[f.format]}
          </Link>
        )
      })}
    </div>
  )
}
