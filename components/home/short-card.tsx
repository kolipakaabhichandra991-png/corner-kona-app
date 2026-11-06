import Image from 'next/image'
import Link from 'next/link'
import { Eye, Play } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import type { Short } from '@/lib/content/types'
import { cn } from '@/lib/utils'

export function ShortCard({ locale, short, className }: { locale: Locale; short: Short; className?: string }) {
  return (
    <Link
      href={localePath(locale, `/videos/${short.slug}`)}
      className={cn(
        'group relative block aspect-[9/16] w-36 overflow-hidden rounded-2xl bg-ink text-ink-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-44 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/25 ring-1 ring-white/10 hover:ring-purple-500/50',
        className,
      )}
    >
      <Image
        src={short.image || '/placeholder.svg'}
        alt=""
        fill
        sizes="176px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span className="absolute top-2 right-2 rounded-md bg-ink/70 px-1.5 py-0.5 text-[11px] font-bold backdrop-blur">
        {`0:${String(short.durationSec).padStart(2, '0')}`}
      </span>
      <span className="absolute inset-0 grid place-items-center opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
        <span className="grid size-12 place-items-center rounded-full bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
          <Play className="size-5 translate-x-px fill-current" aria-hidden="true" />
        </span>
      </span>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-ink to-transparent p-3 pt-10">
        <h3 className="line-clamp-2 text-sm leading-snug font-bold">{short.title[locale]}</h3>
        <span className="inline-flex items-center gap-1 text-[11px] text-ink-foreground/70">
          <Eye className="size-3" aria-hidden="true" />
          {short.views}
        </span>
      </div>
    </Link>
  )
}
