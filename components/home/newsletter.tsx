'use client'

import { useState } from 'react'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Newsletter({ t }: { t: Dictionary }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'invalid'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('invalid')
    setStatus('loading')
    const res = await fetch('/api/v1/newsletter', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => null)
    setStatus(res?.ok ? 'done' : 'invalid')
  }

  return (
    <section aria-labelledby="nl-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative overflow-hidden flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#0EA5E9] p-6 text-white shadow-2xl shadow-purple-500/15 md:flex-row md:items-center md:justify-between md:p-12 transition-all">
        {/* Subtle decorative glow circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-black/10 blur-3xl" />

        <div className="flex flex-col gap-2 max-w-md relative z-10">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black tracking-wider uppercase backdrop-blur">
            <Sparkles className="size-3.5 text-amber-300" />
            Corner Kona Dispatch
          </span>
          <h2 id="nl-h" className="text-2xl leading-tight font-black text-balance md:text-3xl lg:text-4xl">
            {t.home.newsletterTitle}
          </h2>
        </div>

        {status === 'done' ? (
          <div role="status" className="relative z-10 inline-flex items-center gap-3 rounded-2xl bg-white/20 p-4 font-bold backdrop-blur animate-rise">
            <span className="grid size-8 place-items-center rounded-full bg-white text-emerald-600 shadow-md">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <span className="text-base">{t.home.newsletterDone}</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative z-10 flex w-full max-w-md flex-col gap-2">
            <div className="flex gap-2">
              <label htmlFor="nl-email" className="sr-only">
                {t.home.newsletterPlaceholder}
              </label>
              <input
                id="nl-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t.home.newsletterPlaceholder}
                aria-invalid={status === 'invalid'}
                aria-describedby={status === 'invalid' ? 'nl-err' : undefined}
                className="h-12 min-w-0 flex-1 rounded-full border-2 border-white/30 bg-white/95 px-5 text-gray-900 placeholder:text-gray-500 shadow-inner focus:border-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm font-medium"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="h-12 rounded-full bg-gray-950 px-6 font-bold text-white hover:bg-black active:scale-95 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                {status === 'loading' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t.home.newsletterCta
                )}
              </Button>
            </div>
            {status === 'invalid' && (
              <p id="nl-err" role="alert" className="pl-4 text-xs font-bold text-red-100 bg-red-950/40 rounded-lg py-1 px-3 w-fit animate-rise">
                {t.home.newsletterInvalid}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
