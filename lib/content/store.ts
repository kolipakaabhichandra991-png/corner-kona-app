import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { Locale } from '@/lib/i18n'
import {
  categories as seedCategories,
  episodes as seedEpisodes,
  hero as seedHero,
  liveBlogs as seedLiveBlogs,
  shorts as seedShorts,
  stories as seedStories,
} from './seed'
import type {
  Category,
  CategoryKey,
  Episode,
  Hero,
  LiveBlog,
  Localized,
  MediaLink,
  Short,
  Story,
  SubCategory,
} from './types'

export interface ContentStoreData {
  categories: Category[]
  episodes: Episode[]
  stories: Story[]
  shorts: Short[]
  hero: Hero
  liveBlogs: LiveBlog[]
}

function getInitialData(): ContentStoreData {
  return {
    categories: seedCategories,
    episodes: seedEpisodes,
    stories: seedStories,
    shorts: seedShorts,
    hero: seedHero,
    liveBlogs: seedLiveBlogs,
  }
}

export async function loadStore(): Promise<ContentStoreData> {
  try {
    const [categoriesRaw, episodesRaw, storiesRaw, shortsRaw, heroRaw, liveBlogsRaw] = await Promise.all([
      prisma.category.findMany(),
      prisma.episode.findMany({ include: { chapters: true } }),
      prisma.story.findMany(),
      prisma.short.findMany(),
      prisma.heroConfig.findFirst(),
      prisma.liveBlog.findMany({ include: { entries: true } }),
    ])

    const categories: Category[] =
      categoriesRaw.length > 0
        ? categoriesRaw.map((c) => ({
            key: c.key as CategoryKey,
            slug: c.slug,
            name: c.name as unknown as Localized,
            blurb: c.blurb as unknown as Localized,
            image: c.image,
            children: (c.children as unknown as SubCategory[]) || undefined,
          }))
        : seedCategories

    const episodes: Episode[] =
      episodesRaw.length > 0
        ? episodesRaw.map((e) => ({
            id: e.id,
            slug: e.slug,
            kind: e.kind as 'podcast' | 'audiobook',
            releaseType: (e.releaseType as 'series' | 'standalone') || undefined,
            seriesTitle: (e.seriesTitle as unknown as Localized) || undefined,
            seasonNumber: e.seasonNumber ?? undefined,
            episodeNumber: e.episodeNumber ?? undefined,
            totalEpisodes: e.totalEpisodes ?? undefined,
            title: e.title as unknown as Localized,
            show: e.show as unknown as Localized,
            category: e.category as CategoryKey,
            durationMin: e.durationMin,
            image: e.image,
            premium: e.premium,
            language: (e.language as Locale) || 'hi',
            publishedAt: e.publishedAt instanceof Date ? e.publishedAt.toISOString() : String(e.publishedAt),
            youtubeId: e.youtubeId || undefined,
            formats: (e.formats as unknown as MediaLink[]) || [],
            chapters:
              e.chapters && e.chapters.length > 0
                ? e.chapters.map((ch) => ({
                    id: ch.id,
                    title: ch.title as unknown as Localized,
                    start: ch.start,
                  }))
                : undefined,
          }))
        : seedEpisodes

    const stories: Story[] =
      storiesRaw.length > 0
        ? storiesRaw.map((s) => ({
            id: s.id,
            slug: s.slug,
            title: s.title as unknown as Localized,
            dek: s.dek as unknown as Localized,
            category: s.category as CategoryKey,
            image: s.image,
            readMin: s.readMin,
            publishedAt: s.publishedAt instanceof Date ? s.publishedAt.toISOString() : String(s.publishedAt),
            formats: (s.formats as unknown as MediaLink[]) || [],
          }))
        : seedStories

    const shorts: Short[] =
      shortsRaw.length > 0
        ? shortsRaw.map((sh) => ({
            id: sh.id,
            slug: sh.slug,
            title: sh.title as unknown as Localized,
            category: sh.category as CategoryKey,
            durationSec: sh.durationSec,
            image: sh.image,
            views: sh.views,
          }))
        : seedShorts

    const hero: Hero = heroRaw
      ? {
          episodeId: heroRaw.episodeId,
          kicker: heroRaw.kicker as unknown as Localized,
          summary: heroRaw.summary as unknown as Localized,
        }
      : seedHero

    const liveBlogs: LiveBlog[] =
      liveBlogsRaw.length > 0
        ? liveBlogsRaw.map((lb) => ({
            id: lb.id,
            slug: lb.slug,
            active: lb.active,
            title: lb.title as unknown as Localized,
            category: lb.category as CategoryKey,
            entries: lb.entries.map((entry) => {
              const at = entry.at instanceof Date ? entry.at.toISOString() : String(entry.at)
              if (entry.type === 'article') {
                return { id: entry.id, type: 'article', at, storyId: entry.storyId || '' }
              }
              if (entry.type === 'short') {
                return { id: entry.id, type: 'short', at, shortId: entry.shortId || '' }
              }
              return {
                id: entry.id,
                type: 'text',
                at,
                body: (entry.body as unknown as Localized) || { hi: '', en: '' },
              }
            }),
          }))
        : seedLiveBlogs

    return {
      categories,
      episodes,
      stories,
      shorts,
      hero,
      liveBlogs,
    }
  } catch (err) {
    console.error('Error loading content from Prisma, using fallback:', err)
    return getInitialData()
  }
}

export async function saveStore(_data: ContentStoreData): Promise<void> {
  // Retained for API compatibility without deleting JSON file
}

export async function addShort(newShort: Short): Promise<Short> {
  await prisma.short.upsert({
    where: { id: newShort.id },
    update: {
      slug: newShort.slug,
      title: newShort.title,
      category: newShort.category,
      durationSec: newShort.durationSec,
      image: newShort.image,
      views: newShort.views,
    },
    create: {
      id: newShort.id,
      slug: newShort.slug,
      title: newShort.title,
      category: newShort.category,
      durationSec: newShort.durationSec,
      image: newShort.image,
      views: newShort.views,
    },
  })
  return newShort
}

export async function deleteShort(id: string): Promise<boolean> {
  try {
    await prisma.short.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function addStory(newStory: Story): Promise<Story> {
  const publishedAt = newStory.publishedAt && !isNaN(new Date(newStory.publishedAt).getTime())
    ? new Date(newStory.publishedAt)
    : new Date()

  await prisma.story.upsert({
    where: { id: newStory.id },
    update: {
      slug: newStory.slug,
      title: newStory.title,
      dek: newStory.dek,
      category: newStory.category,
      image: newStory.image,
      readMin: newStory.readMin,
      publishedAt,
      formats: newStory.formats as any,
    },
    create: {
      id: newStory.id,
      slug: newStory.slug,
      title: newStory.title,
      dek: newStory.dek,
      category: newStory.category,
      image: newStory.image,
      readMin: newStory.readMin,
      publishedAt,
      formats: newStory.formats as any,
    },
  })
  return newStory
}

export async function deleteStory(id: string): Promise<boolean> {
  try {
    await prisma.story.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function addEpisode(newEpisode: Episode): Promise<Episode> {
  const audioUrl = newEpisode.formats?.find((f) => f.format === 'audio')?.href || null
  const videoUrl = newEpisode.formats?.find((f) => f.format === 'video')?.href || null
  const thumbnailUrl = newEpisode.image || null
  const publishedAt = newEpisode.publishedAt && !isNaN(new Date(newEpisode.publishedAt).getTime())
    ? new Date(newEpisode.publishedAt)
    : new Date()

  await prisma.episode.upsert({
    where: { id: newEpisode.id },
    update: {
      slug: newEpisode.slug,
      kind: newEpisode.kind,
      releaseType: newEpisode.releaseType || null,
      seriesTitle: newEpisode.seriesTitle ? (newEpisode.seriesTitle as any) : Prisma.DbNull,
      seasonNumber: newEpisode.seasonNumber ?? null,
      episodeNumber: newEpisode.episodeNumber ?? null,
      totalEpisodes: newEpisode.totalEpisodes ?? null,
      youtubeId: newEpisode.youtubeId || null,
      audioUrl,
      videoUrl,
      thumbnailUrl,
      title: newEpisode.title as any,
      show: newEpisode.show as any,
      category: newEpisode.category,
      durationMin: newEpisode.durationMin,
      image: newEpisode.image,
      premium: newEpisode.premium,
      language: newEpisode.language,
      publishedAt,
      formats: newEpisode.formats as any,
    },
    create: {
      id: newEpisode.id,
      slug: newEpisode.slug,
      kind: newEpisode.kind,
      releaseType: newEpisode.releaseType || null,
      seriesTitle: newEpisode.seriesTitle ? (newEpisode.seriesTitle as any) : Prisma.DbNull,
      seasonNumber: newEpisode.seasonNumber ?? null,
      episodeNumber: newEpisode.episodeNumber ?? null,
      totalEpisodes: newEpisode.totalEpisodes ?? null,
      youtubeId: newEpisode.youtubeId || null,
      audioUrl,
      videoUrl,
      thumbnailUrl,
      title: newEpisode.title as any,
      show: newEpisode.show as any,
      category: newEpisode.category,
      durationMin: newEpisode.durationMin,
      image: newEpisode.image,
      premium: newEpisode.premium,
      language: newEpisode.language,
      publishedAt,
      formats: newEpisode.formats as any,
    },
  })
  return newEpisode
}

export async function deleteEpisode(id: string): Promise<boolean> {
  try {
    await prisma.episode.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
