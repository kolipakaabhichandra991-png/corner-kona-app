import 'server-only'
import type { Locale } from '@/lib/i18n'
import { categories, episodes, hero, liveBlogs, shorts, stories } from './seed'
import type { CategoryKey, Episode, HomePayload, LiveBlog } from './types'

/**
 * Service layer shared by route handlers (public REST API for web + mobile)
 * and server components. Backed by seed data in Phase 1; swapped for Prisma in Phase 2.
 */
export async function getHome(locale: Locale): Promise<HomePayload> {
  const heroEpisode = episodes.find((e) => e.id === hero.episodeId) ?? episodes[0]
  const activeLive = liveBlogs.find((b) => b.active) ?? null
  return {
    hero: { episode: heroEpisode, kicker: hero.kicker[locale], summary: hero.summary[locale] },
    episodes: episodes.filter((e) => !e.premium && e.id !== heroEpisode.id),
    stories,
    shorts,
    categories,
    antarYatra: episodes.filter((e) => e.premium),
    live: { active: Boolean(activeLive), slug: activeLive?.slug ?? null },
  }
}

export async function getActiveLiveBlog(): Promise<LiveBlog | null> {
  return liveBlogs.find((b) => b.active) ?? null
}

export async function getLatestEpisodes(limit = 3) {
  return episodes.filter((e) => !e.premium).slice(0, limit)
}

export const lookup = {
  story: (id: string) => stories.find((s) => s.id === id),
  short: (id: string) => shorts.find((s) => s.id === id),
}

export async function getEpisodes(opts: { topic?: string; kind?: Episode['kind']; premium?: boolean } = {}) {
  const cat = opts.topic ? categories.find((c) => c.slug === opts.topic) : undefined
  return episodes.filter(
    (e) =>
      (opts.premium === undefined || e.premium === opts.premium) &&
      (!opts.kind || e.kind === opts.kind) &&
      (!opts.topic || e.category === cat?.key),
  )
}

export async function getEpisode(slug: string) {
  return episodes.find((e) => e.slug === slug) ?? null
}

export async function getCategories() {
  return categories
}

export async function getCategory(slugOrKey: string) {
  return categories.find((c) => c.slug === slugOrKey || c.key === slugOrKey) ?? null
}

export async function getCategoryContent(key: CategoryKey) {
  return {
    episodes: episodes.filter((e) => e.category === key && !e.premium),
    stories: stories.filter((s) => s.category === key),
    shorts: shorts.filter((s) => s.category === key),
  }
}

export async function getStory(categorySlug: string, slug: string) {
  const cat = categories.find((c) => c.slug === categorySlug)
  return stories.find((s) => s.slug === slug && s.category === cat?.key) ?? null
}

export async function getStories() {
  return stories
}

export async function getShorts() {
  return shorts
}

export async function getShort(slug: string) {
  return shorts.find((s) => s.slug === slug) ?? null
}

export function resolveLiveBlog(blog: LiveBlog) {
  return {
    ...blog,
    entries: blog.entries.map((entry) => {
      if (entry.type === 'article') return { ...entry, story: lookup.story(entry.storyId) ?? null }
      if (entry.type === 'short') return { ...entry, short: lookup.short(entry.shortId) ?? null }
      return entry
    }),
  }
}

export async function getLiveBlog(slug: string) {
  const blog = liveBlogs.find((b) => b.slug === slug)
  return blog ? resolveLiveBlog(blog) : null
}

export async function searchContent(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return { episodes: [], stories: [], shorts: [] }
  const hit = (...fields: string[]) => fields.some((f) => f.toLowerCase().includes(q))
  return {
    episodes: episodes.filter((e) => hit(e.title.hi, e.title.en, e.show.hi, e.show.en)),
    stories: stories.filter((s) => hit(s.title.hi, s.title.en, s.dek.hi, s.dek.en)),
    shorts: shorts.filter((s) => hit(s.title.hi, s.title.en)),
  }
}

export const staticSlugs = {
  episodes: () => episodes.filter((e) => !e.premium).map((e) => ({ slug: e.slug })),
  premium: () => episodes.filter((e) => e.premium).map((e) => ({ slug: e.slug })),
  shorts: () => shorts.map((s) => ({ slug: s.slug })),
  categories: () => categories.map((c) => ({ category: c.slug })),
  stories: () =>
    stories.map((s) => ({ category: categories.find((c) => c.key === s.category)?.slug ?? s.category, slug: s.slug })),
  live: () => liveBlogs.map((b) => ({ slug: b.slug })),
}
