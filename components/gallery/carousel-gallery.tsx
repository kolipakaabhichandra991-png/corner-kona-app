'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
  X,
  Share2,
  Heart,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface GallerySlide {
  image: string
  caption: Record<Locale, string>
  credit: string
  location?: string
}

export interface GalleryStory {
  id: string
  title: Record<Locale, string>
  category: Record<Locale, string>
  categoryColor: string
  slides: GallerySlide[]
}

const SAMPLE_GALLERIES: GalleryStory[] = [
  {
    id: 'gal-1',
    title: {
      hi: 'वाराणसी की सांध्य गंगा आरती: प्रकाश, आस्था और अनंत का संगम',
      en: 'Varanasi Dusk Aarti: A Visual Chronicle of Light, Devotion & Eternity',
    },
    category: {
      hi: 'आध्यात्म व संस्कृति',
      en: 'Spiritual & Heritage',
    },
    categoryColor: 'bg-amber-600 text-white',
    slides: [
      {
        image: '/images/bhakti-diya.png',
        caption: {
          hi: 'दशाश्वमेध घाट पर उठती पीतल के दीपकों की सुगंध और शंखध्वनि।',
          en: 'Brass lamps igniting the Dashashwamedh Ghat as twilight falls over the Ganges.',
        },
        credit: 'Photo: Corner Kona Visual Archives',
        location: 'Varanasi, India',
      },
      {
        image: '/images/short-aarti.png',
        caption: {
          hi: 'नदी की लहरों पर तैरते अनगिनत मिट्टी के दीये, जो मन को असीम शांति देते हैं।',
          en: 'Drifting earthen lamps mirroring constellations across the sacred currents.',
        },
        credit: 'Photo: Kabir Sharma',
        location: 'Assi Ghat',
      },
      {
        image: '/images/antar-yatra.png',
        caption: {
          hi: 'भीड़ के बीच भी एक आंतरिक मौन — अंतर यात्रा का दृश्य रूप।',
          en: 'A profound inner silence at the center of chanting multitudes.',
        },
        credit: 'Photo: Antar Yatra Visuals',
        location: 'Kashi Vishwanath Corridor',
      },
    ],
  },
  {
    id: 'gal-2',
    title: {
      hi: 'वैश्विक कूटनीति के बंद दरवाज़ों के पीछे: जब भारत ने तय किया दिशा-निर्देश',
      en: 'Behind Closed Summit Doors: When Global Agendas Were Shaped in New Delhi',
    },
    category: {
      hi: 'भू-राजनीति व सामरिक शक्ति',
      en: 'Geopolitics & Strategy',
    },
    categoryColor: 'bg-indigo-600 text-white',
    slides: [
      {
        image: '/images/geo-summit.png',
        caption: {
          hi: 'वैश्विक नेताओं की द्विपक्षीय वार्ता का वह दुर्लभ क्षण जहां नए आर्थिक गलियारों की नींव रखी गई।',
          en: 'The decisive plenary session where international corridors and energy pacts were forged.',
        },
        credit: 'Photo: Diplomatic Photo Pool',
        location: 'Bharat Mandapam',
      },
      {
        image: '/images/ent-film.png',
        caption: {
          hi: 'प्रतिनिधिमंडल के बीच अनौपचारिक संवाद — कूटनीति का मानवीय चेहरा।',
          en: 'Informal corridors where high-stakes geopolitical compromises take life.',
        },
        credit: 'Photo: Press Bureau',
        location: 'New Delhi',
      },
    ],
  },
  {
    id: 'gal-3',
    title: {
      hi: '22 गज़ की मिट्टी और खून-पसीना: भारतीय क्रिकेट की अनदेखी दास्तान',
      en: 'Red Clay & Raw Grit: The Unseen Crucible of Indian Domestic Cricket',
    },
    category: {
      hi: 'खेल व संघर्ष',
      en: 'Sports & Resilience',
    },
    categoryColor: 'bg-emerald-600 text-white',
    slides: [
      {
        image: '/images/sports-cricket.png',
        caption: {
          hi: 'धूल भरी पिचों पर सुबह 5 बजे से शुरू होती है राष्ट्रीय टीम तक पहुँचने की तपस्या।',
          en: '5 AM morning nets on Mumbai maidaans: where future champions face raw pace.',
        },
        credit: 'Photo: Sports Action Studio',
        location: 'Shivaji Park, Mumbai',
      },
      {
        image: '/images/short-kabaddi.png',
        caption: {
          hi: 'मिट्टी की सौंधी खुशबू और सांसों की लय — स्वदेशी खेलों की अदम्य ताक़त।',
          en: 'Sweat, breath control and unyielding contact on the rural akhada mat.',
        },
        credit: 'Photo: Arena Visuals',
        location: 'Haryana',
      },
    ],
  },
  {
    id: 'gal-4',
    title: {
      hi: 'भारतीय चाय की चौपालें: जहां देश की राजनीति और कविताएं जन्म लेती हैं',
      en: 'The Corner Chai Tapri: Where Politics, Poetry and Friendships Converge',
    },
    category: {
      hi: 'जीवन शैली व कोना संस्कृति',
      en: 'Culture & Daily Life',
    },
    categoryColor: 'bg-rose-600 text-white',
    slides: [
      {
        image: '/images/life-chai.png',
        caption: {
          hi: 'कुल्हड़ की गर्माहट और गरमा-गरम बहसों के बीच सुलगता भारत का असली मिज़ाज।',
          en: 'Earthen cups, brewing ginger, and the authentic pulse of grassroots discussions.',
        },
        credit: 'Photo: Daily Life Archive',
        location: 'Old Delhi',
      },
      {
        image: '/images/short-streetfood.png',
        caption: {
          hi: 'गलियों का स्वाद और रात के सन्नाटे में खिलखिलाती युवाओं की महफ़िल।',
          en: 'Vibrant night bazaars and late-night culinary tales shared among friends.',
        },
        credit: 'Photo: Street Chronicles',
        location: 'Chandni Chowk',
      },
    ],
  },
]

export function CarouselGallery({ locale }: { locale: Locale }) {
  const isHi = locale === 'hi'
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({})
  const [lightbox, setLightbox] = useState<{ storyIdx: number; slideIdx: number } | null>(null)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({})

  const currentStory = SAMPLE_GALLERIES[activeStoryIdx]
  const currentSlideIdx = slideIndices[currentStory.id] ?? 0

  const handleNextSlide = (storyId: string, totalSlides: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSlideIndices((prev) => {
      const cur = prev[storyId] ?? 0
      return { ...prev, [storyId]: (cur + 1) % totalSlides }
    })
  }

  const handlePrevSlide = (storyId: string, totalSlides: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSlideIndices((prev) => {
      const cur = prev[storyId] ?? 0
      return { ...prev, [storyId]: (cur - 1 + totalSlides) % totalSlides }
    })
  }

  const toggleLike = (storyId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setHasLiked((prev) => ({ ...prev, [storyId]: !prev[storyId] }))
    setLikes((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] ?? 128) + (hasLiked[storyId] ? -1 : 1),
    }))
  }

  return (
    <section aria-labelledby="carousel-gallery-h" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-rose-500 px-3 py-0.5 text-xs font-black tracking-wider text-white uppercase shadow-sm">
                <Camera className="size-3.5" aria-hidden="true" />
                {isHi ? 'विज़ुअल गैलरी' : 'PHOTO CAROUSEL'}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {isHi ? 'इंस्टाग्राम स्टाइल स्वाइप फ़ीचर' : 'Instagram-Style Story Carousels'}
              </span>
            </div>
            <h2 id="carousel-gallery-h" className="font-display text-2xl font-black tracking-tight sm:text-3xl md:text-4xl text-foreground">
              {isHi ? '📸 विज़ुअल स्टोरीज़: तस्वीरों में भारत' : '📸 Visual Chronicles: India in Frames'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {isHi
                ? 'पारंपरिक वर्टिकल स्क्रॉल से हटकर — हॉरिजॉन्टल स्वाइप, हाई-रेज़ोल्यूशन फ्रेम और प्रत्येक तस्वीर की अनकही कहानी।'
                : 'Moving beyond conventional feeds: smooth horizontal swipeable carousels capturing culture, geopolitics, and human moments.'}
            </p>
          </div>

          {/* Story Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_GALLERIES.map((gal, idx) => (
              <button
                key={gal.id}
                type="button"
                onClick={() => setActiveStoryIdx(idx)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer',
                  activeStoryIdx === idx
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {gal.category[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Main Carousel Display */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-black shadow-2xl">
          <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
            <Image
              src={currentStory.slides[currentSlideIdx].image}
              alt={currentStory.slides[currentSlideIdx].caption[locale]}
              fill
              priority
              className="object-cover transition-all duration-700 brightness-95"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40 pointer-events-none" />

            {/* Category Tag & Slide Counter */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className={cn('rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-lg', currentStory.categoryColor)}>
                {currentStory.category[locale]}
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white backdrop-blur-md border border-white/10 shadow-md">
                  <Layers className="size-3.5 text-amber-400" />
                  <span>
                    {currentSlideIdx + 1} / {currentStory.slides.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setLightbox({ storyIdx: activeStoryIdx, slideIdx: currentSlideIdx })}
                  className="grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition"
                  aria-label="Expand image"
                >
                  <Maximize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            {currentStory.slides.length > 1 && (
              <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => handlePrevSlide(currentStory.id, currentStory.slides.length, e)}
                  className="pointer-events-auto size-10 rounded-full bg-black/60 text-white hover:bg-white hover:text-black shadow-xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => handleNextSlide(currentStory.id, currentStory.slides.length, e)}
                  className="pointer-events-auto size-10 rounded-full bg-black/60 text-white hover:bg-white hover:text-black shadow-xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            )}

            {/* Bottom Caption and Dots */}
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col gap-3 text-white">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {currentStory.slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setSlideIndices((prev) => ({ ...prev, [currentStory.id]: dotIdx }))}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      currentSlideIdx === dotIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70',
                    )}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Story Title & Slide Caption */}
              <div>
                <h3 className="font-display text-xl font-bold md:text-2xl tracking-tight text-white line-clamp-1">
                  {currentStory.title[locale]}
                </h3>
                <p className="mt-1 text-sm md:text-base text-gray-200 line-clamp-2 leading-relaxed">
                  {currentStory.slides[currentSlideIdx].caption[locale]}
                </p>
              </div>

              {/* Credit & Location Meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span>{currentStory.slides[currentSlideIdx].credit}</span>
                  {currentStory.slides[currentSlideIdx].location && (
                    <span className="hidden sm:inline-block">📍 {currentStory.slides[currentSlideIdx].location}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => toggleLike(currentStory.id, e)}
                    className={cn(
                      'flex items-center gap-1 text-xs font-semibold transition hover:text-rose-400 cursor-pointer',
                      hasLiked[currentStory.id] && 'text-rose-500',
                    )}
                  >
                    <Heart className={cn('size-4', hasLiked[currentStory.id] && 'fill-rose-500')} />
                    <span>{(likes[currentStory.id] ?? 142).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: currentStory.title[locale], url: window.location.href })
                      }
                    }}
                    className="hover:text-white transition cursor-pointer"
                    aria-label="Share story"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel Row below main display */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLE_GALLERIES.map((gal, idx) => {
            const isActive = activeStoryIdx === idx
            return (
              <button
                key={gal.id}
                type="button"
                onClick={() => setActiveStoryIdx(idx)}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-2xl border bg-card p-2 text-left transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'border-primary ring-2 ring-primary/30 shadow-lg -translate-y-1'
                    : 'border-border/60 hover:border-primary/40 hover:-translate-y-0.5',
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={gal.slides[0].image}
                    alt={gal.title[locale]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-black text-white">
                    {gal.slides.length} photos
                  </span>
                </div>
                <h4 className="mt-2 line-clamp-2 text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {gal.title[locale]}
                </h4>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-5xl w-full flex flex-col items-center">
            <div className="relative aspect-[16/10] w-full max-h-[70vh]">
              <Image
                src={SAMPLE_GALLERIES[lightbox.storyIdx].slides[lightbox.slideIdx].image}
                alt="Fullscreen Preview"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-200 max-w-xl">
              {SAMPLE_GALLERIES[lightbox.storyIdx].slides[lightbox.slideIdx].caption[locale]}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
