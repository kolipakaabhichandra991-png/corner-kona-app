'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react'
import type { Category, CategoryKey, Short } from '@/lib/content/types'
import { localePath, type Locale } from '@/lib/i18n'
import { brand } from '@/config/brand'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'

interface InstagramStoryViewerProps {
  locale: Locale
  categories: Category[]
  shorts: Short[]
  initialCategoryKey?: CategoryKey
  initialShortSlug?: string
  onClose?: () => void
  isModal?: boolean
  className?: string
}

interface FloatingReaction {
  id: number
  emoji: string
  x: number
  y: number
}

const STORY_DURATION_MS = 6500 // ~6.5 seconds per story slide
const TICK_INTERVAL_MS = 50

export function InstagramStoryViewer({
  locale,
  categories,
  shorts,
  initialCategoryKey,
  initialShortSlug,
  onClose,
  isModal = false,
  className,
}: InstagramStoryViewerProps) {
  // 1. Group shorts by category
  const categoriesWithShorts = categories.filter((cat) =>
    shorts.some((s) => s.category === cat.key),
  )

  const initialCatIndex = Math.max(
    0,
    categoriesWithShorts.findIndex(
      (c) =>
        c.key === initialCategoryKey ||
        (initialShortSlug && shorts.find((s) => s.slug === initialShortSlug)?.category === c.key),
    ),
  )

  const [categoryIndex, setCategoryIndex] = useState(initialCatIndex)
  const currentCategory = categoriesWithShorts[categoryIndex] || categoriesWithShorts[0]

  const currentCategoryShorts = shorts.filter((s) => s.category === currentCategory?.key)

  const initialSIndex = Math.max(
    0,
    currentCategoryShorts.findIndex((s) => s.slug === initialShortSlug),
  )

  const [shortIndex, setShortIndex] = useState(initialSIndex)
  const currentShort = currentCategoryShorts[shortIndex] || currentCategoryShorts[0]

  // Playback & progress state
  const [progress, setProgress] = useState(0) // 0 to 100
  const [isPaused, setIsPaused] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)
  const [reactions, setReactions] = useState<FloatingReaction[]>([])
  const [tapFeedback, setTapFeedback] = useState<'left' | 'right' | null>(null)
  const [categorySlideDirection, setCategorySlideDirection] = useState<'left' | 'right'>('right')

  // Swipe & Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const categoryColor = currentCategory
    ? (brand.sections as Record<string, string>)[currentCategory.key] || '#9333EA'
    : '#9333EA'
  const catStyle = currentCategory ? sectionStyle[currentCategory.key] : sectionStyle.sports

  // Safe navigation inside the SAME category (TAP behavior)
  const goToNextShort = useCallback(() => {
    setProgress(0)
    setTapFeedback('right')
    setTimeout(() => setTapFeedback(null), 300)

    if (shortIndex < currentCategoryShorts.length - 1) {
      setShortIndex((prev) => prev + 1)
    } else {
      // Reached the end of this category's shorts -> advance to NEXT CATEGORY!
      if (categoryIndex < categoriesWithShorts.length - 1) {
        setCategorySlideDirection('right')
        setCategoryIndex((prev) => prev + 1)
        setShortIndex(0)
      } else {
        // Loop back to first category
        setCategorySlideDirection('right')
        setCategoryIndex(0)
        setShortIndex(0)
      }
    }
  }, [shortIndex, currentCategoryShorts.length, categoryIndex, categoriesWithShorts.length])

  const goToPrevShort = useCallback(() => {
    setProgress(0)
    setTapFeedback('left')
    setTimeout(() => setTapFeedback(null), 300)

    if (shortIndex > 0) {
      setShortIndex((prev) => prev - 1)
    } else {
      // At the start of this category's shorts -> go to PREVIOUS CATEGORY's last short!
      if (categoryIndex > 0) {
        setCategorySlideDirection('left')
        const prevCatShorts = shorts.filter(
          (s) => s.category === categoriesWithShorts[categoryIndex - 1].key,
        )
        setCategoryIndex((prev) => prev - 1)
        setShortIndex(Math.max(0, prevCatShorts.length - 1))
      }
    }
  }, [shortIndex, categoryIndex, categoriesWithShorts, shorts])

  // Navigation BETWEEN CATEGORIES (SWIPE behavior)
  const goToNextCategory = useCallback(() => {
    setProgress(0)
    setCategorySlideDirection('right')
    if (categoryIndex < categoriesWithShorts.length - 1) {
      setCategoryIndex((prev) => prev + 1)
      setShortIndex(0)
    } else {
      // Loop back to start
      setCategoryIndex(0)
      setShortIndex(0)
    }
  }, [categoryIndex, categoriesWithShorts.length])

  const goToPrevCategory = useCallback(() => {
    setProgress(0)
    setCategorySlideDirection('left')
    if (categoryIndex > 0) {
      setCategoryIndex((prev) => prev - 1)
      setShortIndex(0)
    } else {
      // Loop to end
      setCategoryIndex(categoriesWithShorts.length - 1)
      setShortIndex(0)
    }
  }, [categoryIndex, categoriesWithShorts.length])

  const selectCategory = (newCatKey: CategoryKey) => {
    const idx = categoriesWithShorts.findIndex((c) => c.key === newCatKey)
    if (idx !== -1) {
      setCategorySlideDirection(idx > categoryIndex ? 'right' : 'left')
      setCategoryIndex(idx)
      setShortIndex(0)
      setProgress(0)
    }
  }

  // Timer loop for active short's progress bar
  useEffect(() => {
    if (isPaused || isHolding || !currentShort) return

    const step = (TICK_INTERVAL_MS / STORY_DURATION_MS) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          goToNextShort()
          return 0
        }
        return prev + step
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isPaused, isHolding, currentShort, goToNextShort])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextShort()
      } else if (e.key === 'ArrowLeft') {
        goToPrevShort()
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goToNextCategory()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        goToPrevCategory()
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        setIsPaused((p) => !p)
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((m) => !m)
      } else if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextShort, goToPrevShort, goToNextCategory, goToPrevCategory, onClose])

  // Handle Touch/Pointer Start
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    isDraggingRef.current = false
    setIsHolding(true)
  }

  // Handle Touch/Pointer Move (detect swipe across categories)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return

    const deltaX = e.clientX - touchStartRef.current.x
    const deltaY = e.clientY - touchStartRef.current.y

    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDraggingRef.current = true
      setDragOffset(deltaX)
    }
  }

  // Handle Touch/Pointer Up (distinguish between TAP vs SWIPE)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHolding(false)
    setDragOffset(0)

    if (!touchStartRef.current) return

    const deltaX = e.clientX - touchStartRef.current.x
    const deltaY = e.clientY - touchStartRef.current.y
    const elapsed = Date.now() - touchStartRef.current.time
    touchStartRef.current = null

    // Horizontal SWIPE detection (between categories)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -50) {
        // Swiped Left -> NEXT Category
        goToNextCategory()
      } else {
        // Swiped Right -> PREVIOUS Category
        goToPrevCategory()
      }
      return
    }

    // Quick TAP detection (within same category)
    if (elapsed < 300 && Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const clickX = e.clientX - rect.left
        const width = rect.width
        if (clickX < width * 0.35) {
          // Left tap -> Previous short of same category
          goToPrevShort()
        } else {
          // Right tap -> Next short of same category
          goToNextShort()
        }
      }
    }
  }

  // Add floating reaction emoji
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random()
    const x = 30 + Math.random() * 40 // percentage across
    const y = 80
    setReactions((prev) => [...prev, { id, emoji, x, y }])

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id))
    }, 1800)
  }

  const toggleLike = () => {
    if (!currentShort) return
    const liked = hasLiked[currentShort.id]
    setHasLiked((prev) => ({ ...prev, [currentShort.id]: !liked }))
    setLikes((prev) => ({
      ...prev,
      [currentShort.id]: (prev[currentShort.id] || 0) + (liked ? -1 : 1),
    }))
    if (!liked) {
      triggerReaction('❤️')
    }
  }

  const handleShare = async () => {
    if (!currentShort) return
    const url = `${window.location.origin}${localePath(locale, `/videos/${currentShort.slug}`)}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentShort.title[locale],
          url,
        })
        return
      } catch {
        // ignore share abort
      }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prevCategory =
    categoriesWithShorts[(categoryIndex - 1 + categoriesWithShorts.length) % categoriesWithShorts.length]
  const nextCategory = categoriesWithShorts[(categoryIndex + 1) % categoriesWithShorts.length]

  if (!currentCategory || !currentShort) return null

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center select-none',
        isModal && 'fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-2 sm:p-4',
        className,
      )}
    >
      {/* Category Navigation Pills at top (Quick Category Jumper) */}
      <div className="mb-3 flex max-w-full items-center gap-1.5 overflow-x-auto px-2 py-1 no-scrollbar md:gap-2">
        {categoriesWithShorts.map((cat, idx) => {
          const isSelected = idx === categoryIndex
          const pillColor = (brand.sections as Record<string, string>)[cat.key] || '#9333EA'
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectCategory(cat.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 whitespace-nowrap',
                isSelected
                  ? 'bg-white text-black shadow-lg scale-105 ring-2'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white',
              )}
              style={{
                ringColor: isSelected ? pillColor : undefined,
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: pillColor }}
              />
              {cat.name[locale]}
            </button>
          )
        })}
      </div>

      {/* Main Story Arena: Left Desktop Control + Center Story Card + Right Desktop Control */}
      <div className="relative flex w-full max-w-4xl items-center justify-center gap-4 md:gap-8">
        {/* Desktop Left Button: Previous Category Card */}
        <button
          type="button"
          onClick={goToPrevCategory}
          className="hidden md:flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none"
          title={`Previous Category: ${prevCategory.name[locale]}`}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white shadow-xl backdrop-blur-md border border-white/15 transition-all group-hover:bg-white/20 group-hover:border-white/30 group-hover:shadow-purple-500/30">
            <ChevronLeft className="size-6 -translate-x-0.5" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              {locale === 'hi' ? 'पिछली कैटेगरी' : 'Prev Category'}
            </span>
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors max-w-[100px] truncate">
              {prevCategory.name[locale]}
            </span>
          </div>
        </button>

        {/* Center Vertical Story Card (9:16 Aspect Ratio) */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative aspect-[9/16] w-full max-w-[390px] sm:max-w-[420px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/15 touch-none cursor-pointer"
          style={{
            boxShadow: `0 0 50px -10px ${categoryColor}60, 0 25px 50px -12px rgba(0, 0, 0, 0.85)`,
            transform: dragOffset !== 0 ? `translateX(${dragOffset * 0.4}px) rotate(${dragOffset * 0.02}deg)` : undefined,
            transition: dragOffset === 0 ? 'transform 0.25s ease-out' : 'none',
          }}
        >
          {/* Background Image / Video Stage with subtle motion */}
          <div className="relative size-full overflow-hidden bg-zinc-950">
            <Image
              key={currentShort.id}
              src={currentShort.image || '/placeholder.svg'}
              alt={currentShort.title[locale]}
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              priority
              className={cn(
                'object-cover transition-transform duration-700 ease-out',
                !isPaused && !isHolding && 'scale-105',
              )}
            />

            {/* Gradient Scrims for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

            {/* Tap Visual Feedback Waves */}
            {tapFeedback === 'left' && (
              <div className="absolute inset-y-0 left-0 w-1/3 bg-white/15 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-75 duration-200">
                <div className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                  <ArrowLeft className="size-6" />
                </div>
              </div>
            )}
            {tapFeedback === 'right' && (
              <div className="absolute inset-y-0 right-0 w-1/3 bg-white/15 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-75 duration-200">
                <div className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                  <ArrowRight className="size-6" />
                </div>
              </div>
            )}

            {/* Hold to Pause Indicator */}
            {isHolding && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                <div className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md border border-white/20 animate-in fade-in zoom-in-95">
                  <Pause className="size-3.5 fill-white" />
                  <span>{locale === 'hi' ? 'रुक गया' : 'PAUSED'}</span>
                </div>
              </div>
            )}

            {/* Animated Equalizer Waves (Simulated Audio) */}
            {!isMuted && !isPaused && !isHolding && (
              <div className="absolute bottom-28 right-4 flex items-end gap-1 z-20 pointer-events-none opacity-80">
                <span className="w-1 bg-white rounded-full animate-bounce h-4" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-6" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-3" style={{ animationDelay: '300ms' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-5" style={{ animationDelay: '450ms' }} />
              </div>
            )}

            {/* Floating Heart / Reaction Particles */}
            {reactions.map((r) => (
              <div
                key={r.id}
                className="absolute text-3xl pointer-events-none z-40 animate-bounce"
                style={{
                  left: `${r.x}%`,
                  bottom: '15%',
                  animation: 'floatUp 1.8s ease-out forwards',
                }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Top Overlay: Segmented Progress Bars & Profile Header */}
          <div className="absolute inset-x-0 top-0 z-30 p-3 pt-3.5 flex flex-col gap-2.5">
            {/* Segmented Progress Bars (Instagram Stories exact replica) */}
            <div className="flex w-full items-center gap-1.5">
              {currentCategoryShorts.map((s, idx) => {
                let fillPercent = 0
                if (idx < shortIndex) fillPercent = 100
                else if (idx === shortIndex) fillPercent = progress
                else fillPercent = 0

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShortIndex(idx)
                      setProgress(0)
                    }}
                    className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/25 backdrop-blur-sm transition-all focus:outline-none"
                    aria-label={`Go to clip ${idx + 1}`}
                  >
                    <div
                      className="h-full bg-white rounded-full transition-[width] ease-linear duration-75"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </button>
                )
              })}
            </div>

            {/* Header: Category Avatar, Category Name, Story Index, Sound & Controls */}
            <div className="flex items-center justify-between">
              {/* Profile Avatar & Category Info */}
              <div className="flex items-center gap-2.5">
                <div
                  className="relative flex size-9 items-center justify-center rounded-full p-[2px] shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}, #EC4899, #F59E0B)`,
                  }}
                >
                  <div className="relative size-full overflow-hidden rounded-full border border-black bg-black">
                    <Image
                      src={currentCategory.image || currentShort.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white tracking-wide drop-shadow">
                      {currentCategory.name[locale]}
                    </span>
                    <span
                      className="rounded-full px-1.5 py-0.2 text-[9px] font-black uppercase text-white shadow-sm"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {shortIndex + 1}/{currentCategoryShorts.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/75 drop-shadow">
                    {`0:${String(currentShort.durationSec).padStart(2, '0')}`} · {currentShort.views}{' '}
                    {locale === 'hi' ? 'व्यूज' : 'views'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Sound, Play/Pause, Close */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMuted((m) => !m)
                  }}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPaused((p) => !p)
                  }}
                  className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors"
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="size-3.5 fill-white" /> : <Pause className="size-3.5" />}
                </button>

                {onClose && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose()
                    }}
                    className="flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors"
                    aria-label="Close stories"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Overlay: Title, Interaction Tray, Reaction Emojis & Category Hints */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-4 pt-12 flex flex-col gap-3 pointer-events-auto">
            {/* Short Title & Category Badge */}
            <div className="flex flex-col gap-1.5">
              <span
                className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {currentCategory.name[locale]}
              </span>
              <h2 className="text-base sm:text-lg font-bold leading-snug text-white drop-shadow-md line-clamp-2">
                {currentShort.title[locale]}
              </h2>
            </div>

            {/* Quick Emoji Reaction Bar (Instagram Stories style) */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {['🔥', '❤️', '😂', '👏', '⚡'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      triggerReaction(emoji)
                    }}
                    className="flex size-8 items-center justify-center rounded-full bg-white/15 text-lg backdrop-blur-sm transition-transform hover:scale-125 active:scale-95 hover:bg-white/25"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Like & Share Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike()
                  }}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-transform active:scale-90',
                    hasLiked[currentShort.id]
                      ? 'bg-rose-600 text-white scale-110 shadow-lg shadow-rose-600/50'
                      : 'bg-white/15 text-white hover:bg-white/25',
                  )}
                  aria-label="Like short"
                >
                  <Heart
                    className={cn('size-4', hasLiked[currentShort.id] && 'fill-current')}
                  />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="flex size-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white/25"
                  aria-label="Share short"
                >
                  {copied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4" />}
                </button>
              </div>
            </div>

            {/* Visual Instruction Badge for User */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-white/70 px-1 pt-1">
              <span className="flex items-center gap-1">
                <span>👆</span>
                <span>{locale === 'hi' ? 'टैप: अगला वीडियो' : 'Tap: Next Video'}</span>
              </span>
              <span className="flex items-center gap-1 text-white/80">
                <span>👈👉</span>
                <span>{locale === 'hi' ? 'स्वाइप: दूसरी कैटेगरी' : 'Swipe: Next Category'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Right Button: Next Category Card */}
        <button
          type="button"
          onClick={goToNextCategory}
          className="hidden md:flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none"
          title={`Next Category: ${nextCategory.name[locale]}`}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white shadow-xl backdrop-blur-md border border-white/15 transition-all group-hover:bg-white/20 group-hover:border-white/30 group-hover:shadow-purple-500/30">
            <ChevronRight className="size-6 translate-x-0.5" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              {locale === 'hi' ? 'अगली कैटेगरी' : 'Next Category'}
            </span>
            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors max-w-[100px] truncate">
              {nextCategory.name[locale]}
            </span>
          </div>
        </button>
      </div>

      {/* Floating Share Copied Notification */}
      {copied && (
        <div className="fixed bottom-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <Check className="size-4" />
          <span>{locale === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!'}</span>
        </div>
      )}
    </div>
  )
}
