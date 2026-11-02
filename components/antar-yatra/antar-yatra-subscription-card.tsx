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
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { CheckoutModal } from '@/components/antar-yatra/checkout-modal'
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
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

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

  // Dropdown compact variant
  if (variant === 'dropdown') {
    return (
      <div className="flex flex-col gap-3 p-4">
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
              {isHi ? `सत्यापन लिंक ${email} पर भेजा गया है।` : `Confirmation sent to ${email}.`}
            </p>
            <Link
              href={localePath(locale, '/antar-yatra')}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow"
            >
              <span>{isHi ? 'एपिसोड्स सुनें' : 'Start Listening Now'}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 pt-1">
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
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white shadow-sm"
            >
              {isHi ? 'साइन अप करें' : 'Continue'}
            </Button>
          </form>
        )}
      </div>
    )
  }

  // Full Variant for /antar-yatra landing page & registration
  return (
    <section aria-labelledby="antar-sub-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-ink via-stone-900 to-amber-950/40 p-6 text-ink-foreground shadow-2xl shadow-amber-500/10 md:p-10">
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
                    भीतर की शांति,{' '}
                    <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                      हर पल आपके साथ
                    </span>
                  </>
                ) : (
                  <>
                    Unlock the Inner Journey with{' '}
                    <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                      Antar Yatra
                    </span>
                  </>
                )}
              </h2>
              <p className="text-base text-ink-foreground/80 md:text-lg">
                {isHi
                  ? 'कॉर्नर कोना की विशेष आध्यात्मिक और अंतर्मन की कहानियों की पूरी लाइब्रेरी तक असीमित पहुँच पाएँ। 100% विज्ञापन-मुक्त, उच्च-गुणवत्ता ऑडियो और सम्पूर्ण द्विभाषी बोल।'
                  : 'Get unlimited access to Corner Kona’s spiritual audio journeys, deep meditations, and audiobooks. Completely ad-free with synchronized bilingual transcripts.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {perks.map((p, i) => {
                const Icon = p.icon
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur transition-transform hover:-translate-y-0.5"
                  >
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

          {/* Right Column: Standard, Full-Featured Create Account & Sign In Card */}
          <div className="flex flex-col rounded-3xl border border-amber-500/30 bg-background/95 p-6 text-foreground shadow-2xl backdrop-blur md:p-8 lg:col-span-6">
            {/* Top Navigation Tabs */}
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
                    : 'text-muted-foreground hover:text-foreground',
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
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isHi ? 'लॉगिन करें' : 'Sign In'}
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center animate-rise">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/10">
                  <ShieldCheck className="size-8" />
                </span>
                <h3 className="text-2xl font-black">
                  {tab === 'create'
                    ? isHi
                      ? `स्वागत है, ${firstName || 'साधक'}!`
                      : `Welcome, ${firstName || 'Seeker'}!`
                    : isHi
                    ? 'लॉगिन सफल रहा!'
                    : 'Welcome Back!'}
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {isHi
                    ? `आपके ईमेल (${email}) पर पुष्टि और सक्रियण लिंक भेज दिया गया है। आप तुरंत सुनना शुरू कर सकते हैं।`
                    : `A confirmation link has been sent to ${email}. You can now start exploring the audio sanctuary.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-xs">
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="flex-1 rounded-full font-bold bg-muted text-foreground hover:bg-muted/80"
                  >
                    {isHi ? 'वापस' : 'Done'}
                  </Button>
                  <Button
                    onClick={() => setCheckoutOpen(true)}
                    className="flex-1 rounded-full font-bold bg-amber-500 text-stone-950 hover:bg-amber-400"
                  >
                    <Sparkles className="size-3.5 mr-1" />
                    {isHi ? 'पैट्रन प्लान' : 'View Plans'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                {/* 1. FIRST NAME & LAST NAME (in Create Mode) */}
                {tab === 'create' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                        htmlFor="antar-first-name"
                      >
                        {isHi ? 'पहला नाम' : 'First Name'} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="antar-first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={isHi ? 'उदा. राहुल' : 'e.g. Rahul'}
                          className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                        htmlFor="antar-last-name"
                      >
                        {isHi ? 'अंतिम नाम' : 'Last Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="antar-last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={isHi ? 'उदा. शर्मा' : 'e.g. Sharma'}
                          className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EMAIL ADDRESS */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    htmlFor="antar-email"
                  >
                    {isHi ? 'ईमेल पता' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="antar-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* 3. PHONE NUMBER (in Create Mode) */}
                {tab === 'create' && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="antar-phone"
                    >
                      {isHi ? 'मोबाइल नंबर' : 'Phone Number'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-border/80 bg-background/80 overflow-hidden focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                      <div className="flex items-center gap-1 bg-muted/60 px-3 border-r border-border/70 text-xs font-bold text-foreground">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="antar-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="h-11 w-full bg-transparent pr-4 pl-10 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PASSWORD & CONFIRM PASSWORD */}
                <div className={cn('grid gap-3', tab === 'create' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                        htmlFor="antar-pwd"
                      >
                        {isHi ? 'पासवर्ड' : 'Password'} <span className="text-rose-500">*</span>
                      </label>
                      {tab === 'login' && (
                        <button
                          type="button"
                          className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
                        >
                          {isHi ? 'भूल गए?' : 'Forgot?'}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="antar-pwd"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-10 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (only in Create Mode) */}
                  {tab === 'create' && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                          htmlFor="antar-confirm-pwd"
                        >
                          {isHi ? 'पासवर्ड पुष्टि' : 'Confirm Password'} <span className="text-rose-500">*</span>
                        </label>
                        {confirmPassword && password && (
                          <span className={cn('text-[10px] font-bold', password === confirmPassword ? 'text-emerald-500' : 'text-rose-500')}>
                            {password === confirmPassword ? (isHi ? '✓ मैच' : '✓ Matches') : (isHi ? '✗ मिसमैच' : '✗ Mismatch')}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="antar-confirm-pwd"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 w-full rounded-xl border border-border/80 bg-background/80 pr-10 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. TERMS CHECKBOX (in Create Mode) */}
                {tab === 'create' && (
                  <label className="flex items-start gap-2.5 pt-1 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      className="mt-0.5 size-4 rounded border-border text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      {isHi ? (
                        <>
                          मैं कॉर्नर कोना की <span className="text-foreground underline">सेवा की शर्तों</span> और{' '}
                          <span className="text-foreground underline">गोपनीयता नीति</span> से सहमत हूँ।
                        </>
                      ) : (
                        <>
                          I agree to the <span className="text-foreground underline">Terms of Service</span> and{' '}
                          <span className="text-foreground underline">Privacy Policy</span>.
                        </>
                      )}
                    </span>
                  </label>
                )}

                {/* 6. SUBMIT BUTTON */}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 h-12 w-full rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  {tab === 'create'
                    ? isHi
                      ? 'खाता बनाएँ'
                      : 'Create Account'
                    : isHi
                    ? 'अकाउंट में लॉगिन करें'
                    : 'Sign In to Account'}
                </Button>

                {/* 7. SOCIAL SIGN UP DIVIDER */}
                <div className="relative my-1 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border/60">
                  <span className="relative z-10 bg-background px-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                    {isHi ? 'या इसके साथ जारी रखें' : 'Or continue with'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true)
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted font-bold text-xs text-foreground transition-all cursor-pointer shadow-sm"
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isHi ? 'Google के साथ साइन इन करें' : 'Continue with Google'}</span>
                </button>

                {/* 8. PATRON CALLOUT BANNER */}
                <div className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles className="size-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {isHi ? 'अंतर यात्रा संरक्षक क्लब' : 'Antar Yatra Patron Circle'}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {isHi ? 'विज्ञापन-मुक्त और सभी आध्यात्मिक अंक' : 'Unlock ad-free spiritual journeys'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-110 shrink-0 cursor-pointer"
                  >
                    {isHi ? 'प्लान देखें' : 'View Plans'}
                  </button>
                </div>

                {/* 9. SWITCH TAB HELPER LINK */}
                <div className="text-center pt-2 text-xs">
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

      <CheckoutModal
        locale={locale}
        isOpen={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false)
        }}
        onSuccess={() => {
          setSubmitted(true)
          if (onComplete) onComplete()
        }}
      />
    </section>
  )
}
