import Link from 'next/link'
import { getDictionary, localePath, type Locale } from '@/lib/i18n'

export function MessagePage({ locale, variant }: { locale: Locale; variant: 'account' | 'notFound' }) {
  const t = getDictionary(locale)
  const title = variant === 'account' ? t.pages.accountTitle : t.pages.notFoundTitle
  const body = variant === 'account' ? t.pages.accountBody : t.pages.notFoundBody

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      {variant === 'notFound' && (
        <p className="font-display text-7xl font-extrabold text-primary md:text-8xl" aria-hidden="true">
          404
        </p>
      )}
      <h1 className="font-display text-3xl leading-tight font-extrabold text-balance md:text-4xl">{title}</h1>
      <p className="leading-relaxed text-pretty text-muted-foreground">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={localePath(locale)}
          className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-bold text-primary-foreground hover:opacity-90"
        >
          {t.pages.goHome}
        </Link>
        <Link href={localePath(locale, '/podcasts')} className="inline-flex h-11 items-center rounded-full border px-6 font-bold hover:bg-muted">
          {t.nav.podcasts}
        </Link>
      </div>
    </section>
  )
}
