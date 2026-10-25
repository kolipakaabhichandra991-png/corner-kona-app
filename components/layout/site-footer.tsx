import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { brand } from '@/config/brand'
import { categories } from '@/lib/content/seed'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="flex max-w-sm flex-col gap-3">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">{t.footer.about}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.key} href={localePath(locale, `/${c.slug}`)} className="text-muted-foreground hover:text-foreground">
              {c.name[locale]}
            </Link>
          ))}
          <Link href={localePath(locale, '/podcasts')} className="text-muted-foreground hover:text-foreground">
            {t.nav.podcasts}
          </Link>
          <Link href={localePath(locale, '/videos')} className="text-muted-foreground hover:text-foreground">
            {t.nav.videos}
          </Link>
          <Link href={localePath(locale, '/antar-yatra')} className="text-muted-foreground hover:text-foreground">
            {t.nav.antarYatra}
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-purple-400 transition-colors"
          >
            <Lock className="size-3.5" aria-hidden="true" />
            <span>{locale === 'hi' ? 'एडमिन पोर्टल' : 'Admin Portal'}</span>
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground md:px-6">
          <p>
            {'© '}
            {new Date().getFullYear()} {brand.name}. {t.footer.rights}.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10"
          >
            <Lock className="size-3" aria-hidden="true" />
            <span>{locale === 'hi' ? 'एडमिन पोर्टल (Admin Portal)' : 'Admin Portal'}</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
