'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Sparkles,
  ShieldCheck,
  Headphones,
  BookOpen,
  Heart,
  Leaf,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  HelpCircle,
  Quote,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface FaqItem {
  id: number
  icon: typeof Sparkles
  badge: { hi: string; en: string }
  question: { hi: string; en: string }
  answer: { hi: string; en: string }
  tag: { hi: string; en: string }
  gradient: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    icon: Sparkles,
    badge: { hi: 'मूल संकल्पना', en: 'Core Essence' },
    question: {
      hi: 'अंतर यात्रा असल में क्या है और यह क्यों बनाई गई?',
      en: 'What exactly is Antar Yatra & why was it created?',
    },
    answer: {
      hi: 'अंतर यात्रा कॉर्नर कोना का एक विशेष आंतरिक शांति, ध्यान और आध्यात्मिक चिंतन का अनुभव है। सामान्य पॉडकास्ट के शोरगुल से अलग, यह 100% विज्ञापन-मुक्त संसार है जहाँ प्राचीन वैदिक दर्शन, गीता और कबीर के सूत्रों को आज के युवाओं के तनाव और मानसिक शांति के लिए ढाला गया है।',
      en: 'Antar Yatra is Corner Kona’s dedicated sanctuary for stillness, contemplation, and mindful living. Unlike noisy conventional podcasts, this is a 100% ad-free space bridging ancient Vedic wisdom and Gita psychology with the mental health needs of modern youth.',
    },
    tag: { hi: 'परिकल्पना', en: 'Manifesto' },
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 2,
    icon: Leaf,
    badge: { hi: 'सर्वसमावेशी दृष्टि', en: 'Open to All' },
    question: {
      hi: 'क्या इसके लिए किसी धार्मिक पृष्ठभूमि या ज्ञान की ज़रूरत है?',
      en: 'Do I need any religious or spiritual background?',
    },
    answer: {
      hi: 'बिल्कुल नहीं! अंतर यात्रा हर उस व्यक्ति के लिए है जो मानसिक तनाव, करियर की उलझनों और मन की शांति का समाधान चाहता है। हमारा दृष्टिकोण पूर्णतः मनोवैज्ञानिक, व्यावहारिक और जीवन जीने की कला पर आधारित है।',
      en: 'Not at all! Antar Yatra is open to every seeker looking to calm overthinking, release career fatigue, and reconnect with inner stillness. Our approach is psychological, rational, and centered on the art of living.',
    },
    tag: { hi: 'सहजता', en: 'Accessibility' },
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    icon: ShieldCheck,
    badge: { hi: 'पवित्रता व अखंडता', en: 'Pure Sanctity' },
    question: {
      hi: 'अंतर यात्रा को 100% विज्ञापन-मुक्त (Zero Ads) क्यों रखा गया है?',
      en: 'Why is Antar Yatra strictly 100% Ad-Free?',
    },
    answer: {
      hi: 'ध्यान, मौन और प्रार्थना के पवित्र क्षणों में किसी कमर्शियल विज्ञापन का अचानक बजना साधना को भंग कर देता है। इस पावन अनुभव की रक्षा के लिए यह सेक्शन विशुद्ध रूप से हमारे संरक्षक पाठकों (Patrons) के छोटे से सहयोग से चलता है।',
      en: 'Quiet contemplation, sacred chants, and meditation should never be broken by jarring commercial interruptions. To protect this uninterrupted sanctuary, Antar Yatra is sustained purely by our circle of patron supporters.',
    },
    tag: { hi: 'पवित्रता', en: 'Zero Ads' },
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: 4,
    icon: Headphones,
    badge: { hi: 'मुफ़्त प्रीव्यू', en: 'Free Listening' },
    question: {
      hi: 'क्या मैं एपिसोड्स को मुफ़्त में सुन सकता हूँ?',
      en: 'Can I listen to episodes for free?',
    },
    answer: {
      hi: 'हाँ! हर प्रीमियम एपिसोड का एक उच्च-गुणवत्ता वाला मुफ़्त प्रीव्यू सीधे वेबसाइट पर उपलब्ध है जिसे आप तुरंत सुन सकते हैं। इसके अतिरिक्त, फ्री टीयर में वीकली हाइलाइट्स और खुले चयनित एपिसोड्स हमेशा उपलब्ध रहते हैं।',
      en: 'Yes! Every premium episode includes an instant, high-quality audio preview available right on the page without sign-up. Furthermore, our free tier gives you weekly highlight digests and select unlocked episodes.',
    },
    tag: { hi: 'निःशुल्क प्रीव्यू', en: 'Free Preview' },
    gradient: 'from-amber-600 to-yellow-600',
  },
  {
    id: 5,
    icon: BookOpen,
    badge: { hi: 'द्विभाषी अनुवाद', en: 'Bilingual Sync' },
    question: {
      hi: 'द्विभाषी लिरिक्स और संस्कृत सूत्र कैसे काम करते हैं?',
      en: 'How do bilingual transcripts and Sanskrit shlokas work?',
    },
    answer: {
      hi: 'हर ऑडियो एपिसोड के साथ हिंदी और अंग्रेज़ी दोनों भाषाओं में रीयल-टाइम सिंक्रोनाइज़्ड ट्रांसक्रिप्ट मिलती है। कठिन संस्कृत श्लोकों का शब्दशः सरल अर्थ दिया गया है ताकि आप सुनते-सुनते उनके गूढ़ रहस्य को आसानी से आत्मसात कर सकें।',
      en: 'Every audio journey includes real-time synchronized transcripts in both Hindi and English. Ancient Sanskrit verses are paired with word-by-word contextual translations so you can read and understand while you listen.',
    },
    tag: { hi: 'ट्रांसक्रिप्ट', en: 'Transcripts' },
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 6,
    icon: Heart,
    badge: { hi: 'संरक्षक सदस्यता', en: 'Patron Access' },
    question: {
      hi: 'सदस्यता कैसे काम करती है और क्या मैं कभी भी रद्द कर सकता हूँ?',
      en: 'How does membership work & can I cancel anytime?',
    },
    answer: {
      hi: '₹199/माह या वार्षिक योजना के साथ आप एक क्लिक में संरक्षक बन सकते हैं। इसमें कोई लॉक-इन नहीं है; आप अपनी प्रोफ़ाइल से किसी भी समय एक क्लिक में अपनी सदस्यता को रोक, अपग्रेड या रद्द कर सकते हैं।',
      en: 'You can join the Patron Circle for ₹199/month or through our annual pass. There are zero contracts or lock-ins; you can upgrade, pause, or cancel your membership anytime with a single click from your profile.',
    },
    tag: { hi: 'संरक्षक मंडल', en: 'Flexibility' },
    gradient: 'from-rose-500 to-amber-500',
  },
]

// Stable rounding helpers to guarantee identical SSR and client string serialization
const r1 = (n: number) => Math.round(n * 10) / 10
const r2 = (n: number) => Math.round(n * 100) / 100

export function FaqRotatingCards({ locale }: { locale: Locale }) {
  const isHi = locale === 'hi'
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const [rotation, setRotation] = useState<number>(0)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const isDraggingRef = useRef<boolean>(false)
  const startXRef = useRef<number>(0)
  const currentRotRef = useRef<number>(0)

  const numItems = FAQ_ITEMS.length
  const angleStep = 360 / numItems

  // Scroll listener that updates rotation as user scrolls down the section
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Section is in scroll view
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalScrollableDistance = rect.height - windowHeight
      if (totalScrollableDistance <= 0) return

      const scrolledDistance = Math.max(0, -rect.top)
      const progress = Math.min(Math.max(scrolledDistance / totalScrollableDistance, 0), 1)

      // Rotate full 360 degrees as user scrolls through the sticky section
      const targetRotation = r1(progress * 360)
      setRotation(targetRotation)

      // Find the closest active index
      const normalizedAngle = (targetRotation % 360 + 360) % 360
      const activeIdx = Math.round(normalizedAngle / angleStep) % numItems
      setActiveIndex(activeIdx)
    }
  }, [angleStep, numItems])

  useEffect(() => {
    setMounted(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Mouse / Touch drag to interactively spin
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    currentRotRef.current = rotation
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const deltaX = e.clientX - startXRef.current
    const newRot = r1(currentRotRef.current + deltaX * 0.4)
    setRotation(newRot)
    const normalized = (newRot % 360 + 360) % 360
    setActiveIndex(Math.round(normalized / angleStep) % numItems)
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  // Navigate to specific card index
  const goToCard = (index: number) => {
    const targetRot = r1(index * angleStep)
    setRotation(targetRot)
    setActiveIndex(index)
  }

  const nextCard = () => {
    goToCard((activeIndex + 1) % numItems)
  }

  const prevCard = () => {
    goToCard((activeIndex - 1 + numItems) % numItems)
  }

  // Use 0 rotation during SSR until mounted on client to prevent hydration mismatch
  const effectiveRotation = mounted ? rotation : 0

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-[190vh] md:min-h-[220vh]"
      suppressHydrationWarning
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-16 md:top-20 h-[86vh] md:h-[90vh] flex flex-col justify-between overflow-hidden py-4 select-none">
        {/* Section Heading & Intro */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center px-4 z-30">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 backdrop-blur">
            <HelpCircle className="size-3.5" />
            <span>{isHi ? 'जिज्ञासा व समाधान' : 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="mt-2 font-display text-2xl font-black text-foreground sm:text-3xl md:text-4xl">
            {isHi ? (
              <>
                अंतर यात्रा के बारे में <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">सभी सवाल व जवाब</span>
              </>
            ) : (
              <>
                Everything You Want to Know About{' '}
                <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">Antar Yatra</span>
              </>
            )}
          </h2>

          <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
            {isHi
              ? 'स्क्रॉल करें या कार्ड्स को घुमाएँ (Scroll down or drag to rotate through questions)'
              : 'Scroll down to rotate cards smoothly through each question & answer'}
          </p>

          {/* Controls & Quick Selector Pills */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={prevCard}
              aria-label="Previous question"
              className="grid size-8 place-items-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur shadow-sm transition-all hover:bg-amber-500 hover:text-stone-950 active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Quick Indicator Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {FAQ_ITEMS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToCard(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    activeIndex === i
                      ? 'w-6 bg-amber-500'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  )}
                  aria-label={`Jump to question ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextCard}
              aria-label="Next question"
              className="grid size-8 place-items-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur shadow-sm transition-all hover:bg-amber-500 hover:text-stone-950 active:scale-90 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>

            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <RotateCw className="size-3 animate-spin [animation-duration:8s]" />
              <span>
                {activeIndex + 1} / {numItems}
              </span>
            </span>
          </div>
        </div>

        {/* 3D Rotating Cards Arena */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative mx-auto flex-1 w-full max-w-5xl flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1200px]"
          style={{ touchAction: 'pan-y' }}
          suppressHydrationWarning
        >
          {/* Ambient Glow in center */}
          <div className="absolute size-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

          {FAQ_ITEMS.map((item, index) => {
            // Angle of this card relative to current rotation
            const itemAngle = index * angleStep - effectiveRotation
            const rad = (itemAngle * Math.PI) / 180

            // Elliptical 3D positioning
            const cosVal = Math.cos(rad)
            const sinVal = Math.sin(rad)

            // Dynamic depth factor from 0 (back) to 1 (front)
            const depthFactor = (cosVal + 1) / 2

            // Coordinates in pixel space (stable rounded to prevent float diffs across SSR/client)
            const xOffset = r1(sinVal * 320)
            const yOffset = r1(-sinVal * 15)
            const zOffset = r1((cosVal - 1) * 220)
            const rotY = r1(-sinVal * 35)
            const rotZ = r1(sinVal * 3)

            const scale = r2(0.72 + depthFactor * 0.32)
            const opacity = r2(0.28 + depthFactor * 0.72)
            const zIndex = Math.round(depthFactor * 50) + 1
            const isCurrent = Math.abs(itemAngle % 360) < angleStep / 2

            const Icon = item.icon

            return (
              <div
                key={item.id}
                onClick={() => goToCard(index)}
                suppressHydrationWarning
                style={{
                  transform: `translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: isDraggingRef.current ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s',
                }}
                className={cn(
                  'absolute w-[19rem] sm:w-[22rem] md:w-[26rem] flex flex-col justify-between rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-shadow duration-300 cursor-pointer',
                  // Distinctive dark card styling matching the user screenshot
                  'bg-[#12141c]/95 text-stone-100 border',
                  isCurrent
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/25 shadow-2xl scale-100'
                    : 'border-white/10 hover:border-amber-400/50 shadow-black/60'
                )}
              >
                {/* Card Header: Avatar / Emblem + Title & Role (matching screenshot layout) */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      'grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-md text-white border border-white/20',
                      item.gradient
                    )}
                  >
                    <Icon className="size-6" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-300 border border-amber-500/30">
                        {item.badge[locale]}
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">
                        FAQ #{item.id}
                      </span>
                    </div>

                    <h3 className="mt-1 font-display text-base font-bold text-white sm:text-lg leading-snug line-clamp-2">
                      {item.question[locale]}
                    </h3>
                  </div>
                </div>

                {/* Quotation Icon decoration */}
                <div className="my-2.5 flex items-center gap-1.5 text-amber-400/50">
                  <Quote className="size-4 fill-amber-400/20" />
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 via-white/10 to-transparent" />
                </div>

                {/* Card Body: Context & Answer text */}
                <p className="text-xs sm:text-sm leading-relaxed text-stone-300 font-normal">
                  {item.answer[locale]}
                </p>

                {/* Card Footer: Category & Status */}
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
                  <span className="font-semibold text-amber-400/90">
                    {item.tag[locale]}
                  </span>

                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                      <Sparkles className="size-3" />
                      <span>{isHi ? 'सक्रिय • केंद्र में' : 'Active • In Focus'}</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 group-hover:text-stone-200">
                      {isHi ? 'क्लिक करें' : 'Click to bring front'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Scroll Helper Hint at the bottom */}
        <div className="mx-auto flex items-center gap-2 text-xs font-medium text-muted-foreground z-30 pb-2">
          <span>↓</span>
          <span>
            {isHi
              ? 'नीचे स्क्रॉल करते रहें — कार्ड्स अपने आप घूमते रहेंगे'
              : 'Keep scrolling down to rotate cards through the entire FAQ'}
          </span>
          <span>↓</span>
        </div>
      </div>
    </div>
  )
}
