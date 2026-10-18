'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, Lock, Mail, KeyRound, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { localePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LoginPage({ locale }: { locale: Locale }) {
  const isHi = locale === 'hi'
  const [tab, setTab] = useState<'subscribe' | 'login'>('subscribe')
  const [tier, setTier] = useState<'free' | 'patron'>('patron')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
                  कोना की हर <span className="bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] bg-clip-text text-transparent">कहानी</span> का हिस्सा बनें
                </>
              ) : (
                <>
                  Experience every story on <span className="bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] bg-clip-text text-transparent">Corner Kona</span>
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
              <div key={i} className="flex items-start gap-3 rounded-2xl border bg-card/60 p-3.5 backdrop-blur transition-transform hover:-translate-y-0.5">
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

        {/* Right Side: Interactive Form / Membership card */}
        <div className="flex flex-col rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-purple-500/5 backdrop-blur md:p-8 lg:col-span-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => {
                setTab('subscribe')
                setSubmitted(false)
              }}
              className={cn(
                'rounded-xl py-2.5 transition-all duration-200 cursor-pointer',
                tab === 'subscribe'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isHi ? 'सब्सक्राइब करें' : 'Subscribe'}
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
            <div className="flex flex-col items-center gap-4 py-12 text-center animate-rise">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
                <ShieldCheck className="size-8" />
              </span>
              <h3 className="text-2xl font-black">
                {isHi ? 'स्वागत है!' : 'Welcome Aboard!'}
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                {isHi
                  ? `आपके ईमेल (${email}) पर पुष्टि लिंक भेजा गया है।`
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
              {tab === 'subscribe' && (
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <button
                    type="button"
                    onClick={() => setTier('free')}
                    className={cn(
                      'flex flex-col rounded-2xl border p-3 text-left transition-all cursor-pointer',
                      tier === 'free'
                        ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-xs font-bold text-muted-foreground">
                      {isHi ? 'मुफ़्त' : 'Free'}
                    </span>
                    <span className="text-base font-black">₹0</span>
                    <span className="text-[11px] text-muted-foreground">
                      {isHi ? 'साप्ताहिक न्यूज़लेटर' : 'Weekly Digest'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTier('patron')}
                    className={cn(
                      'relative flex flex-col rounded-2xl border p-3 text-left transition-all cursor-pointer overflow-hidden',
                      tier === 'patron'
                        ? 'border-[#9333EA] ring-2 ring-[#9333EA]/30 bg-purple-500/5'
                        : 'border-border hover:border-[#9333EA]/50'
                    )}
                  >
                    <span className="absolute top-2 right-2 rounded-full bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                      Popular
                    </span>
                    <span className="text-xs font-bold text-[#8B5CF6]">
                      {isHi ? 'अंतर यात्रा संरक्षक' : 'Patron'}
                    </span>
                    <span className="text-base font-black">₹199<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                    <span className="text-[11px] text-muted-foreground">
                      {isHi ? 'प्रीमियम ऑल-एक्सेस' : 'All Premium'}
                    </span>
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="auth-email">
                  {isHi ? 'ईमेल पता' : 'Email Address'}
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

              {tab === 'login' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="auth-pwd">
                      {isHi ? 'पासवर्ड' : 'Password'}
                    </label>
                    <button type="button" className="text-xs font-semibold text-primary hover:underline">
                      {isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="auth-pwd"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-2 h-12 w-full rounded-xl font-bold bg-gradient-to-r from-[#9333EA] to-[#0EA5E9] text-white shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-95 transition-all"
              >
                {tab === 'subscribe'
                  ? isHi
                    ? tier === 'patron'
                      ? 'अंतर यात्रा मेंबरशिप लें (₹199)'
                      : 'मुफ़्त सब्सक्राइब करें'
                    : tier === 'patron'
                    ? 'Join Antar Yatra Patron (₹199)'
                    : 'Subscribe for Free'
                  : isHi
                  ? 'लॉगिन करें'
                  : 'Sign In to Account'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {isHi
                  ? 'जारी रखकर आप हमारी सेवा की शर्तें और गोपनीयता नीति स्वीकार करते हैं।'
                  : 'By continuing you agree to our Terms of Service & Privacy Policy.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
