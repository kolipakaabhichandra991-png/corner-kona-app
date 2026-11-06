'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lock, Play, Pause, Sparkles } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Episode } from '@/lib/content/types'
import { useAudio } from '@/components/audio/audio-context'

export function AntarYatraPromo({ locale, t, episodes }: { locale: Locale; t: Dictionary; episodes: Episode[] }) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = useAudio()

  return (
    <section aria-labelledby="antar-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground md:corner-cut md:p-10">
        <Image src="/images/antar-yatra.png" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink via-ink/85 to-ink/40" />

        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-antar px-3 py-1 text-xs font-extrabold tracking-wide text-primary-foreground uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t.nav.premium}
            </span>
            <h2 id="antar-h" className="text-4xl leading-none font-semibold tracking-wide md:text-5xl">
              {t.home.antarTitle}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-pretty text-ink-foreground/80">{t.home.antarBody}</p>
            <Link
              href={localePath(locale, '/antar-yatra')}
              className="inline-flex h-12 w-fit animate-glow items-center rounded-full bg-antar px-6 font-bold text-primary-foreground shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-antar focus-visible:ring-offset-2 focus-visible:ring-offset-ink cursor-pointer"
            >
              {t.home.antarCta}
            </Link>
          </div>

          <ul className="flex flex-col gap-3">
            {episodes.map((ep) => {
              const isThisPlaying = currentTrack?.id === ep.id && isPlaying
              const isThisCurrent = currentTrack?.id === ep.id

              return (
                <li key={ep.id}>
                  <div className="group flex items-center gap-4 rounded-2xl bg-ink-foreground/10 p-3 backdrop-blur transition-all duration-300 hover:translate-x-1 hover:bg-ink-foreground/20 hover:shadow-lg">
                    <Link
                      href={localePath(locale, `/antar-yatra/${ep.slug}`)}
                      className="relative size-16 shrink-0 overflow-hidden rounded-xl"
                    >
                      <Image src={ep.image || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
                      <span className="absolute inset-0 grid place-items-center bg-ink/40 transition-colors group-hover:bg-ink/20">
                        <Lock className="size-4" aria-hidden="true" />
                      </span>
                    </Link>

                    <Link
                      href={localePath(locale, `/antar-yatra/${ep.slug}`)}
                      className="min-w-0 flex-1"
                    >
                      <span className="block truncate font-bold group-hover:text-amber-300 transition-colors">{ep.title[locale]}</span>
                      <span className="block text-xs text-ink-foreground/65">
                        {ep.show[locale]} · {ep.durationMin} {t.home.min}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (isThisCurrent) {
                          togglePlay()
                        } else {
                          playTrack(ep)
                        }
                      }}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                        isThisPlaying
                          ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/40'
                          : 'border border-antar/60 text-amber-300 hover:bg-antar hover:text-stone-950'
                      }`}
                      aria-label={`${isThisPlaying ? 'Pause' : 'Preview'} ${ep.title[locale]}`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="size-3 fill-current" aria-hidden="true" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="size-3 fill-current" aria-hidden="true" />
                          <span>{t.home.antarPreview}</span>
                        </>
                      )}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
