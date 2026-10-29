'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  Star,
  Headphones,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface AntarYatraSubscriptionCardProps {
  locale: Locale
  t?: Dictionary
  variant?: 'dropdown' | 'full'
  onComplete?: () => void
}

export function AntarYatraSubscriptionCard({
  locale,
  t,
  variant = 'full',
  onComplete,
}: AntarYatraSubscriptionCardProps) {
  const isHi = locale === 'hi'
  const [tab, setTab] = useState<'create' | 'login'>('create')
  const [tier, setTier] = useState<'patron' | 'free'>('patron')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    if (onComplete) onComplete()
  }

  const perks = [
    {
      icon: Sparkles,
      title: isHi ? 'अंतर यात्रा एक्सक्लूसिव एक्सेस' : 'Antar Yatra Exclusive Access',
      desc: isHi ? 'गहरी आध्यात्मिक यात्राएँ और मन की शांति' : 'Deep spiritual journeys & inner peace specials',
    },
    {
      icon: Headphones,
      title: isHi ? '100% विज्ञापन-मुक्त अनुभव' : '100% Ad-Free Listening',
      desc: isHi ? 'बिना किसी रुकावट के पूरी एकाग्रता' : 'Uninterrupted stream across all podcasts',
    },
    {
      icon: Star,
      title: isHi ? 'अर्ली रिलीज़ व द्विभाषी लिरिक्स' : 'Early Releases & Bilingual Transcripts',
      desc: isHi ? 'नए एपिसोड सबसे पहले और बोल के साथ' : 'First-listen access with synchronized lyrics',
    },
  ]

  if (variant === 'dropdown') {
    return (
      <div className="flex flex-col gap-3 p-4">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h4 className="font-display text-sm font-black text-foreground">
                {isHi ? 'अंतर यात्रा खाता' : 'Antar Yatra Account'}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {isHi ? 'भीतर की यात्रा के लिए विशेष क्लब' : 'Unlock spiritual audio & all stories'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
            Patron
          </span>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center animate-rise">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
              <ShieldCheck className="size-6" />
            </span>
            <p className="text-sm font-bold text-foreground">
              {isHi ? 'खाता सफलतापूर्वक बन गया!' : 'Account Created Successfully!'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isHi
                ? `सत्यापन लिंक ${email} पर भेजा गया है।`
                : `Confirmation sent to ${email}.`}
            </p>
            <Link
              href={localePath(locale, '/antar-yatra')}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
            >
              <span>{isHi ? 'एपिसोड्स सुनें' : 'Start Listening Now'}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Tiers quick toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTier('patron')}
                className={cn(
                  'relative flex flex-col rounded-xl border p-2.5 text-left transition-all cursor-pointer',
                  tier === 'patron'
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                    : 'border-border/70 hover:border-amber-500/40 bg-card/60'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {isHi ? 'संरक्षक (Patron)' : 'Patron'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-amber-500">
                    Popular
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-black text-foreground">₹199</span>
                  <span className="text-[10px] text-muted-foreground">/mo</span>
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                  {isHi ? 'ऑल-एक्सेस + विज्ञापन-मुक्त' : 'All-access + ad-free'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTier('free')}
                className={cn(
                  'flex flex-col rounded-xl border p-2.5 text-left transition-all cursor-pointer',
                  tier === 'free'
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border/70 hover:border-primary/40 bg-card/60'
                )}
              >
                <span className="text-[11px] font-bold text-muted-foreground">
                  {isHi ? 'मुफ़्त (Free)' : 'Free'}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-black text-foreground">₹0</span>
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                  {isHi ? 'साप्ताहिक डाइजेस्ट' : 'Weekly highlights'}
                </span>
              </button>
            </div>

            {/* Quick Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-1">
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isHi ? 'अपना ईमेल दर्ज करें' : 'Enter your email'}
                  className="h-9 w-full rounded-lg border bg-background pr-3 pl-8 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                className="h-9 w-full rounded-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="size-3.5 mr-1" />
                {tier === 'patron'
                  ? isHi
                    ? 'खाता बनाएँ (₹199/माह)'
                    : 'Create Account (₹199)'
                  : isHi
                  ? 'मुफ़्त खाता बनाएँ'
                  : 'Create Free Account'}
              </Button>
            </form>

            {/* Footer link */}
            <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
              <Link
                href={localePath(locale, '/antar-yatra')}
                className="font-bold text-amber-600 hover:underline dark:text-amber-400"
              >
                {isHi ? 'सभी एपिसोड्स देखें →' : 'Explore all episodes →'}
              </Link>
              <Link
                href={localePath(locale, '/login')}
                className="text-muted-foreground hover:text-foreground"
              >
                {isHi ? 'लॉगिन' : 'Sign In'}
              </Link>
            </div>
          </>
        )}
      </div>
    )
  }

  // Full Variant for /antar-yatra landing page
  return (
    <section aria-labelledby="antar-sub-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-ink via-stone-900 to-amber-950/40 p-6 text-ink-foreground shadow-2xl shadow-amber-500/10 md:p-10">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 -z-10 size-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Story & Benefits */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black tracking-wide text-amber-300 uppercase border border-amber-500/30">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {isHi ? 'अंतर यात्रा एक्सक्लूसिव क्लब' : 'Antar Yatra Patron Circle'}
              </span>
              <h2 id="antar-sub-h" className="font-display text-3xl font-black tracking-tight text-white md:text-5xl">
                {isHi ? (
                  <>
                    भीतर की शांति, <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">हर पल आपके साथ</span>
                  </>
                ) : (
                  <>
                    Unlock the Inner Journey with <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">Antar Yatra</span>
                  </>
                )}
              </h2>
              <p className="text-base text-ink-foreground/80 md:text-lg">
                {isHi
                  ? 'कॉर्नर कोना की विशेष आध्यात्मिक और अंतर्मन की कहानियों की पूरी लाइब्रेरी तक असीमित पहुँच पाएँ। विज्ञापन-मुक्त, उच्च-गुणवत्ता ऑडियो और सम्पूर्ण द्विभाषी बोल।'
                  : 'Get unlimited access to Corner Kona’s spiritual audio journeys, deep meditations, and audiobooks. Completely ad-free with synchronized bilingual transcripts.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {perks.map((p, i) => {
                const Icon = p.icon
                return (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur transition-transform hover:-translate-y-0.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/20">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-ink-foreground/70">{p.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Interactive Account Creation & Sign In Box */}
          <div className="flex flex-col rounded-3xl border border-amber-500/30 bg-background/95 p-6 text-foreground shadow-2xl backdrop-blur md:p-8 lg:col-span-6">
            {/* Top Tabs: Create Account vs Sign In */}
            <div className="grid grid-cols-2 rounded-2xl bg-muted/80 p-1 text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab('create')
                  setSubmitted(false)
                }}
                className={cn(
                  'rounded-xl py-2.5 transition-all duration-200 cursor-pointer',
                  tab === 'create'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isHi ? 'खाता बनाएँ' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('login')
                  setSubmitted(false)
                }}
                className={cn(
                  'rounded-xl py-2.5 transition-all duration-200 cursor-pointer',
                  tab === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isHi ? 'लॉगिन करें' : 'Sign In'}
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center animate-rise">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/10">
                  <ShieldCheck className="size-8" />
                </span>
                <h3 className="text-2xl font-black">
                  {tab === 'create'
                    ? isHi
                      ? 'खाता सफलतापूर्वक बन गया!'
                      : 'Account Created Successfully!'
                    : isHi
                    ? 'लॉगिन सफल रहा!'
                    : 'Welcome Back!'}
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {isHi
                    ? `आपके ईमेल (${email}) पर पुष्टि और सक्रियण लिंक भेज दिया गया है। अब सभी प्रीमियम ऑडियो अनलॉक हो चुके हैं।`
                    : `A confirmation link has been sent to ${email}. All premium spiritual episodes are now accessible.`}
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-full font-bold bg-amber-500 text-stone-950 hover:bg-amber-400"
                >
                  {isHi ? 'खाता डैशबोर्ड देखें' : 'Manage Account'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                {/* Plan Selection Cards (in Create Account Mode) */}
                {tab === 'create' && (
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <button
                      type="button"
                      onClick={() => setTier('free')}
                      className={cn(
                        'flex flex-col rounded-2xl border p-4 text-left transition-all cursor-pointer',
                        tier === 'free'
                          ? 'border-primary ring-2 ring-primary/40 bg-primary/10'
                          : 'border-border/60 hover:border-border'
                      )}
                    >
                      <span className="text-xs font-bold text-muted-foreground">
                        {isHi ? 'मुफ़्त' : 'Free'}
                      </span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">₹0</span>
                      </div>
                      <span className="mt-1 text-[11px] text-muted-foreground">
                        {isHi ? 'साप्ताहिक डाइजेस्ट' : 'Weekly Digest'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTier('patron')}
                      className={cn(
                        'relative flex flex-col rounded-2xl border p-4 text-left transition-all cursor-pointer overflow-hidden',
                        tier === 'patron'
                          ? 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-500/10'
                          : 'border-border/60 hover:border-purple-500/50'
                      )}
                    >
                      <span className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-sm">
                        POPULAR
                      </span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        {isHi ? 'संरक्षक' : 'Patron'}
                      </span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">₹199</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      <span className="mt-1 text-[11px] text-muted-foreground">
                        {isHi ? 'सभी प्रीमियम एपिसोड्स' : 'All Premium'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Name Input (in Create Account Mode) */}
                {tab === 'create' && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="antar-name"
                    >
                      {isHi ? 'पूरा नाम (वैकल्पिक)' : 'FULL NAME'}
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="antar-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isHi ? 'अपना नाम दर्ज करें' : 'Your name'}
                        className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    htmlFor="antar-email"
                  >
                    {isHi ? 'ईमेल पता' : 'EMAIL ADDRESS'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="antar-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="antar-pwd"
                    >
                      {isHi ? 'पासवर्ड' : 'PASSWORD'}
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
                      >
                        {isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="antar-pwd"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    'mt-2 h-12 w-full rounded-xl font-bold text-white shadow-lg transition-all cursor-pointer',
                    tab === 'create'
                      ? tier === 'patron'
                        ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 hover:opacity-95 shadow-purple-500/25 active:scale-98'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 shadow-amber-500/25 active:scale-98'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-amber-500/25 active:scale-98'
                  )}
                >
                  {tab === 'create'
                    ? isHi
                      ? tier === 'patron'
                        ? 'खाता बनाएँ व संरक्षक बनें (₹199)'
                        : 'मुफ़्त खाता बनाएँ'
                      : tier === 'patron'
                      ? 'Join Antar Yatra Patron (₹199)'
                      : 'Create Free Account'
                    : isHi
                    ? 'अकाउंट में लॉगिन करें'
                    : 'Sign In to Account'}
                </Button>

                {/* Disclaimer */}
                <p className="text-center text-xs text-muted-foreground">
                  {isHi
                    ? 'जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।'
                    : 'By continuing you agree to our Terms of Service & Privacy Policy.'}
                </p>

                {/* Switch Tab helper link */}
                <div className="text-center pt-1 text-xs">
                  {tab === 'create' ? (
                    <span className="text-muted-foreground">
                      {isHi ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                      <button
                        type="button"
                        onClick={() => setTab('login')}
                        className="font-bold text-amber-600 hover:underline dark:text-amber-400 cursor-pointer"
                      >
                        {isHi ? 'लॉगिन करें' : 'Sign In'}
                      </button>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {isHi ? 'नया खाता चाहिए?' : "Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => setTab('create')}
                        className="font-bold text-amber-600 hover:underline dark:text-amber-400 cursor-pointer"
                      >
                        {isHi ? 'खाता बनाएँ' : 'Create Account'}
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
