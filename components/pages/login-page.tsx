'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { AlertCircle, ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { localePath, type Locale } from '@/lib/i18n'

export function LoginPage({ locale }: { locale: Locale }) {
  const isHi = locale === 'hi'
  const [mode, setMode] = useState<'create' | 'login'>('create')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('error')) {
      setError(
        isHi
          ? 'Google से साइन इन नहीं हो सका। कृपया फिर से कोशिश करें।'
          : 'Google sign-in failed. Please try again.',
      )
    }
  }, [isHi])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setError('')

    try {
      await signIn('google', { redirectTo: localePath(locale, '/profile') })
    } catch {
      setIsSigningIn(false)
      setError(
        isHi
          ? 'साइन इन शुरू नहीं हो सका। कृपया बाद में फिर कोशिश करें।'
          : 'Sign-in could not be started. Please try again later.',
      )
    }
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
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 rounded-2xl border bg-card/60 p-3.5 backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#9333EA]/20 to-[#0EA5E9]/20 text-[#8B5CF6]">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{benefit.title}</h2>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="flex flex-col rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-purple-500/5 backdrop-blur md:p-8 lg:col-span-6">
          <h2 className="text-2xl font-black">
            {mode === 'create'
              ? isHi
                ? 'अपना अकाउंट बनाएँ'
                : 'Create your account'
              : isHi
                ? 'वापस स्वागत है'
                : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isHi
              ? 'अपने Corner Kona अकाउंट के लिए Google से सुरक्षित साइन इन करें।'
              : 'Use Google to securely create or access your Corner Kona account.'}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-muted p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => setMode('create')}
              aria-pressed={mode === 'create'}
              className={`rounded-xl py-2.5 transition-all duration-200 ${
                mode === 'create' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isHi ? 'खाता बनाएँ' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              aria-pressed={mode === 'login'}
              className={`rounded-xl py-2.5 transition-all duration-200 ${
                mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isHi ? 'लॉगिन करें' : 'Sign In'}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="mt-6 h-12 w-full gap-3 rounded-xl text-sm font-bold"
          >
            {isSigningIn ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <span aria-hidden="true" className="font-bold text-lg text-[#4285F4]">G</span>
            )}
            {isSigningIn
              ? isHi
                ? 'Google से जुड़ रहे हैं...'
                : 'Connecting to Google...'
              : isHi
                ? 'Google से जारी रखें'
                : 'Continue with Google'}
          </Button>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            {isHi
              ? 'जारी रखने पर आप हमारे उपयोग की शर्तों और गोपनीयता नीति से सहमत होते हैं।'
              : 'By continuing, you agree to our Terms of Service and Privacy Policy.'}
          </p>
        </section>
      </div>
    </div>
  )
}
