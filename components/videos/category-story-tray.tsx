'use client'

import Image from 'next/image'
import type { Category, CategoryKey, Short } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n'
import { brand } from '@/config/brand'
import { cn } from '@/lib/utils'

interface CategoryStoryTrayProps {
  locale: Locale
  categories: Category[]
  shorts: Short[]
  activeCategoryKey?: CategoryKey
  onSelectCategory?: (key: CategoryKey) => void
  className?: string
}

export function CategoryStoryTray({
  locale,
  categories,
  shorts,
  activeCategoryKey,
  onSelectCategory,
  className,
}: CategoryStoryTrayProps) {
  // Only show categories that have at least one short
  const categoriesWithShorts = categories.filter((cat) =>
    shorts.some((s) => s.category === cat.key),
  )

  if (categoriesWithShorts.length === 0) return null

  return (
    <div className={cn('w-full overflow-hidden py-3', className)}>
      <div className="flex items-center gap-4 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar sm:gap-6 md:px-0">
        {categoriesWithShorts.map((category) => {
          const categoryShorts = shorts.filter((s) => s.category === category.key)
          const isActive = activeCategoryKey === category.key
          const previewImage = categoryShorts[0]?.image || category.image || '/images/hero-podcast.png'
          const brandColor = (brand.sections as Record<string, string>)[category.key] || '#9333EA'

          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onSelectCategory?.(category.key)}
              className={cn(
                'group flex flex-col items-center gap-2 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive ? 'scale-105' : 'hover:scale-105 active:scale-95',
              )}
              aria-label={`${category.name[locale]} (${categoryShorts.length} ${locale === 'hi' ? 'शॉर्ट्स' : 'shorts'})`}
            >
              {/* Instagram Story Gradient Ring */}
              <div
                className={cn(
                  'relative flex size-18 sm:size-20 items-center justify-center rounded-full p-[3px] transition-all duration-300',
                  isActive
                    ? 'ring-4 ring-offset-2 ring-offset-background shadow-lg shadow-purple-500/30'
                    : 'group-hover:shadow-md group-hover:shadow-purple-500/20',
                )}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${brandColor}, #EC4899, #F59E0B)`
                    : 'linear-gradient(135deg, #F59E0B, #EC4899, #9333EA, #3B82F6)',
                  boxShadow: isActive ? `0 0 16px ${brandColor}80` : undefined,
                }}
              >
                {/* White / Dark Gap Ring like Instagram */}
                <div className="relative size-full overflow-hidden rounded-full border-2 border-background bg-ink">
                  <Image
                    src={previewImage}
                    alt={category.name[locale]}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category count indicator badge */}
                  <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/80 text-[10px] font-black text-white shadow-sm ring-1 ring-white/30 backdrop-blur-sm">
                    {categoryShorts.length}
                  </span>
                </div>
              </div>

              {/* Category Name Label */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'max-w-[76px] truncate text-center text-xs font-bold leading-tight transition-colors sm:max-w-[88px]',
                    isActive ? 'text-primary font-black' : 'text-foreground/90 group-hover:text-foreground',
                  )}
                >
                  {category.name[locale]}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {categoryShorts.length} {locale === 'hi' ? 'वीडियो' : 'clips'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
