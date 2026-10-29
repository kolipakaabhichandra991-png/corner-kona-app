'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Headphones,
  Play,
  Pause,
  Lock,
  Heart,
  Compass,
  Sun,
  Moon,
  Coffee,
  Sunset,
  ShieldCheck,
  ChevronDown,
  Quote,
  Flame,
  Leaf,
  Volume2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import type { Episode } from '@/lib/content/types'
import { useAudio } from '@/components/audio/audio-context'
import { cn } from '@/lib/utils'
import { FaqRotatingCards } from '@/components/antar-yatra/faq-rotating-cards'
import { ScrollWordReveal } from '@/components/antar-yatra/scroll-word-reveal'
import { AnimatedCounter } from '@/components/antar-yatra/animated-counter'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface AntarYatraLandingProps {
  locale: Locale
  t: Dictionary
  episodes: Episode[]
}

export function AntarYatraLanding({ locale, t, episodes }: AntarYatraLandingProps) {
  const isHi = locale === 'hi'
  const { playTrack, togglePlay, currentTrack, isPlaying } = useAudio()
  const [activeRoutine, setActiveRoutine] = useState<number>(0)

  // Four Core Spiritual Dimensions / Pillars
  const pillars = [
    {
      icon: Leaf,
      accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500',
      tag: isHi ? 'शांति व ध्यान' : 'Dhyana & Stillness',
      title: isHi ? 'मन का मौन व श्वसन ध्यान' : 'Mindful Silence & Breathwork',
      desc: isHi
        ? 'दैनिक चिंता, तनाव और ओवरथिंकिंग को शांत करने के लिए गाइडेड मेडिटेशन, योग निद्रा और मौन साधना सत्र।'
        : 'Guided meditations, restorative Yoga Nidra, and quiet breathwork sessions designed to ease modern anxiety and mental chatter.',
    },
    {
      icon: Flame,
      accent: 'from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-500',
      tag: isHi ? 'गीता का दर्शन' : 'Gita for Youth',
      title: isHi ? 'गीता और आज का युवा' : 'The Gita & Modern Resilience',
      desc: isHi
        ? 'श्रीमद्भगवद्गीता के व्यावहारिक सूत्र—कर्मयोग, निष्काम भाव और करियर व रिश्तों में बिना भय निर्णय लेने की कला।'
        : 'Practical insights from the Bhagavad Gita—action without anxiety, resilience at workplace crossroads, and mastering self-doubt.',
    },
    {
      icon: Compass,
      accent: 'from-amber-600/20 to-yellow-500/10 border-amber-600/30 text-amber-600 dark:text-amber-400',
      tag: isHi ? 'रहस्यवादी वाणी' : 'Mystic & Saint Lore',
      title: isHi ? 'कबीर, मीरा और सूफी चिंतन' : 'Mystic Voices & Sacred Lore',
      desc: isHi
        ? 'कबीर के दोहे, मीरा की विरह-भक्ति, आदि शंकराचार्य का अद्वैत और सूफी प्रेम की अमर कहानियों की समकालीन व्याख्या।'
        : 'The fearless wisdom of Kabir, ecstatic devotion of Mirabai, Advaita non-duality, and Sufi lore translated for our modern era.',
    },
    {
      icon: Heart,
      accent: 'from-rose-500/20 to-amber-500/10 border-rose-500/30 text-rose-500',
      tag: isHi ? 'आंतरिक उपचार' : 'Inner Healing',
      title: isHi ? 'आत्म-प्रेम व मानसिक संतुलन' : 'Mental Balance & Self-Worth',
      desc: isHi
        ? 'अतीत के बोझ, अपराधबोध और तुलना की दौड़ से मुक्ति पाकर स्वयं से दोबारा जुड़ने की एक करुणा भरी यात्रा।'
        : 'Gentle journeys to release past baggage, dissolve comparison traps, and rebuild an unshakeable connection with your inner self.',
    },
  ]

  // Daily Routine Companion Tabs
  const routines = [
    {
      time: isHi ? 'सुबह 07:00 बजे' : '07:00 AM',
      name: isHi ? 'प्रभात जागरण — मन की ताज़गी' : 'Morning Awakening — 10 Min Grounding',
      icon: Sun,
      desc: isHi
        ? 'दिन की शुरुआत फोन के नोटिफ़िकेशन्स से नहीं, बल्कि 10 मिनट के शांत श्वास और कृतज्ञता चिंतन के साथ करें।'
        : 'Begin your day with grounding breathwork and intentional stillness instead of social media notifications.',
      recommend: isHi ? 'सुझाया गया: "मन का मौन" (पहला क़दम)' : 'Recommended: "Silence of the Mind: Part 1"',
    },
    {
      time: isHi ? 'दोपहर 02:00 बजे' : '02:00 PM',
      name: isHi ? 'मध्याह्न विश्राम — कर्म व एकाग्रता' : 'Midday Reset — 5 Min Gita Pause',
      icon: Coffee,
      desc: isHi
        ? 'कार्यस्थल के तनाव और थकान के बीच 5 मिनट का गीता सूत्र, जो मन को पुनः ऊर्जा और दिशा प्रदान करता है।'
        : 'A 5-minute Gita insight to dissolve afternoon work pressure, reground your focus, and restore calm clarity.',
      recommend: isHi ? 'सुझाया गया: "गीता और निष्काम कर्म"' : 'Recommended: "Action Without Anxiety"',
    },
    {
      time: isHi ? 'शाम 07:30 बजे' : '07:30 PM',
      name: isHi ? 'संध्या चिंतन — संतों के संग' : 'Evening Unwind — Mystic Storytelling',
      icon: Sunset,
      desc: isHi
        ? 'घर लौटते समय या चाय के साथ कबीर, बुद्ध और मीरा के जीवन से जुड़ी प्रेरक और शांत कहानियाँ।'
        : 'Unwind during your commute or evening tea with soulful, captivating stories of Kabir, Buddha, and Mirabai.',
      recommend: isHi ? 'सुझाया गया: "कबीर की साखी और सत्य"' : 'Recommended: "The Songs of Kabir"',
    },
    {
      time: isHi ? 'रात 10:30 बजे' : '10:30 PM',
      name: isHi ? 'निद्रा ध्यान — गहरी व विश्रामकारी नींद' : 'Night Soundscape — Restorative Sleep',
      icon: Moon,
      desc: isHi
        ? 'तानपुरा, बाँसुरी और 432Hz संगीत के साथ गाइडेड योग निद्रा, जो दिनभर की उलझनों को मिटाकर गहरी नींद लाती है।'
        : 'Gentle flute melodies, ambient tanpura, and guided Yoga Nidra to melt overthinking and lead you into deep sleep.',
      recommend: isHi ? 'सुझाया गया: "योग निद्रा व शयन ध्वनि"' : 'Recommended: "Yoga Nidra for Deep Sleep"',
    },
  ]

  // Testimonials
  const testimonials = [
    {
      quote: isHi
        ? '“एक सॉफ्टवेयर इंजीनियर के तौर पर मेरा दिमाग 24/7 चलता रहता था। अंतर यात्रा के 15 मिनट के सत्र ने मेरी सुबह की चाय को असली ध्यान बना दिया।”'
        : '“As a developer, my brain was wired 24/7. 15 minutes of Antar Yatra during my morning tea has completely replaced my doomscrolling.”',
      author: isHi ? 'आर्यन मेहरा' : 'Aryan Mehra',
      role: isHi ? 'सॉफ्टवेयर आर्किटेक्ट, बेंगलुरु' : 'Software Architect, Bengaluru',
      tag: isHi ? 'दैनिक श्रोता' : 'Daily Listener',
    },
    {
      quote: isHi
        ? '“भगवद्गीता को इतनी आधुनिक भाषा और व्यावहारिक अंदाज़ में मैंने पहली बार सुना। कोई भारी उपदेश नहीं, बस जीवन जीने की गहरी समझ।”'
        : '“For the first time, the Bhagavad Gita speaks in my language. No heavy dogmas—just real, applicable wisdom for career and mental resilience.”',
      author: isHi ? 'प्रिया शर्मा' : 'Priya Sharma',
      role: isHi ? 'फाइनेंस कंसल्टेंट, नई दिल्ली' : 'Finance Consultant, New Delhi',
      tag: isHi ? 'पैट्रन सदस्य' : 'Patron Member',
    },
    {
      quote: isHi
        ? '“100% विज्ञापन-मुक्त अनुभव सबसे बड़ी बात है। जब आप ध्यान या श्लोक में डूबे हों, तब कोई अचानक कमर्शियल नहीं बजता। यह पवित्रता अमूल्य है।”'
        : '“The 100% ad-free experience is everything. When you are deep into a meditation or chant, no jarring ads interrupt the peace. Truly priceless.”',
      author: isHi ? 'कबीर वर्मा' : 'Kabir Varma',
      role: isHi ? 'डिजिटल क्रिएटर, मुंबई' : 'Creative Director, Mumbai',
      tag: isHi ? 'वार्षिक संरक्षक' : 'Annual Patron',
    },
  ]

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* 1. HERO SECTION: Meditative, Warm & Atmospheric */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-stone-900 via-ink to-amber-950/40 px-6 py-16 text-ink-foreground shadow-2xl md:px-12 md:py-24">
        {/* Ambient background textures */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <Image
            src="/images/antar-yatra.png"
            alt="Antar Yatra Spiritual Atmosphere"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center mix-blend-overlay"
          />
        </div>
        <div className="absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 -z-10 size-96 rounded-full bg-orange-600/15 blur-3xl" />

        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Sacred Kicker Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1.5 text-xs font-black tracking-widest text-amber-300 uppercase backdrop-blur shadow-sm">
            <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
            <span>{isHi ? 'कॉर्नर कोना विशेष • अंतर्मन की पावन यात्रा' : 'Corner Kona Signature Sanctuary'}</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
            {isHi ? (
              <>
                अंतर यात्रा — <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">भीतर की एक शांत यात्रा</span>
              </>
            ) : (
              <>
                Antar Yatra — <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">The Sacred Journey Within</span>
              </>
            )}
          </h1>

          {/* Subtitle / Essence Brief */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-foreground/85 md:text-xl font-normal">
            {isHi
              ? 'दौड़ती-भागती ज़िंदगी और डिजिटल शोर के बीच रोज़ाना 15 मिनट अपने लिए। वैदिक दर्शन, श्रीमद्भगवद्गीता के व्यावहारिक रहस्य, गहन ध्यान और रूहानी कहानियों का एक 100% विज्ञापन-मुक्त पवित्र संसार।'
              : 'In a relentless, notification-driven world, a dedicated sanctuary to pause, breathe, and return to yourself. 100% ad-free contemplative podcasts, timeless Gita wisdom for modern stress, and restorative meditative soundscapes.'}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#featured-episodes"
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50 active:scale-95 cursor-pointer"
            >
              <Play className="size-4 fill-stone-950" />
              <span>{isHi ? 'मुफ़्त प्रीव्यू सुनें' : 'Listen to Free Preview'}</span>
            </a>

            <a
              href="#patron-circle"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-amber-400/50 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:border-amber-300 active:scale-95 cursor-pointer"
            >
              <Sparkles className="size-4 text-amber-300" />
              <span>{isHi ? 'संरक्षक बनें (Patron Circle)' : 'Explore Patron Circle'}</span>
            </a>
          </div>

          {/* Trust Highlights Ribbon with Animated PureCounters */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 border-t border-white/10 pt-8 text-xs font-semibold text-ink-foreground/80">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="size-4 text-amber-400 shrink-0" />
              <span>
                <AnimatedCounter end={100} suffix="%" className="font-black text-amber-300 mr-1" />
                {isHi ? 'विज्ञापन-मुक्त' : 'Ad-Free Sanctity'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Headphones className="size-4 text-amber-400 shrink-0" />
              <span>
                <AnimatedCounter end={432} suffix="Hz" className="font-black text-amber-300 mr-1" />
                {isHi ? 'तानपुरा व बाँसुरी' : 'Binaural Acoustics'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="size-4 text-amber-400 shrink-0" />
              <span>
                <AnimatedCounter end={100} suffix="%" className="font-black text-amber-300 mr-1" />
                {isHi ? 'द्विभाषी अनुवाद' : 'Bilingual Sync'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Leaf className="size-4 text-amber-400 shrink-0" />
              <span>
                <AnimatedCounter end={15} suffix=" Min" className="font-black text-amber-300 mr-1" />
                {isHi ? 'दैनिक शांति' : 'Daily Stillness'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Green Inspired Flowing Mantra Marquee with Decelerating Hover */}
      <div className="w-full overflow-hidden border-y border-border/50 bg-card/40 py-3.5 backdrop-blur group">
        <div className="flex w-max animate-marquee gap-8 text-xs font-bold tracking-widest text-muted-foreground uppercase transition-all duration-700 group-hover:[animation-play-state:paused]">
          <span>✨ {isHi ? 'मन का मौन' : 'Silence of Mind'}</span>
          <span>•</span>
          <span>432Hz {isHi ? 'तानपुरा व बाँसुरी' : 'Acoustic Soundscapes'}</span>
          <span>•</span>
          <span>{isHi ? 'श्रीमद्भगवद्गीता' : 'Bhagavad Gita Wisdom'}</span>
          <span>•</span>
          <span>{isHi ? '100% विज्ञापन-मुक्त' : 'Zero Ads Sanctity'}</span>
          <span>•</span>
          <span>{isHi ? 'कबीर व मीरा की साखी' : 'Mystic Saint Lore'}</span>
          <span>•</span>
          <span>{isHi ? 'योग निद्रा व शयन ध्यान' : 'Restorative Sleep'}</span>
          <span>•</span>
          <span>✨ {isHi ? 'मन का मौन' : 'Silence of Mind'}</span>
          <span>•</span>
          <span>432Hz {isHi ? 'तानपुरा व बाँसुरी' : 'Acoustic Soundscapes'}</span>
          <span>•</span>
          <span>{isHi ? 'श्रीमद्भगवद्गीता' : 'Bhagavad Gita Wisdom'}</span>
          <span>•</span>
          <span>{isHi ? '100% विज्ञापन-मुक्त' : 'Zero Ads Sanctity'}</span>
          <span>•</span>
          <span>{isHi ? 'कबीर व मीरा की साखी' : 'Mystic Saint Lore'}</span>
          <span>•</span>
          <span>{isHi ? 'योग निद्रा व शयन ध्यान' : 'Restorative Sleep'}</span>
        </div>
      </div>

      {/* 2. THE BRIEF: WHAT IS ANTAR YATRA & WHY WE CREATED IT */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
            {isHi ? 'अंतर यात्रा की परिकल्पना' : 'The Antar Yatra Manifesto'}
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-foreground md:text-5xl">
            {isHi ? 'अंतर यात्रा क्या है और इसकी ज़रूरत क्यों पड़ी?' : 'What is Antar Yatra & Why Did We Create It?'}
          </h2>

          {/* Purpose Green word-by-word scroll scrub reveal */}
          <ScrollWordReveal
            className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl font-medium tracking-tight text-foreground/90 leading-relaxed"
            text={
              isHi
                ? 'क्या आपने कभी सोचा है कि जब दुनिया का सारा शोर बंद हो जाता है तो भीतर क्या बचता है? अंतर यात्रा कोई साधारण पॉडकास्ट नहीं है। यह स्क्रीन की भागदौड़ से दूर, आपकी सांसों, आपके मन और वैदिक दर्शन की गहराइयों में एक पवित्र विराम है। यहाँ श्रीमद्भगवद्गीता के व्यावहारिक सूत्र और कबीर की वाणी आपके दैनिक तनाव को शांत करते हैं।'
                : 'Have you ever wondered what remains within when the noise of the outside world finally fades away? Antar Yatra is not another media channel. It is a mindful pause away from algorithmic exhaustion—anchoring your breath, your mind, and timeless Vedic clarity into your everyday life.'
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <ScrollReveal delay={0} direction="up">
            <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="flex flex-col gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-display font-black text-lg transition-transform duration-300 group-hover:scale-110">
                  01
                </span>
                <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {isHi ? 'शोर से मौन की ओर (Silence Amid Noise)' : 'From Digital Noise to Sacred Stillness'}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {isHi
                    ? 'सोशल मीडिया के 15-सेकंड के त्वरित दौर में ध्यान बिखर जाता है। अंतर यात्रा आपको ठहरने, गहरी सांस लेने और अपने भीतर झाँकने का सुरक्षित स्थान देती है।'
                    : 'Constant algorithmic stimulation fragments our attention span. Antar Yatra creates an intentional pause where you can breathe, slow down, and recalibrate.'}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>{isHi ? 'मन का रीसेट' : 'Mental Recalibration'}</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={120} direction="up">
            <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10">
              <div className="flex flex-col gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-display font-black text-lg transition-transform duration-300 group-hover:scale-110">
                  02
                </span>
                <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  {isHi ? 'रूढ़ि नहीं, जीवन दर्शन (Practical Wisdom)' : 'Timeless Philosophy, Zero Dogma'}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {isHi
                    ? 'हम धार्मिक आडंबरों से दूर, श्रीमद्भगवद्गीता और उपनिषदों के उन सूत्रों को प्रस्तुत करते हैं जो आपके करियर, रिश्तों और मानसिक तनाव में रोशनी बन सकें।'
                    : 'We strip away rigid dogma and present the profound psychology of the Gita, Upanishads, and Zen as practical tools for career crossroads, burnout, and purpose.'}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <span>{isHi ? 'युवाओं के लिए प्रासंगिक' : 'Built for Modern Seekers'}</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={240} direction="up">
            <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="flex flex-col gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-600/15 text-amber-600 dark:text-amber-400 font-display font-black text-lg transition-transform duration-300 group-hover:scale-110">
                  03
                </span>
                <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {isHi ? 'पवित्रता की रक्षा (100% Ad-Free)' : 'Protected Sanctity (Zero Ads)'}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {isHi
                    ? 'किसी भी पावन धुन या ध्यान के बीच अचानक डिटर्जेंट या कोल्ड ड्रिंक का विज्ञापन नहीं बजना चाहिए। यह कमिटमेंट केवल श्रोता-समर्थित मॉडल से ही संभव है।'
                    : 'Sacred chants and quiet contemplation should never be broken by commercial interruptions. A patron-supported model preserves uncompromised audio purity.'}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>{isHi ? 'श्रोताओं का अपना वृत्त' : 'Patron Sustained'}</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. FOUR SACRED PATHWAYS / DIMENSIONS */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
            {isHi ? 'चार आयाम' : 'Four Sacred Tracks'}
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-foreground md:text-4xl">
            {isHi ? 'अंतर यात्रा के चार पावन मार्ग' : 'Four Pillars of the Inner Journey'}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {isHi
              ? 'हर मार्ग मन की एक विशिष्ट आवश्यकता को पूरा करने के लिए सावधानी से गढ़ा गया है।'
              : 'Each track is meticulously crafted to address a specific facet of your inner life.'}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <ScrollReveal key={i} delay={i * 90} direction="scale">
                <div className="group flex flex-col justify-between h-full rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-amber-500/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={cn('grid size-12 place-items-center rounded-2xl border bg-gradient-to-br transition-transform duration-300 group-hover:scale-110', p.accent)}>
                        <Icon className="size-6" />
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground transition-colors group-hover:bg-amber-500/15 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {p.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">{p.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* 4. DAILY RHYTHM GUIDE: A DAY WITH ANTAR YATRA */}
      <ScrollReveal direction="up" delay={60}>
        <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 md:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  {isHi ? 'दैनिक संगी' : 'Daily Routine Companion'}
                </span>
                <h2 className="mt-1 font-display text-2xl font-black text-foreground md:text-3xl">
                  {isHi ? 'एक दिन अंतर यात्रा के साथ' : 'How Antar Yatra Fits into Your Day'}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {isHi
                    ? 'सुबह से रात तक, आपकी दिनचर्या के हर मोड़ पर एक शांत, सकारात्मक साथी।'
                    : 'From morning clarity to restorative night sleep, a calming companion for every hour.'}
                </p>
              </div>

              {/* Routine Select Buttons */}
              <div className="flex flex-wrap gap-2">
                {routines.map((r, idx) => {
                  const Icon = r.icon
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveRoutine(idx)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer',
                        activeRoutine === idx
                          ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      <Icon className="size-3.5" />
                      <span>{r.time}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Routine Showcase */}
            <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-center">
              <div className="flex flex-col gap-3 md:col-span-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="size-3.5" />
                  {routines[activeRoutine].time}
                </span>
                <h3 className="font-display text-2xl font-black text-foreground">
                  {routines[activeRoutine].name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {routines[activeRoutine].desc}
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Volume2 className="size-4 shrink-0" />
                  <span>{routines[activeRoutine].recommend}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-background/80 p-6 text-center md:col-span-4 shadow-sm">
                <div className="grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/10">
                  {(() => {
                    const Icon = routines[activeRoutine].icon
                    return <Icon className="size-8" />
                  })()}
                </div>
                <p className="mt-4 text-xs font-bold text-foreground">
                  {isHi ? 'रोज़ाना केवल 10-15 मिनट' : 'Just 10-15 Minutes Daily'}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isHi ? 'जीवन में स्थाई शांति व एकाग्रता' : 'Cultivates lasting clarity & peace'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. FEATURED EPISODES & INTERACTIVE AUDIO PREVIEW */}
      <section id="featured-episodes" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black tracking-wide text-amber-600 dark:text-amber-400 uppercase">
              <Sparkles className="size-3.5" />
              {isHi ? 'एक्सक्लूसिव पॉडकास्ट लाइब्रेरी' : 'Exclusive Podcast Library'}
            </div>
            <h2 className="mt-2 font-display text-3xl font-black text-foreground md:text-4xl">
              {isHi ? 'अंतर यात्रा के ख़ास अंक' : 'Antar Yatra Signature Episodes'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isHi
                ? 'हर एपिसोड के साथ मुफ़्त प्रीव्यू उपलब्ध है। क्लिक करें और तुरंत सुनें।'
                : 'Every premium episode includes a free audio preview. Click below to experience it.'}
            </p>
          </div>

          <span className="text-xs font-bold text-muted-foreground">
            {episodes.length} {isHi ? 'प्रीमियम एपिसोड्स' : 'Premium Episodes'}
          </span>
        </div>

        {/* Episode List with Direct Audio Play Action */}
        <div className="grid gap-6 md:grid-cols-2">
          {episodes.map((ep, idx) => {
            const isThisPlaying = currentTrack?.id === ep.id && isPlaying
            const isThisCurrent = currentTrack?.id === ep.id

            return (
              <ScrollReveal key={ep.id} delay={idx * 140} direction="up">
                <div
                  className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-amber-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/15 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Image with Lock Overlay */}
                    <Link
                      href={localePath(locale, `/antar-yatra/${ep.slug}`)}
                      className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md group-hover:scale-105 transition-transform"
                    >
                      <Image
                        src={ep.image || '/placeholder.svg'}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 grid place-items-center bg-stone-950/40">
                        <Lock className="size-5 text-amber-300" />
                      </div>
                    </Link>

                    {/* Title & Metadata */}
                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase">
                          {isHi ? 'प्रीमियम • प्रीव्यू' : 'Premium • Preview'}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {ep.durationMin} {isHi ? 'मिनट' : 'mins'}
                        </span>
                      </div>

                      <Link
                        href={localePath(locale, `/antar-yatra/${ep.slug}`)}
                        className="font-display text-base font-bold text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400 line-clamp-2"
                      >
                        {ep.title[locale]}
                      </Link>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ep.show[locale]} · {isHi ? 'गहन आध्यात्मिक चिंतन व ध्यान' : 'Deep spiritual storytelling & meditation'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Preview Action & Link */}
                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isThisCurrent) {
                          togglePlay()
                        } else {
                          playTrack(ep)
                        }
                      }}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm',
                        isThisPlaying
                          ? 'bg-amber-500 text-stone-950 shadow-amber-500/30 ring-2 ring-amber-500/50'
                          : 'border border-amber-500/50 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-stone-950 dark:text-amber-300'
                      )}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="size-3.5 fill-current" />
                          <span>{isHi ? 'रोकें (Pause)' : 'Pause Preview'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="size-3.5 fill-current" />
                          <span>{isHi ? 'प्रीव्यू सुनें (Listen)' : 'Play Free Preview'}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={localePath(locale, `/antar-yatra/${ep.slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      <span>{isHi ? 'पूरा विवरण' : 'Full Episode'}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* 6. FOUNDER'S LETTER: A NOTE FROM CORNER KONA */}
      <ScrollReveal direction="up" delay={50}>
        <section className="mx-auto w-full max-w-4xl px-4 md:px-6">
          <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-8 md:p-12 shadow-md">
            <Quote className="size-10 text-amber-500/40" />
            <h3 className="mt-4 font-display text-2xl font-black text-foreground md:text-3xl">
              {isHi ? 'संपादक की क़लम से: अंतर यात्रा का संकल्प' : 'A Note From Our Editorial Desk'}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                {isHi
                  ? '“जब हमने कॉर्नर कोना की शुरुआत की, तो हमारा मक़सद केवल ताज़ा ख़बरें या मनोरंजन देना नहीं था। हम चाहते थे कि इस डिजिटल शोरगुल में एक ऐसा कोना भी हो, जहाँ इंसान बिना किसी हड़बड़ी के बैठ सके, अपनी आत्मा की आवाज़ सुन सके, और प्राचीन भारतीय दर्शन की रोशनी में अपने उलझे सवालों के जवाब पा सके।”'
                  : '“When we envisioned Corner Kona, we committed to building more than another digital media portal. We wanted to carve out a genuine sanctuary—a corner where one can sit without hurry, listen to the whisper of the soul, and find grounding clarity in the light of timeless Indian wisdom.”'}
              </p>
              <p>
                {isHi
                  ? '“अंतर यात्रा किसी कर्मकांड का नाम नहीं है। यह अपने भीतर उतरने, सांसों को महसूस करने और हर दिन को शांति और शक्ति के साथ जीने का नाम है। इस यात्रा में आपका स्वागत है।”'
                  : '“Antar Yatra is not about rituals or dogmas. It is about descending into stillness, breathing deeply, and greeting every morning with calm resilience. Welcome to the journey.”'}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              <div className="grid size-10 place-items-center rounded-full bg-amber-500 text-stone-950 font-bold text-sm">
                CK
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {isHi ? 'कॉर्नर कोना सम्पादकीय दल' : 'Corner Kona Editorial Collective'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isHi ? 'अंतर यात्रा एवं आध्यात्मिक पहल' : 'Antar Yatra Spiritual Initiative'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. SEEKERS' VOICES / COMMUNITY TESTIMONIALS */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
            {isHi ? 'श्रोताओं के अनुभव' : 'Seeker Stories'}
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-foreground md:text-4xl">
            {isHi ? 'जिन्होंने महसूस की भीतर की शांति' : 'Reflections from Our Patron Community'}
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            {isHi
              ? 'जानिए कैसे रोज़ाना 15 मिनट की अंतर यात्रा ने हज़ारों युवाओं के जीवन को बदल दिया।'
              : 'Discover how 15 minutes of daily contemplation is transforming mornings and sleep routines.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={idx} delay={idx * 110} direction="up">
              <div
                className="flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                    {t.tag}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-foreground italic">
                    {t.quote}
                  </p>
                </div>
                <div className="mt-6 border-t border-border/50 pt-3">
                  <p className="text-sm font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. 3D ROTATING FAQ CARDS ON SCROLL */}
      <section className="mx-auto w-full">
        <FaqRotatingCards locale={locale} />
      </section>
    </div>
  )
}
