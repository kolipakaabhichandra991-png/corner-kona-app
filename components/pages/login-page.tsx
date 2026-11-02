'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Mail,
  KeyRound,
  ShieldCheck,
  User,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { localePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LoginPage({ locale }: { locale: Locale }) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 md:px-6 md:py-14 animate-rise">
      <Link
        href={localePath(locale)}
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground active:scale-95"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {isHi ? 'होम पर वापस जाएँ' : 'Back to Home'}
      </Link>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Brand & Benefits */}
        <div className="flex flex-col gap-6 lg:col-span-6">
          <Logo size="lg" />
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl">
              {isHi ? (
                <>
                  कोना की हर{' '}
                  <span className="bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] bg-clip-text text-transparent">
                    कहानी
                  </span>{' '}
                  का हिस्सा बनें
                </>
              ) : (
                <>
                  Experience every story on{' '}
                  <span className="bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] bg-clip-text text-transparent">
                    Corner Kona
                  </span>
                </>
              )}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {isHi
                ? 'हज़ारों श्रोताओं के साथ जुड़ें। विशेष पॉडकास्ट, गहरी ऑडियोबुक और अंतर यात्रा की अनकही कहानियाँ।'
                : 'Join thousands of listeners. Exclusive podcasts, immersive audiobooks, and Antar Yatra specials.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {[
              {
                title: isHi ? 'असीमित पॉडकास्ट और ऑडियोबुक' : 'Unlimited Podcasts & Audiobooks',
                desc: isHi ? 'कभी भी, कहीं भी सुनें' : 'Listen anytime, anywhere',
              },
              {
                title: isHi ? 'अंतर यात्रा प्रीमियम एक्सेस' : 'Antar Yatra Premium Access',
                desc: isHi ? 'भीतर की यात्रा के लिए ख़ास एपिसोड्स' : 'Inner journey spiritual episodes',
              },
              {
                title: isHi ? 'विज्ञापन-मुक्त और अर्ली एक्सेस' : 'Ad-Free & Early Access',
                desc: isHi ? 'नई रिलीज़ सबसे पहले आपके पास' : 'Hear all new releases first',
              },
            ].map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border bg-card/60 p-3.5 backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#9333EA]/20 to-[#0EA5E9]/20 text-[#8B5CF6]">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{b.title}</h4>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Standard Interactive Account Creation / Sign In Card */}
        <div className="flex flex-col rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-purple-500/5 backdrop-blur md:p-8 lg:col-span-6">
          {/* Tabs: Create Account vs Sign In */}
          <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 text-sm font-bold">
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
            <div className="flex flex-col items-center gap-4 py-12 text-center animate-rise">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/10">
                <ShieldCheck className="size-8" />
              </span>
              <h3 className="text-2xl font-black">
                {tab === 'create'
                  ? isHi
                    ? `स्वागत है, ${firstName || 'श्रोता'}!`
                    : `Welcome, ${firstName || 'Listener'}!`
                  : isHi
                  ? 'लॉगिन सफल रहा!'
                  : 'Welcome Back!'}
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                {isHi
                  ? `पुष्टि लिंक आपके ईमेल (${email}) पर भेज दिया गया है।`
                  : `A confirmation link has been sent to ${email}.`}
              </p>
              <Link href={localePath(locale)}>
                <Button className="mt-2 rounded-full font-bold">
                  {isHi ? 'सुनना शुरू करें' : 'Start Listening'}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* 1. FIRST NAME & LAST NAME (in Create Mode) */}
              {tab === 'create' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="auth-first-name"
                    >
                      {isHi ? 'पहला नाम' : 'First Name'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="auth-first-name"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={isHi ? 'उदा. राहुल' : 'e.g. Rahul'}
                        className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="auth-last-name"
                    >
                      {isHi ? 'अंतिम नाम' : 'Last Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="auth-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={isHi ? 'उदा. शर्मा' : 'e.g. Sharma'}
                        className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EMAIL ADDRESS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="auth-email">
                  {isHi ? 'ईमेल पता' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* 3. PHONE NUMBER (in Create Mode) */}
              {tab === 'create' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="auth-phone">
                    {isHi ? 'मोबाइल नंबर' : 'Phone Number'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl border bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <div className="flex items-center gap-1 bg-muted px-3 border-r border-border text-xs font-bold text-foreground">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="auth-phone"
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
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      htmlFor="auth-pwd"
                    >
                      {isHi ? 'पासवर्ड' : 'Password'} <span className="text-rose-500">*</span>
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="auth-pwd"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border bg-background pr-10 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        htmlFor="auth-confirm-pwd"
                      >
                        {isHi ? 'पासवर्ड पुष्टि' : 'Confirm Password'} <span className="text-rose-500">*</span>
                      </label>
                      {confirmPassword && password && (
                        <span
                          className={cn(
                            'text-[10px] font-bold',
                            password === confirmPassword ? 'text-emerald-500' : 'text-rose-500',
                          )}
                        >
                          {password === confirmPassword
                            ? isHi
                              ? '✓ मैच'
                              : '✓ Matches'
                            : isHi
                            ? '✗ मिसमैच'
                            : '✗ Mismatch'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="auth-confirm-pwd"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border bg-background pr-10 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
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
                className="mt-1 h-12 w-full rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] hover:opacity-95 shadow-purple-500/25 active:scale-98 transition-all cursor-pointer"
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
                <span className="relative z-10 bg-card px-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  {isHi ? 'या इसके साथ जारी रखें' : 'Or continue with'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(true)}
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

              {/* 8. SWITCH TAB HELPER LINK */}
              <div className="text-center pt-2 text-xs">
                {tab === 'create' ? (
                  <span className="text-muted-foreground">
                    {isHi ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="font-bold text-primary hover:underline cursor-pointer"
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
                      className="font-bold text-primary hover:underline cursor-pointer"
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
  )
}
