import { Analytics } from '@vercel/analytics/next'
import { Baloo_2, Mukta } from 'next/font/google'
import { getLatestEpisodes } from '@/lib/content/repository'
import { categories } from '@/lib/content/seed'
import { getDictionary, type Locale } from '@/lib/i18n'
import { ThemeProvider } from './theme-provider'
import { SiteHeader } from '@/components/header/site-header'
import { MobileBottomNav } from '@/components/header/mobile-bottom-nav'
import { SiteFooter } from './site-footer'
import { AudioProvider } from '@/components/audio/audio-context'
import { StickyAudioDock } from '@/components/audio/sticky-audio-dock'
import { BilingualTranscriptSheet } from '@/components/audio/bilingual-transcript-sheet'
import { BackgroundPattern } from './background-pattern'

const baloo = Baloo_2({ subsets: ['latin', 'devanagari'], variable: '--font-baloo', display: 'swap' })
const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mukta',
  display: 'swap',
})

export async function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale)
  const latest = await getLatestEpisodes(3)

  return (
    <html lang={locale} className={`${baloo.variable} ${mukta.variable} bg-background`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased relative overflow-x-hidden bg-background text-foreground" data-locale={locale}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AudioProvider>
            {/* Contextual Studio & Soundwave Background Pattern */}
            <BackgroundPattern />

            {/* Elevated Content Layer sitting cleanly above background pattern */}
            <div className="relative z-10 flex min-h-dvh flex-col">
              <a
                href="#main"
                className="sr-only z-[60] rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
              >
                {t.nav.skip}
              </a>
              <SiteHeader locale={locale} t={t} latest={latest} categories={categories} />
              <main id="main" className="flex-1 pb-28 lg:pb-16">
                {children}
              </main>
              <SiteFooter locale={locale} t={t} />
            </div>

            <StickyAudioDock locale={locale} />
            <BilingualTranscriptSheet />
            <MobileBottomNav locale={locale} t={t} />
          </AudioProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
