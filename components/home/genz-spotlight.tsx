'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Flame, Sparkles, MessageCircle, Share2, Play, Volume2, ArrowRight } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface GenZSpotlightProps {
  locale: Locale
}

interface ViralCard {
  id: string
  tag: string
  tagColor: string
  title: Record<Locale, string>
  sub: Record<Locale, string>
  author: string
  likes: number
  shares: string
  image: string
  categorySlug: string
}

const viralCards: ViralCard[] = [
  {
    id: 'vc-1',
    tag: '✨ DELULU-SOLULU',
    tagColor: 'bg-pink-500 text-white',
    title: {
      hi: 'जब दिमाग कहे Delulu, पर दिल मांगे Solulu: क्या सच में यह काम करता है?',
      en: 'When the Mind Says Delulu but the Heart Seeks Solulu: Does it Really Work?',
    },
    sub: {
      hi: 'सोशल मीडिया के इस सबसे बड़े मनोवैज्ञानिक ट्रेंड का असली विश्लेषण।',
      en: 'The genuine psychological breakdown of social media’s biggest slang trend.',
    },
    author: 'आदित्य & रिया',
    likes: 4218,
    shares: '12K',
    image: '/images/short-streetfood.png',
    categorySlug: 'gen-z-kona',
  },
  {
    id: 'vc-2',
    tag: '🔥 Z-चस्के',
    tagColor: 'bg-purple-600 text-white',
    title: {
      hi: 'रात के 2 बजे की मैगी, कान में ईयरफ़ोन और Corner Kona का हॉरर पॉडकास्ट',
      en: '2 AM Maggi, Earphones On & Late Night Corner Kona Horror Podcasts',
    },
    sub: {
      hi: 'अकेलेपन को सुकून में बदलने वाले लेट-नाइट ऑडियो चस्के।',
      en: 'How late-night audio habits turn solitude into pure creative calm.',
    },
    author: 'तन्वी मेहरा',
    likes: 8940,
    shares: '24K',
    image: '/images/life-chai.png',
    categorySlug: 'gen-z-kona',
  },
  {
    id: 'vc-3',
    tag: '🎭 मीम्स-कोना',
    tagColor: 'bg-rose-500 text-white',
    title: {
      hi: 'जब पूरे देश ने कहा "बस यही तो सच है!" — हफ़्ते के 5 टॉप मीम्स',
      en: 'When the Entire Country Said "This is Pure Truth!" — Top 5 Viral Memes',
    },
    sub: {
      hi: 'एग्ज़ाम से लेकर सैलरी तक, हर relatable भावना का मीम अवतार।',
      en: 'From exams to first paychecks, every relatable emotion decoded.',
    },
    author: 'मीम डेस्क',
    likes: 14520,
    shares: '48K',
    image: '/images/hero-podcast.png',
    categorySlug: 'gallery',
  },
  {
    id: 'vc-4',
    tag: '⚡ GEN-Y & MILLENNIALS',
    tagColor: 'bg-emerald-600 text-white',
    title: {
      hi: '90s के नॉस्टैल्जिया से Gen-Z के AI टूल्स तक: हम कितनी दूर आ गए?',
      en: 'From 90s TV Nostalgia to Gen-Z AI Tools: How Far Have We Journeyed?',
    },
    sub: {
      hi: 'दो पीढ़ियों की अनोखी बातचीत, जो हर घर में रोज़ होती है।',
      en: 'The cross-generational dialogue happening across Indian dinner tables.',
    },
    author: 'रोहित वर्मा',
    likes: 6732,
    shares: '18K',
    image: '/images/ent-film.png',
    categorySlug: 'gen-z-kona',
  },
]

export function GenZSpotlight({ locale }: GenZSpotlightProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [reacted, setReacted] = useState<Record<string, boolean>>({})

  const handleReaction = (id: string, initialLikes: number) => {
    const isLiked = reacted[id]
    setReacted((prev) => ({ ...prev, [id]: !isLiked }))
    setReactions((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + (isLiked ? -1 : 1),
    }))
  }

  return (
    <section aria-labelledby="genz-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-card via-card/90 to-card p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Ambient neon decorative background orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-purple-500/15 blur-3xl" />

        {/* Section Header */}
        <div className="relative mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 text-xs font-black tracking-wider text-white uppercase shadow-md shadow-pink-500/25">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {locale === 'hi' ? 'वायरल कोना' : 'VIRAL RADAR'}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {locale === 'hi' ? 'इंटरनेट ट्रेंड्स & मीम्स' : 'Internet Trends & Culture'}
              </span>
            </div>
            <h2 id="genz-h" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {locale === 'hi' ? '⚡ Gen-Z कोना & ट्रेंडिंग वाइब्स' : '⚡ Gen-Z Corner & Trending Vibes'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {locale === 'hi'
                ? 'Delulu-Solulu, Z-चस्के, मीम्स और आज के युवाओं की अनफ़िल्टर्ड आवाज़'
                : 'Delulu-Solulu, Z-Chaske, memes, and unfiltered youth conversations'}
            </p>
          </div>

          <Link
            href={localePath(locale, '/gen-z-kona')}
            className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-600 dark:text-pink-400 transition-all hover:bg-pink-500 hover:text-white"
          >
            <span>{locale === 'hi' ? 'पूरा Gen-Z कोना देखें' : 'Explore Gen-Z Hub'}</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Dynamic Interactive Cards */}
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {viralCards.map((card) => {
            const currentLikes = reactions[card.id] ?? card.likes
            const isLiked = Boolean(reacted[card.id])

            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 backdrop-blur-sm"
              >
                <div>
                  {/* Top Badge & Share */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-wide uppercase', card.tagColor)}>
                      {card.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <Share2 className="size-3" aria-hidden="true" />
                      {card.shares}
                    </span>
                  </div>

                  {/* Thumbnail / Visual banner */}
                  <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white/90">
                      @{card.author}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <Link href={localePath(locale, `/${card.categorySlug}`)} className="group-hover:text-primary transition-colors">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug">
                      {card.title[locale]}
                    </h3>
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {card.sub[locale]}
                  </p>
                </div>

                {/* Interactive Bottom Action Bar */}
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <button
                    type="button"
                    onClick={() => handleReaction(card.id, card.likes)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-90 cursor-pointer',
                      isLiked
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                        : 'bg-muted/80 text-foreground hover:bg-rose-500/10 hover:text-rose-500'
                    )}
                  >
                    <Flame className={cn('size-3.5', isLiked && 'fill-current animate-bounce')} aria-hidden="true" />
                    <span>{currentLikes.toLocaleString()}</span>
                  </button>

                  <Link
                    href={localePath(locale, `/${card.categorySlug}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{locale === 'hi' ? 'पढ़ें' : 'Read'}</span>
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
