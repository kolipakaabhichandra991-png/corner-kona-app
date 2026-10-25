'use client'

import React, { useState } from 'react'
import type { Category, CategoryKey, Short } from '@/lib/content/types'
import { localePath, type Locale } from '@/lib/i18n'
import { SectionHeading } from './section-heading'
import { CategoryStoryTray } from '@/components/videos/category-story-tray'
import { InstagramStoryViewer } from '@/components/videos/instagram-story-viewer'
import { Carousel } from './carousel'
import { ShortCard } from './short-card'
import { Sparkles, Play } from 'lucide-react'

interface ShortsSectionProps {
  locale: Locale
  t: any
  categories: Category[]
  shorts: Short[]
}

export function ShortsSection({ locale, t, categories, shorts }: ShortsSectionProps) {
  const [modalCategory, setModalCategory] = useState<CategoryKey | null>(null)
  const [modalSlug, setModalSlug] = useState<string | null>(null)

  const handleOpenCategoryStory = (categoryKey: CategoryKey) => {
    setModalCategory(categoryKey)
    const firstOfCat = shorts.find((s) => s.category === categoryKey)
    setModalSlug(firstOfCat?.slug ?? null)
  }

  const handleCloseModal = () => {
    setModalCategory(null)
    setModalSlug(null)
  }

  return (
    <section aria-labelledby="shorts-h" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <SectionHeading
          id="shorts-h"
          title={t.home.shorts}
          sub={locale === 'hi' ? 'इंस्टाग्राम स्टोरीज़: टैप करें (सेम कैटेगरी), स्वाइप करें (अलग कैटेगरी)' : 'Instagram Stories: Tap inside category, swipe between categories'}
          href={localePath(locale, '/videos')}
        />
      </div>

      {/* Instagram Story Circles Bar (Category Avatars) */}
      <div className="rounded-2xl border border-white/10 bg-card/40 p-3 shadow-lg backdrop-blur-md">
        <CategoryStoryTray
          locale={locale}
          categories={categories}
          shorts={shorts}
          onSelectCategory={handleOpenCategoryStory}
        />
      </div>

      {/* Horizontal Carousel of Shorts */}
      <Carousel label={t.home.shorts} prev={t.home.prev} next={t.home.next}>
        {shorts.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              setModalCategory(s.category)
              setModalSlug(s.slug)
            }}
            className="cursor-pointer"
          >
            <ShortCard locale={locale} short={s} />
          </div>
        ))}
      </Carousel>

      {/* Fullscreen Instagram Story Modal Viewer when tapped on Home */}
      {modalCategory && (
        <InstagramStoryViewer
          locale={locale}
          categories={categories}
          shorts={shorts}
          initialCategoryKey={modalCategory}
          initialShortSlug={modalSlug ?? undefined}
          isModal
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}
