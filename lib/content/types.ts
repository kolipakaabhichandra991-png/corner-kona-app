import type { SectionKey } from '@/config/brand'
import type { Locale } from '@/lib/i18n'

export type Localized = Record<Locale, string>

export type CategoryKey = Extract<
  SectionKey,
  'sports' | 'entertainment' | 'geopolitics' | 'bhakti' | 'lifestyle' | 'news' | 'deshKiCharcha' | 'genZ' | 'ckSpecial' | 'gallery' | 'techTalk' | 'scienceGyan' | 'sehat'
>

export interface SubCategory {
  slug: string
  name: Localized
}

export interface Category {
  key: CategoryKey
  slug: string
  name: Localized
  blurb: Localized
  image: string
  children?: SubCategory[]
}

export type MediaFormat = 'audio' | 'video' | 'short' | 'article'

export interface MediaLink {
  format: MediaFormat
  href: string
}

export interface Episode {
  id: string
  slug: string
  kind: 'podcast' | 'audiobook'
  title: Localized
  show: Localized
  category: CategoryKey
  durationMin: number
  image: string
  premium: boolean
  language: Locale
  publishedAt: string
  formats: MediaLink[]
}

export interface Story {
  id: string
  slug: string
  title: Localized
  dek: Localized
  category: CategoryKey
  image: string
  readMin: number
  publishedAt: string
  formats: MediaLink[]
}

export interface Short {
  id: string
  slug: string
  title: Localized
  category: CategoryKey
  durationSec: number
  image: string
  views: string
}

export type LiveEntry =
  | { id: string; type: 'text'; at: string; body: Localized }
  | { id: string; type: 'article'; at: string; storyId: string }
  | { id: string; type: 'short'; at: string; shortId: string }

export interface LiveBlog {
  id: string
  slug: string
  active: boolean
  title: Localized
  category: CategoryKey
  entries: LiveEntry[]
}

export interface Hero {
  episodeId: string
  kicker: Localized
  summary: Localized
}

export interface HomePayload {
  hero: { episode: Episode; kicker: string; summary: string }
  episodes: Episode[]
  stories: Story[]
  shorts: Short[]
  categories: Category[]
  antarYatra: Episode[]
  live: { active: boolean; slug: string | null }
}
