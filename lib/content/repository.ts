import 'server-only'
import type { Locale } from '@/lib/i18n'
import { loadStore } from './store'
import type { CategoryKey, Episode, HomePayload, LiveBlog } from './types'

/**
 * Service layer shared by route handlers (public REST API for web + mobile)
 * and server components. Backed by persistent store with seed fallback.
 */
export async function getHome(locale: Locale): Promise<HomePayload> {
  const store = loadStore()
  const heroEpisode = store.episodes.find((e) => e.id === store.hero.episodeId) ?? store.episodes[0]
  const activeLive = store.liveBlogs.find((b) => b.active) ?? null
  return {
    hero: { episode: heroEpisode, kicker: store.hero.kicker[locale], summary: store.hero.summary[locale] },
    episodes: store.episodes.filter((e) => !e.premium && e.id !== heroEpisode.id),
    stories: store.stories,
    shorts: store.shorts,
    categories: store.categories,
    antarYatra: store.episodes.filter((e) => e.premium),
    live: { active: Boolean(activeLive), slug: activeLive?.slug ?? null },
  }
}

export async function getActiveLiveBlog(): Promise<LiveBlog | null> {
  const store = loadStore()
  return store.liveBlogs.find((b) => b.active) ?? null
}

export async function getLatestEpisodes(limit = 3) {
  const store = loadStore()
  return store.episodes.filter((e) => !e.premium).slice(0, limit)
}

export const lookup = {
  story: (id: string) => loadStore().stories.find((s) => s.id === id),
  short: (id: string) => loadStore().shorts.find((s) => s.id === id),
}

export async function getEpisodes(opts: { topic?: string; kind?: Episode['kind']; premium?: boolean } = {}) {
  const store = loadStore()
  const cat = opts.topic ? store.categories.find((c) => c.slug === opts.topic) : undefined
  return store.episodes.filter(
    (e) =>
      (opts.premium === undefined || e.premium === opts.premium) &&
      (!opts.kind || e.kind === opts.kind) &&
      (!opts.topic || e.category === cat?.key),
  )
}

export async function getEpisode(slug: string) {
  const store = loadStore()
  return store.episodes.find((e) => e.slug === slug) ?? null
}

export async function getCategories() {
  const store = loadStore()
  return store.categories
}

export async function getCategory(slugOrKey: string) {
  const store = loadStore()
  return store.categories.find((c) => c.slug === slugOrKey || c.key === slugOrKey) ?? null
}

export async function getCategoryContent(key: CategoryKey) {
  const store = loadStore()
  return {
    episodes: store.episodes.filter((e) => e.category === key && !e.premium),
    stories: store.stories.filter((s) => s.category === key),
    shorts: store.shorts.filter((s) => s.category === key),
  }
}

export async function getStory(categorySlug: string, slug: string) {
  const store = loadStore()
  const cat = store.categories.find((c) => c.slug === categorySlug)
  return store.stories.find((s) => s.slug === slug && s.category === cat?.key) ?? null
}

export async function getStories() {
  const store = loadStore()
  return store.stories
}

export async function getShorts() {
  const store = loadStore()
  return store.shorts
}

export async function getShort(slug: string) {
  const store = loadStore()
  return store.shorts.find((s) => s.slug === slug) ?? null
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
  const store = loadStore()
  const blog = store.liveBlogs.find((b) => b.slug === slug)
  return blog ? resolveLiveBlog(blog) : null
}

export async function searchContent(query: string) {
  const store = loadStore()
  const q = query.trim().toLowerCase()
  if (!q) return { episodes: [], stories: [], shorts: [] }
  const hit = (...fields: string[]) => fields.some((f) => f.toLowerCase().includes(q))
  return {
    episodes: store.episodes.filter((e) => hit(e.title.hi, e.title.en, e.show.hi, e.show.en)),
    stories: store.stories.filter((s) => hit(s.title.hi, s.title.en, s.dek.hi, s.dek.en)),
    shorts: store.shorts.filter((s) => hit(s.title.hi, s.title.en)),
  }
}

export const staticSlugs = {
  episodes: () => loadStore().episodes.filter((e) => !e.premium).map((e) => ({ slug: e.slug })),
  premium: () => loadStore().episodes.filter((e) => e.premium).map((e) => ({ slug: e.slug })),
  shorts: () => loadStore().shorts.map((s) => ({ slug: s.slug })),
  categories: () => loadStore().categories.map((c) => ({ category: c.slug })),
  stories: () => {
    const store = loadStore()
    return store.stories.map((s) => ({
      category: store.categories.find((c) => c.key === s.category)?.slug ?? s.category,
      slug: s.slug,
    }))
  },
  live: () => loadStore().liveBlogs.map((b) => ({ slug: b.slug })),
}
