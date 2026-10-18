import Link from 'next/link'
import type { Dictionary, Locale } from '@/lib/i18n'

export function LanguagePill({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <Link
      href={locale === 'en' ? '/' : '/en'}
      hrefLang={locale === 'en' ? 'hi' : 'en'}
      aria-label={t.nav.englishLabel}
      className="inline-flex h-8 items-center rounded-full border-2 border-english px-2.5 text-xs font-extrabold text-english transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-english hover:text-white focus-visible:ring-2 focus-visible:ring-english cursor-pointer shadow-sm"
    >
      {t.nav.english}
    </Link>
  )
}
