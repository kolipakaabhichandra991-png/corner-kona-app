'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, MessageCircle, Share2, Play, Volume2, ArrowRight, Bookmark, Headphones } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface GenZSpotlightProps {
  locale: Locale
}

interface SpotlightCard {
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
  format: 'audio' | 'story' | 'video'
}

const spotlightCards: SpotlightCard[] = [
  {
    id: 'ck-1',
    tag: '🌍 GEOPOLITICS & STRATEGY',
    tagColor: 'bg-indigo-600 text-white',
    title: {
      hi: 'वैश्विक शतरंज और भारत की नई कूटनीति: 21वीं सदी की महाशक्ति की असली कहानी',
      en: 'The Global Chessboard & India’s New Diplomacy: Inside the 21st Century Strategic Ascent',
    },
    sub: {
      hi: 'सतही बहसों से परे, अंतरराष्ट्रीय संबंधों और सामरिक शक्ति का एक गहन विश्लेषणात्मक ऑडियो प्रारूप।',
      en: 'Beyond news headlines: a rigorous, deeply researched narrative exploring geopolitical leverage and economic statecraft.',
    },
    author: 'Corner Kona Editorial Desk',
    likes: 5420,
    shares: '14K',
    image: '/images/short-streetfood.png',
    categorySlug: 'geopolitics',
    format: 'audio',
  },
  {
    id: 'ck-2',
    tag: '🎧 IMMERSIVE SOUNDSCAPES',
    tagColor: 'bg-amber-600 text-white',
    title: {
      hi: 'रात के सन्नाटे में किताबों की आवाज़: क्यों भारत का युवा ऑडियोबुक्स की ओर लौट रहा है',
      en: 'Soundscapes of Solitude: Why Modern Audiences are Embracing Cinematic Audiobooks',
    },
    sub: {
      hi: 'स्क्रीन थकान से मुक्ति और कानों में उतरती दुनिया — ऑडियो स्टोरीटेलिंग का नया सांस्कृतिक पुनर्जागरण।',
      en: 'Escaping screen fatigue through multi-voice narration, atmospheric acoustics, and mindful literature.',
    },
    author: 'तन्वी मेहरा (Audio Features)',
    likes: 8940,
    shares: '24K',
    image: '/images/life-chai.png',
    categorySlug: 'podcasts',
    format: 'audio',
  },
  {
    id: 'ck-3',
    tag: '🏆 SPORTS & HUMAN SPIRIT',
    tagColor: 'bg-emerald-600 text-white',
    title: {
      hi: '22 गज़ की पिच से परे: दबाव, डिप्रेशन और खेल के मैदान पर लड़े जाने वाले अनदेखे युद्ध',
      en: 'Beyond the Boundary: The Psychological Grit and Untold Human Struggles in Elite Sports',
    },
    sub: {
      hi: 'जीत और हार के बीच की मनोवैज्ञानिक दास्तान, जो कैमरों की चमक में कभी नहीं दिखती।',
      en: 'Locker room realities, high-stakes pressure, and the personal battles champions fight behind the glory.',
    },
    author: 'रोहित वर्मा (Sports Studio)',
    likes: 9120,
    shares: '19K',
    image: '/images/ent-film.png',
    categorySlug: 'sports',
    format: 'story',
  },
  {
    id: 'ck-4',
    tag: '🪷 HERITAGE & MODERN MIND',
    tagColor: 'bg-purple-600 text-white',
    title: {
      hi: 'प्राचीन दर्शन और आधुनिक मन: उपनिषदों की सूझबूझ जो आज के तनाव भरे जीवन में शांति देती है',
      en: 'Timeless Wisdom for Modern Chaos: Reinterpreting Ancient Thought for Everyday Peace',
    },
    sub: {
      hi: 'आध्यात्मिकता का कोई संकीर्ण दायरा नहीं, बल्कि जीवन जीने की एक संवेदनशील और व्यावहारिक कला।',
      en: 'Philosophical clarity designed for contemporary burnout, emotional resilience, and introspective clarity.',
    },
    author: 'अभिमन्यु शास्त्री',
    likes: 12840,
    shares: '32K',
    image: '/images/hero-podcast.png',
    categorySlug: 'bhakti',
    format: 'audio',
  },
]

export function GenZSpotlight({ locale }: GenZSpotlightProps) {
  const isHi = locale === 'hi'
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
    <section aria-labelledby="kona-spotlight-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-card via-card/95 to-card p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Ambient atmospheric background glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Section Header */}
        <div className="relative mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-primary px-3 py-1 text-xs font-black tracking-wider text-white uppercase shadow-md shadow-primary/20">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {isHi ? 'कोना विशेष' : 'CORNER SPOTLIGHT'}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {isHi ? 'गहन स्टोरीटेलिंग & अनुसंधान' : 'Deep Storytelling & Research'}
              </span>
            </div>
            <h2 id="kona-spotlight-h" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {isHi ? '🎙️ कोना: कथा, आवाज़ और गहरा चिंतन' : '🎙️ The Corner Narrative & Ideas Space'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base max-w-2xl">
              {isHi
                ? 'सतही ख़बरों से परे: गहन पॉडकास्ट, विचारोत्तेजक ऑडियोबुक्स और आज की पीढ़ी के लिए अर्थपूर्ण कहानियाँ।'
                : 'Beyond fast news: immersive podcasts, investigative storytelling, and resonant conversations curated for thinkers and creators.'}
            </p>
          </div>

          <Link
            href={localePath(locale, '/podcasts')}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-primary hover:text-primary-foreground shadow-sm shrink-0"
          >
            <span>{isHi ? 'पूरी ऑडियो लाइब्रेरी देखें' : 'Explore All Audio & Stories'}</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Dynamic Thematic Cards */}
        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {spotlightCards.map((card) => {
            const currentLikes = reactions[card.id] ?? card.likes
            const isLiked = Boolean(reacted[card.id])

            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl"
              >
                <div>
                  {/* Media Thumbnail with format badge */}
                  <div className="relative mb-3.5 aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-sm">
                    <Image
                      src={card.image}
                      alt={card.title[locale]}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span
                      className={cn(
                        'absolute top-2.5 left-2.5 rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider uppercase shadow-md',
                        card.tagColor,
                      )}
                    >
                      {card.tag}
                    </span>

                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      <Headphones className="size-3 text-amber-400" />
                      <span>{card.format === 'audio' ? 'Audio Edition' : 'In-Depth'}</span>
                    </div>
                  </div>

                  {/* Title & Sub */}
                  <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {card.title[locale]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {card.sub[locale]}
                  </p>
                </div>

                {/* Footer with Author and Engagement */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium truncate max-w-[120px]">{card.author}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReaction(card.id, card.likes)}
                      aria-label="Like this piece"
                      className={cn(
                        'flex items-center gap-1 transition-colors hover:text-foreground cursor-pointer',
                        isLiked && 'text-rose-500 font-bold',
                      )}
                    >
                      <Sparkles className="size-3.5" />
                      <span>{currentLikes.toLocaleString()}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <Share2 className="size-3.5" />
                      <span>{card.shares}</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
