import Link from 'next/link'
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
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground md:px-6">
          {'© '}
          {new Date().getFullYear()} {brand.name}. {t.footer.rights}.
        </p>
      </div>
    </footer>
  )
}
