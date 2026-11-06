import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({ id, title, sub, href }: { id: string; title: string; sub?: string; href?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 md:px-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" aria-hidden="true" />
          <h2 id={id} className="text-2xl leading-tight font-extrabold text-balance md:text-3xl">
            {title}
          </h2>
        </div>
        {sub && <p className="text-sm text-muted-foreground ml-4">{sub}</p>}
      </div>
      {href && (
        <Link
          href={href}
          aria-labelledby={id}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-4 py-1.5 text-xs font-bold transition-all hover:border-primary/50 hover:bg-primary hover:text-primary-foreground shadow-sm backdrop-blur-sm"
        >
          <span>सब देखें</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
