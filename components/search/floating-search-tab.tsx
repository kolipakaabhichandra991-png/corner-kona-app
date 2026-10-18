'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Play, Sparkles, BookOpen, Film, ArrowRight, CornerDownLeft } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { episodes, stories, shorts, categories } from '@/lib/content/seed'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { useAudio } from '@/components/audio/audio-context'

interface FloatingSearchTabProps {
  locale: Locale
  t: Dictionary
}

export function FloatingSearchTab({ locale, t }: FloatingSearchTabProps) {
  const isHi = locale === 'hi'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { playTrack, currentTrack, isPlaying } = useAudio()

  // Handle outside click & escape key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    // Focus input on open
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 80)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      clearTimeout(timer)
    }
  }, [open])

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  // Filter content
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q && !activeCategory) return null

    const matchText = (text: string) => text.toLowerCase().includes(q)

    const filteredEpisodes = episodes.filter((ep) => {
      const catMatch = !activeCategory || ep.category === activeCategory
      const textMatch = !q || matchText(ep.title.hi) || matchText(ep.title.en) || matchText(ep.show.hi) || matchText(ep.show.en)
      return catMatch && textMatch
    })

    const filteredStories = stories.filter((st) => {
      const catMatch = !activeCategory || st.category === activeCategory
      const textMatch = !q || matchText(st.title.hi) || matchText(st.title.en) || matchText(st.dek.hi) || matchText(st.dek.en)
      return catMatch && textMatch
    })

    const filteredShorts = shorts.filter((sh) => {
      const catMatch = !activeCategory || sh.category === activeCategory
      const textMatch = !q || matchText(sh.title.hi) || matchText(sh.title.en)
      return catMatch && textMatch
    })

    return {
      episodes: filteredEpisodes,
      stories: filteredStories,
      shorts: filteredShorts,
      total: filteredEpisodes.length + filteredStories.length + filteredShorts.length,
    }
  }, [query, activeCategory])

  const quickSuggestions = [
    { label: isHi ? 'क्रिकेट' : 'Cricket', category: 'sports' },
    { label: isHi ? 'सिनेमा' : 'Cinema', category: 'entertainment' },
    { label: isHi ? 'अंतर यात्रा' : 'Antar Yatra', category: 'bhakti' },
    { label: isHi ? 'टेक' : 'Tech', category: 'tech' },
    { label: isHi ? 'हॉरर' : 'Horror', category: 'horror' },
  ]

  return (
    <div ref={wrapRef} className="relative">
      {/* Search Trigger Button */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={t.nav.search}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative rounded-full transition-all duration-200 cursor-pointer',
          open
            ? 'bg-primary/15 text-primary ring-2 ring-primary/40'
            : 'hover:scale-110 active:scale-95'
        )}
      >
        <Search className="size-5" aria-hidden="true" />
      </button>

      {/* Floating Search Popover Tab */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[min(28rem,calc(100vw-1.5rem))] animate-rise">
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 dark:border-white/10">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#9333EA] to-[#0EA5E9] text-white shadow-md shadow-purple-500/20">
                  <Search className="size-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-black text-foreground">
                    {isHi ? 'त्वरित खोज' : 'Instant Search'}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isHi ? 'पॉडकास्ट, कहानियाँ और वीडियो खोजें' : 'Search episodes, podcasts & stories'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                  ESC
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isHi ? 'एपिसोड, कहानी या शो का नाम...' : 'Search episodes, shows, stories...'}
                className="h-11 w-full rounded-2xl border border-border/80 bg-background/80 pr-10 pl-10 text-xs font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 grid size-5 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 pl-0.5">
                {isHi ? 'सुझाव:' : 'Top:'}
              </span>
              {quickSuggestions.map((s) => {
                const isSelected = activeCategory === s.category
                return (
                  <button
                    key={s.category}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setActiveCategory(null)
                      } else {
                        setActiveCategory(s.category)
                      }
                    }}
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border/70 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>

            {/* Results / Default State List */}
            <div className="mt-3 max-h-72 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin">
              {results === null ? (
                // Initial Default Suggestions
                <div className="flex flex-col gap-2 py-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    {isHi ? 'लोकप्रिय एपिसोड्स' : 'Trending Now'}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {episodes.slice(0, 3).map((ep) => {
                      const isThisPlaying = currentTrack?.id === ep.id && isPlaying
                      return (
                        <div
                          key={ep.id}
                          className="group flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 p-2 transition-all hover:bg-muted/70 hover:border-border"
                        >
                          <Link
                            href={localePath(locale, ep.premium ? `/antar-yatra/${ep.slug}` : `/podcasts/${ep.slug}`)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 min-w-0 flex-1"
                          >
                            <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
                              <Image src={ep.image || '/placeholder.svg'} alt="" fill sizes="40px" className="object-cover" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                {ep.title[locale]}
                              </span>
                              <span className="block text-[10px] text-muted-foreground">
                                {ep.show[locale]} · {ep.durationMin} {t.home.min}
                              </span>
                            </div>
                          </Link>

                          <button
                            type="button"
                            onClick={() => playTrack(ep)}
                            className="ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            aria-label={`Play ${ep.title[locale]}`}
                          >
                            <Play className="size-3.5 fill-current ml-0.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : results.total === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Search className="size-8 opacity-30 mb-2" />
                  <p className="text-xs font-bold">{isHi ? 'कोई नतीजा नहीं मिला' : 'No matches found'}</p>
                  <p className="text-[11px] mt-0.5 max-w-xs">
                    {isHi
                      ? 'कृपया अन्य शब्दों या श्रेणियों से खोजें।'
                      : 'Try adjusting your search terms or clearing filters.'}
                  </p>
                </div>
              ) : (
                // Live Results
                <div className="flex flex-col gap-2">
                  {results.episodes.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {t.nav.podcasts} ({results.episodes.length})
                      </span>
                      {results.episodes.map((ep) => {
                        const isThisPlaying = currentTrack?.id === ep.id && isPlaying
                        return (
                          <div
                            key={ep.id}
                            className="group flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-2 transition-all hover:bg-muted/70 hover:border-border"
                          >
                            <Link
                              href={localePath(locale, ep.premium ? `/antar-yatra/${ep.slug}` : `/podcasts/${ep.slug}`)}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                            >
                              <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
                                <Image src={ep.image || '/placeholder.svg'} alt="" fill sizes="40px" className="object-cover" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn('text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase', sectionStyle[ep.category].badge)}>
                                    {ep.category}
                                  </span>
                                  {ep.premium && (
                                    <span className="text-[9px] font-bold text-amber-500 uppercase">
                                      {t.nav.premium}
                                    </span>
                                  )}
                                </div>
                                <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                  {ep.title[locale]}
                                </span>
                              </div>
                            </Link>

                            <button
                              type="button"
                              onClick={() => playTrack(ep)}
                              className="ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                              aria-label={`Play ${ep.title[locale]}`}
                            >
                              <Play className="size-3.5 fill-current ml-0.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {results.stories.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {isHi ? 'कहानियाँ' : 'Stories'} ({results.stories.length})
                      </span>
                      {results.stories.map((st) => (
                        <Link
                          key={st.id}
                          href={localePath(locale, `/stories/${st.slug}`)}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/50 p-2 transition-all hover:bg-muted/70 hover:border-border"
                        >
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
                            <Image src={st.image || '/placeholder.svg'} alt="" fill sizes="40px" className="object-cover" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {st.title[locale]}
                            </span>
                            <span className="block text-[10px] text-muted-foreground truncate">
                              {st.dek[locale]}
                            </span>
                          </div>
                          <BookOpen className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 mr-1" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {results.shorts.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {isHi ? 'शॉर्ट वीडियो' : 'Shorts'} ({results.shorts.length})
                      </span>
                      {results.shorts.map((sh) => (
                        <Link
                          key={sh.id}
                          href={localePath(locale, `/videos/${sh.slug}`)}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/50 p-2 transition-all hover:bg-muted/70 hover:border-border"
                        >
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
                            <Image src={sh.image || '/placeholder.svg'} alt="" fill sizes="40px" className="object-cover" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {sh.title[locale]}
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              {sh.durationSec}s · {t.home.shorts}
                            </span>
                          </div>
                          <Film className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 mr-1" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Popover Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
              <Link
                href={localePath(locale, query ? `/search?q=${encodeURIComponent(query)}` : '/search')}
                onClick={() => setOpen(false)}
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{isHi ? 'पूरी खोज लाइब्रेरी देखें' : 'View full search page'}</span>
                <ArrowRight className="size-3" />
              </Link>
              <span className="text-muted-foreground text-[10px]">
                {isHi ? 'खोजने के लिए टाइप करें' : 'Press ESC to close'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
