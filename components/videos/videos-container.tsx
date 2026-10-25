'use client'

import React, { useState } from 'react'
import type { Category, CategoryKey, Short } from '@/lib/content/types'
import { getDictionary, type Locale } from '@/lib/i18n'
import { CategoryStoryTray } from './category-story-tray'
import { InstagramStoryViewer } from './instagram-story-viewer'
import { ShortCard } from '@/components/home/short-card'
import { Sparkles, Grid, Film, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideosContainerProps {
  locale: Locale
  categories: Category[]
  shorts: Short[]
  initialCategoryKey?: CategoryKey
}

export function VideosContainer({
  locale,
  categories,
  shorts,
  initialCategoryKey = 'sports',
}: VideosContainerProps) {
  const t = getDictionary(locale)
  const [activeCategoryKey, setActiveCategoryKey] = useState<CategoryKey>(initialCategoryKey)
  const [activeShortSlug, setActiveShortSlug] = useState<string | undefined>(undefined)
  const [viewMode, setViewMode] = useState<'story' | 'grid'>('story')

  const handleSelectCategory = (catKey: CategoryKey) => {
    setActiveCategoryKey(catKey)
    const firstShortOfCat = shorts.find((s) => s.category === catKey)
    if (firstShortOfCat) {
      setActiveShortSlug(firstShortOfCat.slug)
    }
  }

  const handleOpenShortInStory = (short: Short) => {
    setActiveCategoryKey(short.category)
    setActiveShortSlug(short.slug)
    setViewMode('story')
    // Scroll smoothly to top of player
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Instagram Stories Top Tray (Category Profile Bubbles) */}
      <div className="rounded-3xl border border-white/10 bg-card/60 p-4 shadow-xl backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
              {locale === 'hi' ? 'कैटेगरी स्टोरीज़ • चुनिंदा वीडियो' : 'Category Stories • Curated Shorts'}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {locale === 'hi' ? 'टैप करें और स्टोरी देखें' : 'Tap any category to watch stories'}
          </span>
        </div>

        <CategoryStoryTray
          locale={locale}
          categories={categories}
          shorts={shorts}
          activeCategoryKey={activeCategoryKey}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* 2. Mode Selector: Story Mode (Instagram Experience) vs Grid Catalog */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-muted/80 p-1 ring-1 ring-border">
            <button
              type="button"
              onClick={() => setViewMode('story')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                viewMode === 'story'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Film className="size-3.5" />
              <span>{locale === 'hi' ? 'इंस्टाग्राम स्टोरी प्लेयर' : 'Instagram Story Player'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Grid className="size-3.5" />
              <span>{locale === 'hi' ? 'ग्रिड व्यू' : 'All Shorts Grid'}</span>
            </button>
          </div>
        </div>

        {/* Live Help Hint Badge */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-bold text-foreground">👆 {locale === 'hi' ? 'टैप' : 'Tap'}:</span>{' '}
            {locale === 'hi' ? 'उसी कैटेगरी का अगला वीडियो' : 'Same Category'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="font-bold text-foreground">👈👉 {locale === 'hi' ? 'स्वाइप' : 'Swipe'}:</span>{' '}
            {locale === 'hi' ? 'अगली कैटेगरी' : 'Different Category'}
          </span>
        </div>
      </div>

      {/* 3. Main Display: Story Mode or Grid Mode */}
      {viewMode === 'story' ? (
        <div className="flex flex-col items-center justify-center py-4">
          <InstagramStoryViewer
            locale={locale}
            categories={categories}
            shorts={shorts}
            initialCategoryKey={activeCategoryKey}
            initialShortSlug={activeShortSlug}
          />
        </div>
      ) : (
        <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-2 sm:grid-cols-3 md:px-4 lg:grid-cols-5">
          {shorts.map((s) => (
            <li key={s.id} onClick={() => handleOpenShortInStory(s)} className="cursor-pointer">
              <ShortCard locale={locale} short={s} className="w-full sm:w-full" />
            </li>
          ))}
        </ul>
      )}

      {/* 4. Secondary Catalog Section: Discover More by Category */}
      {viewMode === 'story' && (
        <section className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-t border-border/50 pt-8">
            <h3 className="text-xl font-extrabold tracking-tight">
              {locale === 'hi' ? 'सभी शॉर्ट्स एक्सप्लोर करें' : 'Explore All Shorts'}
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {shorts.length} {locale === 'hi' ? 'वीडियो उपलब्ध' : 'videos available'}
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((s) => (
              <li key={s.id} onClick={() => handleOpenShortInStory(s)} className="cursor-pointer">
                <ShortCard locale={locale} short={s} className="w-full sm:w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
