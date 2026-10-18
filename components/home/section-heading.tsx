import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({ id, title, sub, href }: { id: string; title: string; sub?: string; href?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 md:px-6">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-2xl leading-tight font-extrabold text-balance md:text-3xl">
          {title}
        </h2>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </div>
      {href && (
        <Link
          href={href}
          aria-labelledby={id}
          className="grid size-10 shrink-0 place-items-center rounded-full border transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
