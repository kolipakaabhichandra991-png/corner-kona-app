'use client'

import Link from 'next/link'
import { Flame, Radio, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'

interface TickerProps {
  locale: Locale
}

export function LiveTicker({ locale }: TickerProps) {
  const items = [
    {
      tag: locale === 'hi' ? 'लाइव स्कोर' : 'LIVE SCORE',
      title: locale === 'hi' ? 'भारत बनाम ऑस्ट्रेलिया: तीसरा टेस्ट (लंच तक 182/3, गिल 74*)' : 'India vs Australia: 3rd Test (182/3 at Lunch, Gill 74*)',
      href: localePath(locale, '/live/india-vs-australia-live'),
      icon: Radio,
      color: 'text-red-500',
    },
    {
      tag: locale === 'hi' ? 'ट्रेंडिंग' : 'TRENDING',
      title: locale === 'hi' ? 'Delulu से Solulu तक: Gen-Z की नई इंटरनेट डिक्शनरी' : 'Delulu to Solulu: Gen-Z’s New Internet Playbook',
      href: localePath(locale, '/gen-z-kona'),
      icon: Flame,
      color: 'text-pink-500',
    },
    {
      tag: locale === 'hi' ? 'नया पॉडकास्ट' : 'NEW PODCAST',
      title: locale === 'hi' ? 'गली से वर्ल्ड कप तक: छोटे शहरों के सितारों की अनसुनी दास्तान' : 'From Gully to World Cup: Untold Stories of Small-Town Stars',
      href: localePath(locale, '/podcasts/gully-se-world-cup'),
      icon: Sparkles,
      color: 'text-purple-500',
    },
    {
      tag: locale === 'hi' ? 'स्पेस & साइंस' : 'SPACE & SCIENCE',
      title: locale === 'hi' ? 'चंद्रयान से शुक्रयान: भारत के अगले बड़े अंतरिक्ष अभियान' : 'From Chandrayaan to Shukrayaan: India’s Next Deep Space Frontier',
      href: localePath(locale, '/science-gyan'),
      icon: Zap,
      color: 'text-cyan-500',
    },
    {
      tag: locale === 'hi' ? 'अंतर यात्रा' : 'ANTAR YATRA',
      title: locale === 'hi' ? 'मन का मौन: 10 मिनट का गाइडेड ध्यान सत्र अब उपलब्ध' : 'Silence of the Mind: 10-Minute Guided Meditation Available Now',
      href: localePath(locale, '/antar-yatra/mann-ka-maun'),
      icon: TrendingUp,
      color: 'text-amber-500',
    },
  ]

  // Duplicate items for seamless infinite marquee scroll
  const marqueeItems = [...items, ...items]

  return (
    <div className="border-y border-border/50 bg-card/60 backdrop-blur-md overflow-hidden py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6">
        {/* Fixed Live Label */}
        <div className="flex items-center gap-2 pr-4 shrink-0 border-r border-border/60">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-600" />
          </span>
          <span className="font-extrabold tracking-wider uppercase text-foreground">
            {locale === 'hi' ? 'लाइव हलचल' : 'PULSE LIVE'}
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="relative flex overflow-hidden whitespace-nowrap pl-4 group">
          <div className="flex animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] gap-8">
            {marqueeItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <Link
                  key={`${item.href}-${idx}`}
                  href={item.href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <span className={`inline-flex items-center gap-1 font-bold ${item.color}`}>
                    <Icon className="size-3.5" aria-hidden="true" />
                    <span>[{item.tag}]</span>
                  </span>
                  <span className="font-medium text-foreground/90">{item.title}</span>
                  <span className="text-muted-foreground/40 select-none">•</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
