import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n'

export function LanguagePill({ locale, t }: { locale: Locale; t: Dictionary }) {
  const isEn = locale === 'en'
  const targetHref = isEn ? '/hi' : '/en'
  const targetLang = isEn ? 'hi' : 'en'
  const label = isEn ? 'हिन्दी (नया टैब)' : 'English (New tab)'

  return (
    <Link
      href={targetHref}
      hrefLang={targetLang}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={isEn ? 'हिंदी संस्करण नए टैब में खोलें' : 'Open English edition in a new tab'}
      className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-english px-3 text-xs font-extrabold text-english transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-english hover:text-white focus-visible:ring-2 focus-visible:ring-english cursor-pointer shadow-sm"
    >
      <span>{isEn ? 'हिन्दी' : 'EN'}</span>
      <ExternalLink className="size-3 opacity-70" aria-hidden="true" />
    </Link>
  )
}
