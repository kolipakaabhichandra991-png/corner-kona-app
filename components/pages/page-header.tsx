import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  sub,
  eyebrow,
  accent = 'bg-primary',
  children,
}: {
  title: string
  sub?: string
  eyebrow?: string
  accent?: string
  children?: React.ReactNode
}) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pt-6 md:px-6 md:pt-10">
      <span className={cn('h-1.5 w-14 rounded-full', accent)} aria-hidden="true" />
      {eyebrow && <p className="text-sm font-bold text-muted-foreground">{eyebrow}</p>}
      <h1 className="font-display text-4xl leading-tight font-extrabold text-balance md:text-5xl">{title}</h1>
      {sub && <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">{sub}</p>}
      {children}
    </header>
  )
}

export function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-4 text-sm font-bold transition-colors',
        active ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted',
      )}
    >
      {children}
    </a>
  )
}
