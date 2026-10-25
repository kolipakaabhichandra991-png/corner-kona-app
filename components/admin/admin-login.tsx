'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, User, KeyRound, ShieldCheck, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/brand/logo'

export function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें (Please enter username and password)')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'अमान्य क्रेडेंशियल्स (Invalid credentials)')
      }

      // Success -> navigate to /admin
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername('admin')
    setPassword('admin123')
    setError(null)
  }

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>वेबसाइट पर वापस जाएँ (Back to Site)</span>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-card/85 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 size-48 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-indigo-600/40 blur-3xl" />

        {/* Header Branding */}
        <div className="relative mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/25 ring-2 ring-white/20">
            <Lock className="size-7" />
          </div>
          <Logo size="md" />
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-purple-400 ring-1 ring-purple-500/30">
              Admin Portal Console
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            वेबसाइट सामग्री प्रबंधन और प्रकाशन केंद्र
            <br />
            (Website Content Publishing & Management System)
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Pill */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-purple-400" />
            <span className="text-[11px] text-muted-foreground">
              डिफ़ॉल्ट लॉगिन:{' '}
              <strong className="text-foreground">admin</strong> /{' '}
              <strong className="text-foreground">admin123</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="rounded-lg bg-purple-600 px-2.5 py-1 text-[11px] font-bold text-white transition-transform hover:scale-105 active:scale-95"
          >
            ऑटो-फिल (Auto-Fill)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs font-semibold text-rose-400 animate-in fade-in zoom-in-95">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground/90" htmlFor="username">
              यूज़रनेम (Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground/90" htmlFor="password">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.02] hover:shadow-purple-600/40 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>सत्यापित किया जा रहा है...</span>
              </span>
            ) : (
              <>
                <span>एडमिन लॉगिन करें (Sign In as Admin)</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>सुरक्षित एसएसएल एन्क्रिप्टेड एडमिन कंसोल</span>
        </div>
      </div>
    </div>
  )
}
