import { getEpisodes } from '@/lib/content/repository'
import { getDictionary, type Locale } from '@/lib/i18n'
import { AntarYatraSubscriptionCard } from '@/components/antar-yatra/antar-yatra-subscription-card'
import { AntarYatraLanding } from '@/components/antar-yatra/antar-yatra-landing'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export async function AntarYatraPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const episodes = await getEpisodes({ premium: true })
  const isHi = locale === 'hi'

  return (
    <div className="flex flex-col gap-16 pb-20 animate-rise">
      {/* Complete Antar Yatra Brief, Manifesto & Interactive Landing Experience */}
      <AntarYatraLanding locale={locale} t={t} episodes={episodes} />

      {/* Subscription Details & Patron Membership at the bottom of the page */}
      <ScrollReveal direction="up" delay={50}>
        <section id="patron-circle" className="scroll-mt-24 mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              {isHi ? 'खाता व सदस्यता' : 'Account & Membership'}
            </span>
            <h2 className="mt-2 font-display text-3xl font-black text-foreground md:text-4xl">
              {isHi ? 'खाता बनाएँ या लॉगिन करें' : 'Create an Account or Sign In'}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {isHi
                ? 'बिना किसी विज्ञापन के, सम्पूर्ण शांति और असीमित ऑडियो एक्सेस के साथ अंतर यात्रा से जुड़ें।'
                : 'Join the circle for 100% ad-free listening, complete transcripts, and unlimited spiritual audio.'}
            </p>
          </div>

          <AntarYatraSubscriptionCard locale={locale} t={t} variant="full" />
        </section>
      </ScrollReveal>
    </div>
  )
}
