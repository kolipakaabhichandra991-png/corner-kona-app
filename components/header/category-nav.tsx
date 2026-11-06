'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import type { Category } from '@/lib/content/types'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'

interface CategoryNavProps {
  locale: Locale
  categories: Category[]
}

const PRIMARY_KEYS = ['news', 'deshKiCharcha', 'genZ', 'entertainment', 'ckSpecial', 'gallery']

export function CategoryNav({ locale, categories }: CategoryNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const primaryCategories = categories.filter((c) => PRIMARY_KEYS.includes(c.key))
  const moreCategories = categories.filter((c) => !PRIMARY_KEYS.includes(c.key))

  return (
    <div className="hidden border-t border-border/40 bg-background/60 py-1.5 backdrop-blur-sm lg:block">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          {primaryCategories.map((cat) => {
            const hasChildren = Boolean(cat.children && cat.children.length > 0)
            const isOpen = activeDropdown === cat.key

            return (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => hasChildren && setActiveDropdown(cat.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center">
                  <Link
                    href={localePath(locale, `/${cat.slug}`)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                      isOpen && 'bg-muted',
                    )}
                  >
                    <span className={cn('size-2 rounded-full', sectionStyle[cat.key]?.bg || 'bg-primary')} />
                    <span>{cat.name[locale]}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={cn(
                          'size-3.5 text-muted-foreground transition-transform duration-200',
                          isOpen && 'rotate-180',
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </div>

                {hasChildren && isOpen && (
                  <div className="absolute top-full left-0 z-50 min-w-56 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-xl border bg-popover p-2 text-popover-foreground shadow-xl">
                      <div className="px-2.5 py-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        {cat.name[locale]}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {cat.children?.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={localePath(locale, `/${cat.slug}?sub=${sub.slug}`)}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                          >
                            <span>{sub.name[locale]}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* More / और... Menu */}
          {moreCategories.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  activeDropdown === 'more' && 'bg-muted text-foreground',
                )}
              >
                <span>{locale === 'hi' ? 'और...' : 'More...'}</span>
                <ChevronDown
                  className={cn(
                    'size-3.5 transition-transform duration-200',
                    activeDropdown === 'more' && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute top-full left-0 z-50 min-w-64 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-2 gap-1 rounded-xl border bg-popover p-2 text-popover-foreground shadow-xl">
                    {moreCategories.map((c) => (
                      <Link
                        key={c.key}
                        href={localePath(locale, `/${c.slug}`)}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2 rounded-lg p-2 text-xs font-semibold transition-colors hover:bg-muted"
                      >
                        <span className={cn('size-2 rounded-full shrink-0', sectionStyle[c.key]?.bg || 'bg-primary')} />
                        <span className="truncate">{c.name[locale]}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
