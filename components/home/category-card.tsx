import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import type { Category, CategoryKey } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'

/** Each section's personality expressed through type treatment, not just colour. */
const personality: Partial<Record<CategoryKey, string>> = {
  sports: 'uppercase italic tracking-tight font-extrabold',
  entertainment: 'font-extrabold -rotate-2',
  geopolitics: 'font-bold tracking-tight border-l-4 border-geopolitics pl-3',
  bhakti: 'font-semibold tracking-wide',
  lifestyle: 'font-bold lowercase',
  genZ: 'font-black tracking-wider text-pink-400',
  news: 'font-black tracking-tight uppercase',
  deshKiCharcha: 'font-extrabold text-orange-400',
  ckSpecial: 'font-black tracking-wide text-purple-400',
  gallery: 'font-extrabold tracking-normal text-rose-400',
  techTalk: 'font-mono font-bold tracking-tighter text-sky-400',
  scienceGyan: 'font-bold tracking-wide text-teal-400',
  sehat: 'font-semibold tracking-normal text-lime-400',
}

export function CategoryCard({ locale, category }: { locale: Locale; category: Category }) {
  const s = sectionStyle[category.key] ?? { bg: 'bg-primary', text: 'text-primary' }
  return (
    <Link
      href={localePath(locale, `/${category.slug}`)}
      className="group relative flex aspect-[3/4] w-56 flex-col justify-end overflow-hidden rounded-2xl bg-ink text-ink-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-64 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ring-1 ring-white/10 hover:ring-primary/40"
    >
      <Image
        src={category.image || '/placeholder.svg'}
        alt=""
        fill
        sizes="256px"
        className="object-cover opacity-70 transition-all duration-500 group-hover:scale-108 group-hover:opacity-90"
      />
      <span className={cn('absolute top-0 left-0 h-2 w-full', s.bg)} aria-hidden="true" />
      <span className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
      <div className="relative flex flex-col gap-2 bg-gradient-to-t from-ink via-ink/75 to-transparent p-5 pt-20">
        <h3 className={cn('origin-left font-display text-3xl leading-none', personality[category.key] ?? 'font-bold')}>
          {category.name[locale]}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-foreground/75">{category.blurb[locale]}</p>
      </div>
    </Link>
  )
}
