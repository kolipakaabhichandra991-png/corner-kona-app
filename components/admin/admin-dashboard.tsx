'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Film,
  BookOpen,
  Headphones,
  Layers,
  PlusCircle,
  Trash2,
  ExternalLink,
  LogOut,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  Clock,
  Radio,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'
import type { Category, CategoryKey, Episode, Short, Story } from '@/lib/content/types'
import { brand } from '@/config/brand'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  initialCategories: Category[]
  initialShorts: Short[]
  initialStories: Story[]
  initialEpisodes: Episode[]
}

const PRESET_IMAGES = [
  { label: 'Kabaddi / Action', url: '/images/short-kabaddi.png' },
  { label: 'Dance / Lifestyle', url: '/images/short-dance.png' },
  { label: 'Street Food / Delhi', url: '/images/short-streetfood.png' },
  { label: 'Ganga Aarti / Spiritual', url: '/images/short-aarti.png' },
  { label: 'Cricket / Stadium', url: '/images/sports-cricket.png' },
  { label: 'Indie Film / Cinema', url: '/images/ent-film.png' },
  { label: 'Chai / Gen-Z Chaske', url: '/images/life-chai.png' },
  { label: 'Studio Mic / Podcast', url: '/images/hero-podcast.png' },
  { label: 'Global Summit / News', url: '/images/geo-summit.png' },
  { label: 'Diya / Bhakti', url: '/images/bhakti-diya.png' },
]

export function AdminDashboard({
  initialCategories,
  initialShorts,
  initialStories,
  initialEpisodes,
}: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'short' | 'story' | 'episode' | 'manage'>('short')
  const [manageFilter, setManageFilter] = useState<'all' | 'short' | 'story' | 'episode'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Content state
  const [shorts, setShorts] = useState<Short[]>(initialShorts)
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes)
  const [categories] = useState<Category[]>(initialCategories)

  // Feedback notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Short Video Form State
  const [shortTitleHi, setShortTitleHi] = useState('')
  const [shortTitleEn, setShortTitleEn] = useState('')
  const [shortCategory, setShortCategory] = useState<CategoryKey>('sports')
  const [shortDuration, setShortDuration] = useState('40')
  const [shortImage, setShortImage] = useState(PRESET_IMAGES[0].url)
  const [shortCustomImage, setShortCustomImage] = useState('')
  const [shortViews, setShortViews] = useState('15K')

  // 2. Story / Article Form State
  const [storyTitleHi, setStoryTitleHi] = useState('')
  const [storyTitleEn, setStoryTitleEn] = useState('')
  const [storyDekHi, setStoryDekHi] = useState('')
  const [storyDekEn, setStoryDekEn] = useState('')
  const [storyCategory, setStoryCategory] = useState<CategoryKey>('news')
  const [storyReadMin, setStoryReadMin] = useState('5')
  const [storyImage, setStoryImage] = useState(PRESET_IMAGES[8].url)
  const [storyCustomImage, setStoryCustomImage] = useState('')

  // 3. Podcast / Episode Form State
  const [epTitleHi, setEpTitleHi] = useState('')
  const [epTitleEn, setEpTitleEn] = useState('')
  const [epShowHi, setEpShowHi] = useState('कोना टॉक्स')
  const [epShowEn, setEpShowEn] = useState('Kona Talks')
  const [epCategory, setEpCategory] = useState<CategoryKey>('sports')
  const [epKind, setEpKind] = useState<'podcast' | 'audiobook'>('podcast')
  const [epDurationMin, setEpDurationMin] = useState('35')
  const [epImage, setEpImage] = useState(PRESET_IMAGES[7].url)
  const [epCustomImage, setEpCustomImage] = useState('')
  const [epPremium, setEpPremium] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  // Refresh content from server
  const refreshContent = async () => {
    try {
      const res = await fetch('/api/admin/content')
      const data = await res.json()
      if (data.success) {
        setShorts(data.shorts)
        setStories(data.stories)
        setEpisodes(data.episodes)
      }
    } catch (err) {
      console.error('Error refreshing content:', err)
    }
  }

  // Submit Short Video
  const handlePostShort = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortTitleHi && !shortTitleEn) {
      setStatusMessage({ type: 'error', text: 'कृपया शीर्षक दर्ज करें (Please provide a title)' })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'short',
          data: {
            titleHi: shortTitleHi || shortTitleEn,
            titleEn: shortTitleEn || shortTitleHi,
            category: shortCategory,
            durationSec: Number(shortDuration) || 40,
            image: shortCustomImage.trim() || shortImage,
            views: shortViews || '1.0K',
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to post short')

      setShorts((prev) => [data.item, ...prev])
      setStatusMessage({
        type: 'success',
        text: 'शॉर्ट वीडियो सफलतापूर्वक प्रकाशित हो गया! यह अब वेबसाइट और इंस्टाग्राम स्टोरी प्लेयर में लाइव है।',
        link: `/videos/${data.item.slug}`,
      })

      // Reset form
      setShortTitleHi('')
      setShortTitleEn('')
      setShortCustomImage('')
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Story / Article
  const handlePostStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storyTitleHi && !storyTitleEn) {
      setStatusMessage({ type: 'error', text: 'कृपया शीर्षक दर्ज करें (Please provide a title)' })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story',
          data: {
            titleHi: storyTitleHi || storyTitleEn,
            titleEn: storyTitleEn || storyTitleHi,
            dekHi: storyDekHi,
            dekEn: storyDekEn,
            category: storyCategory,
            readMin: Number(storyReadMin) || 5,
            image: storyCustomImage.trim() || storyImage,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to post story')

      setStories((prev) => [data.item, ...prev])
      setStatusMessage({
        type: 'success',
        text: 'आर्टिकल/स्टोरी सफलतापूर्वक प्रकाशित हो गई!',
        link: `/stories/${data.item.slug}`,
      })

      setStoryTitleHi('')
      setStoryTitleEn('')
      setStoryDekHi('')
      setStoryDekEn('')
      setStoryCustomImage('')
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Podcast / Episode
  const handlePostEpisode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!epTitleHi && !epTitleEn) {
      setStatusMessage({ type: 'error', text: 'कृपया शीर्षक दर्ज करें (Please provide a title)' })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'episode',
          data: {
            titleHi: epTitleHi || epTitleEn,
            titleEn: epTitleEn || epTitleHi,
            showHi: epShowHi,
            showEn: epShowEn,
            category: epCategory,
            kind: epKind,
            durationMin: Number(epDurationMin) || 30,
            image: epCustomImage.trim() || epImage,
            premium: epPremium,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to post episode')

      setEpisodes((prev) => [data.item, ...prev])
      setStatusMessage({
        type: 'success',
        text: 'पॉडकास्ट/एपिसोड सफलतापूर्वक प्रकाशित हो गया!',
        link: `/podcasts/${data.item.slug}`,
      })

      setEpTitleHi('')
      setEpTitleEn('')
      setEpCustomImage('')
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Item
  const handleDeleteItem = async (type: 'short' | 'story' | 'episode', id: string, title: string) => {
    if (!confirm(`क्या आप "${title}" को हटाना चाहते हैं? (Delete this item?)`)) return

    try {
      const res = await fetch(`/api/admin/content?type=${type}&id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete')

      if (type === 'short') setShorts((prev) => prev.filter((s) => s.id !== id))
      if (type === 'story') setStories((prev) => prev.filter((s) => s.id !== id))
      if (type === 'episode') setEpisodes((prev) => prev.filter((e) => e.id !== id))

      setStatusMessage({ type: 'success', text: `सफलतापूर्वक हटा दिया गया (Deleted ${id})` })
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    }
  }

  // Filter items for Manage tab
  const allManageItems = [
    ...shorts.map((s) => ({
      id: s.id,
      slug: s.slug,
      type: 'short' as const,
      typeLabel: 'शॉर्ट वीडियो (Short)',
      title: s.title.hi || s.title.en,
      sub: `${s.durationSec}s · ${s.views} views`,
      category: s.category,
      image: s.image,
      href: `/videos/${s.slug}`,
    })),
    ...stories.map((st) => ({
      id: st.id,
      slug: st.slug,
      type: 'story' as const,
      typeLabel: 'आर्टिकल (Story)',
      title: st.title.hi || st.title.en,
      sub: `${st.readMin} min read`,
      category: st.category,
      image: st.image,
      href: `/stories/${st.slug}`,
    })),
    ...episodes.map((ep) => ({
      id: ep.id,
      slug: ep.slug,
      type: 'episode' as const,
      typeLabel: ep.kind === 'audiobook' ? 'ऑडियोबुक (Audiobook)' : 'पॉडकास्ट (Podcast)',
      title: ep.title.hi || ep.title.en,
      sub: `${ep.durationMin} min · ${ep.show.hi || ep.show.en}`,
      category: ep.category,
      image: ep.image,
      href: `/podcasts/${ep.slug}`,
    })),
  ]

  const filteredManageItems = allManageItems.filter((item) => {
    const matchesFilter = manageFilter === 'all' || item.type === manageFilter
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6">
      {/* 1. Admin Portal Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-card/80 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
            <SlidersHorizontal className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight md:text-xl">Corner Kona Admin Portal</h1>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-400 ring-1 ring-emerald-500/30">
                Live Console
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              संपूर्ण वेबसाइट सामग्री नियंत्रण व प्रकाशन (Full Content Publishing & Administration)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-foreground hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="size-3.5" />
            <span>लाइव वेबसाइट देखें (View Live Site)</span>
          </Link>

          <button
            type="button"
            onClick={refreshContent}
            className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            title="रिफ्रेश डेटा (Refresh Data)"
          >
            <RefreshCw className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600/15 border border-rose-600/30 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600/25 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>लॉगआउट (Logout)</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 shadow-lg backdrop-blur-md">
          <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Film className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black">{shorts.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">शॉर्ट्स वीडियो (Shorts)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 shadow-lg backdrop-blur-md">
          <div className="flex size-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
            <BookOpen className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black">{stories.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">आर्टिकल्स (Stories)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 shadow-lg backdrop-blur-md">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <Headphones className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black">{episodes.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">पॉडकास्ट (Podcasts)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 shadow-lg backdrop-blur-md">
          <div className="flex size-11 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
            <Layers className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black">{categories.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">कैटेगरीज (Categories)</span>
          </div>
        </div>
      </div>

      {/* 3. Status Notification Banner */}
      {statusMessage && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2',
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/15 text-rose-400',
          )}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle className="size-5 shrink-0" /> : <AlertCircle className="size-5 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
          {statusMessage.link && (
            <Link
              href={statusMessage.link}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500 transition-colors shrink-0"
            >
              <span>लाइव देखें (View Live)</span>
              <ExternalLink className="size-3" />
            </Link>
          )}
        </div>
      )}

      {/* 4. Action Tabs: Post Short Video | Post Story | Post Podcast | Manage Content */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('short')}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
            activeTab === 'short'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <Film className="size-4" />
          <span>🎬 पोस्ट शॉर्ट वीडियो (Post Short Video)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
            activeTab === 'story'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <BookOpen className="size-4" />
          <span>📰 पोस्ट आर्टिकल / स्टोरी (Post Story)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('episode')}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
            activeTab === 'episode'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <Headphones className="size-4" />
          <span>🎙️ पोस्ट पॉडकास्ट / ऑडियो (Post Podcast)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ml-auto',
            activeTab === 'manage'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <Layers className="size-4" />
          <span>📋 सामग्री प्रबंधन (Manage All Content)</span>
        </button>
      </div>

      {/* 5. TAB 1: POST SHORT VIDEO */}
      {activeTab === 'short' && (
        <form onSubmit={handlePostShort} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-black">नया शॉर्ट वीडियो प्रकाशित करें (Publish New Short Video)</h2>
            <p className="text-xs text-muted-foreground">
              यह वीडियो वेबसाइट के शॉर्ट वीडियो सेक्शन और इंस्टाग्राम स्टोरी प्लेयर में तुरंत प्रदर्शित होगा।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">वीडियो शीर्षक (Hindi Title) *</label>
              <input
                type="text"
                required
                value={shortTitleHi}
                onChange={(e) => setShortTitleHi(e.target.value)}
                placeholder="उदा. आख़िरी ओवर का रोमांचक टर्न"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">वीडियो शीर्षक (English Title)</label>
              <input
                type="text"
                value={shortTitleEn}
                onChange={(e) => setShortTitleEn(e.target.value)}
                placeholder="e.g. Thrilling turn in the final over"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">कैटेगरी (Category) *</label>
              <select
                value={shortCategory}
                onChange={(e) => setShortCategory(e.target.value as CategoryKey)}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name.hi} ({c.name.en})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">अवधि सेकंड में (Duration Sec)</label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={shortDuration}
                  onChange={(e) => setShortDuration(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">शुरुआती व्यूज़ (Views)</label>
                <input
                  type="text"
                  value={shortViews}
                  onChange={(e) => setShortViews(e.target.value)}
                  placeholder="25K"
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>

          {/* Preset Image Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground">थंबनेल छवि चुनें (Select Preset Thumbnail)</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    setShortImage(img.url)
                    setShortCustomImage('')
                  }}
                  className={cn(
                    'group relative aspect-[9/16] overflow-hidden rounded-xl border-2 transition-all',
                    shortImage === img.url && !shortCustomImage
                      ? 'border-purple-500 ring-4 ring-purple-500/30 scale-102'
                      : 'border-border/60 hover:border-purple-400 opacity-70 hover:opacity-100',
                  )}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/80 p-1 text-[10px] font-bold text-white truncate text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">या कस्टम छवि URL (Or Custom Image URL):</label>
              <input
                type="text"
                value={shortCustomImage}
                onChange={(e) => setShortCustomImage(e.target.value)}
                placeholder="https://example.com/thumbnail.png"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <PlusCircle className="size-4" />
            <span>{isSubmitting ? 'प्रकाशित हो रहा है...' : 'शॉर्ट वीडियो प्रकाशित करें (Publish Short)'}</span>
          </button>
        </form>
      )}

      {/* 6. TAB 2: POST STORY / ARTICLE */}
      {activeTab === 'story' && (
        <form onSubmit={handlePostStory} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-black">नया आर्टिकल / स्टोरी प्रकाशित करें (Publish New Story)</h2>
            <p className="text-xs text-muted-foreground">
              यह आर्टिकल होमपेज और संबंधित कैटेगरी में लाइव प्रकाशित हो जाएगा।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">आर्टिकल शीर्षक (Hindi Title) *</label>
              <input
                type="text"
                required
                value={storyTitleHi}
                onChange={(e) => setStoryTitleHi(e.target.value)}
                placeholder="उदा. नए भारत की उभरती टेक कंपनियाँ"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">आर्टिकल शीर्षक (English Title)</label>
              <input
                type="text"
                value={storyTitleEn}
                onChange={(e) => setStoryTitleEn(e.target.value)}
                placeholder="e.g. Emerging tech companies of new India"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">सब-हेडलाइन / संक्षेप (Hindi Dek)</label>
              <input
                type="text"
                value={storyDekHi}
                onChange={(e) => setStoryDekHi(e.target.value)}
                placeholder="उदा. कैसे टियर-2 शहरों से निकल रहे हैं यूनिकॉर्न"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">सब-हेडलाइन / संक्षेप (English Dek)</label>
              <input
                type="text"
                value={storyDekEn}
                onChange={(e) => setStoryDekEn(e.target.value)}
                placeholder="e.g. How unicorns are emerging from Tier-2 cities"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">कैटेगरी (Category) *</label>
              <select
                value={storyCategory}
                onChange={(e) => setStoryCategory(e.target.value as CategoryKey)}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name.hi} ({c.name.en})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">पढ़ने का समय (Read Time Minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={storyReadMin}
                onChange={(e) => setStoryReadMin(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <PlusCircle className="size-4" />
            <span>{isSubmitting ? 'प्रकाशित हो रहा है...' : 'आर्टिकल प्रकाशित करें (Publish Story)'}</span>
          </button>
        </form>
      )}

      {/* 7. TAB 3: POST PODCAST / EPISODE */}
      {activeTab === 'episode' && (
        <form onSubmit={handlePostEpisode} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-black">नया पॉडकास्ट / एपिसोड प्रकाशित करें (Publish New Episode)</h2>
            <p className="text-xs text-muted-foreground">
              यह ऑडियो ट्रैक पॉडकास्ट पेज और प्लेयर में श्रोताओं के लिए उपलब्ध होगा।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">एपिसोड शीर्षक (Hindi Title) *</label>
              <input
                type="text"
                required
                value={epTitleHi}
                onChange={(e) => setEpTitleHi(e.target.value)}
                placeholder="उदा. नए दौर का संगीत और स्वतंत्र कलाकार"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">एपिसोड शीर्षक (English Title)</label>
              <input
                type="text"
                value={epTitleEn}
                onChange={(e) => setEpTitleEn(e.target.value)}
                placeholder="e.g. New age music & independent creators"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">शो का नाम (Show Name)</label>
              <input
                type="text"
                value={epShowHi}
                onChange={(e) => setEpShowHi(e.target.value)}
                placeholder="कोना टॉक्स"
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">प्रकार (Kind)</label>
                <select
                  value={epKind}
                  onChange={(e) => setEpKind(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="podcast">पॉडकास्ट (Podcast)</option>
                  <option value="audiobook">ऑडियोबुक (Audiobook)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">अवधि मिनट में (Duration Min)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={epDurationMin}
                  onChange={(e) => setEpDurationMin(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground">कैटेगरी (Category) *</label>
              <select
                value={epCategory}
                onChange={(e) => setEpCategory(e.target.value as CategoryKey)}
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.name.hi} ({c.name.en})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="epPremium"
                checked={epPremium}
                onChange={(e) => setEpPremium(e.target.checked)}
                className="size-4 rounded border-border text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="epPremium" className="text-xs font-bold text-foreground cursor-pointer">
                प्रीमियम / अंतर यात्रा एक्सक्लूसिव (Patron Premium Episode)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-purple-600/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <PlusCircle className="size-4" />
            <span>{isSubmitting ? 'प्रकाशित हो रहा है...' : 'पॉडकास्ट प्रकाशित करें (Publish Episode)'}</span>
          </button>
        </form>
      )}

      {/* 8. TAB 4: MANAGE ALL CONTENT */}
      {activeTab === 'manage' && (
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-black">मौजूदा सामग्री प्रबंधन (Manage Published Content)</h2>
              <span className="text-xs text-muted-foreground">
                कुल {filteredManageItems.length} सामग्री उपलब्ध
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-xl bg-muted/80 p-1">
              {(['all', 'short', 'story', 'episode'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setManageFilter(f)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-bold transition-all',
                    manageFilter === f ? 'bg-purple-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f === 'all' && 'सभी (All)'}
                  {f === 'short' && 'शॉर्ट्स (Shorts)'}
                  {f === 'story' && 'आर्टिकल्स (Stories)'}
                  {f === 'episode' && 'पॉडकास्ट (Podcasts)'}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="शीर्षक या कैटेगरी से खोजें (Search by title or category)..."
              className="w-full rounded-xl border border-border bg-background/80 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Items List */}
          <div className="flex flex-col divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/60 bg-background/40">
            {filteredManageItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                कोई सामग्री नहीं मिली (No content matching criteria)
              </div>
            ) : (
              filteredManageItems.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image src={item.image} alt="" fill className="object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-black uppercase text-muted-foreground">
                          {item.typeLabel}
                        </span>
                        <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold truncate max-w-[280px] sm:max-w-md md:max-w-lg mt-0.5">
                        {item.title}
                      </h3>
                      <span className="text-[11px] text-muted-foreground">{item.sub}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={item.href}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-white/15 transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      <span>देखें</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.type, item.id, item.title)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="सामग्री हटाएँ (Delete Item)"
                    >
                      <Trash2 className="size-3" />
                      <span>हटाएँ</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
