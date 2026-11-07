import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { categories as seedCategories, episodes as seedEpisodes, stories as seedStories, shorts as seedShorts, hero as seedHero, liveBlogs as seedLiveBlogs } from '../lib/content/seed'
import { sampleTranscripts } from '../lib/content/transcripts'

const prisma = new PrismaClient()

interface ContentStoreJson {
  categories?: any[]
  episodes?: any[]
  stories?: any[]
  shorts?: any[]
  hero?: any
  liveBlogs?: any[]
}

function parseDate(val: any): Date {
  if (!val) return new Date()
  const d = new Date(val)
  if (isNaN(d.getTime())) {
    return new Date()
  }
  return d
}

async function main() {
  console.log('Starting database seed...')

  // 1. Read data/content-store.json
  const storePath = path.join(process.cwd(), 'data', 'content-store.json')
  let storeData: ContentStoreJson = {}
  if (fs.existsSync(storePath)) {
    try {
      storeData = JSON.parse(fs.readFileSync(storePath, 'utf8'))
    } catch (err) {
      console.warn('Could not parse data/content-store.json, using seed fallback', err)
    }
  }

  // 2. Merge Categories (keyed by key)
  const categoryMap = new Map<string, any>()
  for (const cat of seedCategories) {
    categoryMap.set(cat.key, cat)
  }
  if (Array.isArray(storeData.categories)) {
    for (const cat of storeData.categories) {
      categoryMap.set(cat.key, { ...categoryMap.get(cat.key), ...cat })
    }
  }

  console.log(`Seeding ${categoryMap.size} categories...`)
  for (const cat of categoryMap.values()) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: {
        slug: cat.slug,
        name: cat.name,
        blurb: cat.blurb,
        image: cat.image,
        children: cat.children ?? [],
      },
      create: {
        key: cat.key,
        slug: cat.slug,
        name: cat.name,
        blurb: cat.blurb,
        image: cat.image,
        children: cat.children ?? [],
      },
    })
  }

  // 3. Merge Episodes (keyed by id)
  const episodeMap = new Map<string, any>()
  for (const ep of seedEpisodes) {
    episodeMap.set(ep.id, ep)
  }
  if (Array.isArray(storeData.episodes)) {
    for (const ep of storeData.episodes) {
      episodeMap.set(ep.id, { ...episodeMap.get(ep.id), ...ep })
    }
  }

  console.log(`Seeding ${episodeMap.size} episodes...`)
  for (const ep of episodeMap.values()) {
    const audioUrl = ep.formats?.find((f: any) => f.format === 'audio')?.href || null
    const videoUrl = ep.formats?.find((f: any) => f.format === 'video')?.href || null
    const thumbnailUrl = ep.image || null

    await prisma.episode.upsert({
      where: { id: ep.id },
      update: {
        slug: ep.slug,
        kind: ep.kind,
        releaseType: ep.releaseType || null,
        seriesTitle: ep.seriesTitle || null,
        seasonNumber: ep.seasonNumber ?? null,
        episodeNumber: ep.episodeNumber ?? null,
        totalEpisodes: ep.totalEpisodes ?? null,
        youtubeId: ep.youtubeId || null,
        audioUrl,
        videoUrl,
        thumbnailUrl,
        title: ep.title,
        show: ep.show,
        category: ep.category,
        durationMin: ep.durationMin ?? 0,
        image: ep.image,
        premium: Boolean(ep.premium),
        language: ep.language || 'hi',
        publishedAt: parseDate(ep.publishedAt),
        formats: ep.formats || [],
      },
      create: {
        id: ep.id,
        slug: ep.slug,
        kind: ep.kind,
        releaseType: ep.releaseType || null,
        seriesTitle: ep.seriesTitle || null,
        seasonNumber: ep.seasonNumber ?? null,
        episodeNumber: ep.episodeNumber ?? null,
        totalEpisodes: ep.totalEpisodes ?? null,
        youtubeId: ep.youtubeId || null,
        audioUrl,
        videoUrl,
        thumbnailUrl,
        title: ep.title,
        show: ep.show,
        category: ep.category,
        durationMin: ep.durationMin ?? 0,
        image: ep.image,
        premium: Boolean(ep.premium),
        language: ep.language || 'hi',
        publishedAt: parseDate(ep.publishedAt),
        formats: ep.formats || [],
      },
    })
  }

  // 4. Merge Stories (keyed by id)
  const storyMap = new Map<string, any>()
  for (const st of seedStories) {
    storyMap.set(st.id, st)
  }
  if (Array.isArray(storeData.stories)) {
    for (const st of storeData.stories) {
      storyMap.set(st.id, { ...storyMap.get(st.id), ...st })
    }
  }

  console.log(`Seeding ${storyMap.size} stories...`)
  for (const st of storyMap.values()) {
    await prisma.story.upsert({
      where: { id: st.id },
      update: {
        slug: st.slug,
        title: st.title,
        dek: st.dek,
        category: st.category,
        image: st.image,
        readMin: st.readMin ?? 3,
        publishedAt: parseDate(st.publishedAt),
        formats: st.formats || [],
      },
      create: {
        id: st.id,
        slug: st.slug,
        title: st.title,
        dek: st.dek,
        category: st.category,
        image: st.image,
        readMin: st.readMin ?? 3,
        publishedAt: parseDate(st.publishedAt),
        formats: st.formats || [],
      },
    })
  }

  // 5. Merge Shorts (keyed by id)
  const shortMap = new Map<string, any>()
  for (const sh of seedShorts) {
    shortMap.set(sh.id, sh)
  }
  if (Array.isArray(storeData.shorts)) {
    for (const sh of storeData.shorts) {
      shortMap.set(sh.id, { ...shortMap.get(sh.id), ...sh })
    }
  }

  console.log(`Seeding ${shortMap.size} shorts...`)
  for (const sh of shortMap.values()) {
    await prisma.short.upsert({
      where: { id: sh.id },
      update: {
        slug: sh.slug,
        title: sh.title,
        category: sh.category,
        durationSec: sh.durationSec ?? 30,
        image: sh.image,
        views: sh.views || '1M',
      },
      create: {
        id: sh.id,
        slug: sh.slug,
        title: sh.title,
        category: sh.category,
        durationSec: sh.durationSec ?? 30,
        image: sh.image,
        views: sh.views || '1M',
      },
    })
  }

  // 6. Merge LiveBlogs & LiveEntries
  const liveBlogMap = new Map<string, any>()
  for (const lb of seedLiveBlogs) {
    liveBlogMap.set(lb.id, lb)
  }
  if (Array.isArray(storeData.liveBlogs)) {
    for (const lb of storeData.liveBlogs) {
      liveBlogMap.set(lb.id, { ...liveBlogMap.get(lb.id), ...lb })
    }
  }

  console.log(`Seeding ${liveBlogMap.size} live blogs...`)
  for (const lb of liveBlogMap.values()) {
    await prisma.liveBlog.upsert({
      where: { id: lb.id },
      update: {
        slug: lb.slug,
        active: Boolean(lb.active),
        title: lb.title,
        category: lb.category,
      },
      create: {
        id: lb.id,
        slug: lb.slug,
        active: Boolean(lb.active),
        title: lb.title,
        category: lb.category,
      },
    })

    if (Array.isArray(lb.entries)) {
      for (const entry of lb.entries) {
        await prisma.liveEntry.upsert({
          where: { id: entry.id },
          update: {
            liveBlogId: lb.id,
            type: entry.type,
            at: parseDate(entry.at),
            body: entry.body || null,
            storyId: entry.storyId || null,
            shortId: entry.shortId || null,
          },
          create: {
            id: entry.id,
            liveBlogId: lb.id,
            type: entry.type,
            at: parseDate(entry.at),
            body: entry.body || null,
            storyId: entry.storyId || null,
            shortId: entry.shortId || null,
          },
        })
      }
    }
  }

  // 7. HeroConfig
  const heroData = storeData.hero || seedHero
  if (heroData && heroData.episodeId) {
    console.log('Seeding HeroConfig...')
    await prisma.heroConfig.upsert({
      where: { id: 'default' },
      update: {
        episodeId: heroData.episodeId,
        kicker: heroData.kicker,
        summary: heroData.summary,
      },
      create: {
        id: 'default',
        episodeId: heroData.episodeId,
        kicker: heroData.kicker,
        summary: heroData.summary,
      },
    })
  }

  // 8. Chapters
  const defaultChapters = [
    {
      id: 'ch-1',
      episodeId: 'ep-4',
      title: { hi: 'शुरुआत: सुबह की पहली किरण', en: 'Introduction: First Light' },
      start: 0,
    },
    {
      id: 'ch-2',
      episodeId: 'ep-4',
      title: { hi: 'चाय की खुशबू और यादें', en: 'Aroma of Chai & Memories' },
      start: 12,
    },
    {
      id: 'ch-3',
      episodeId: 'ep-4',
      title: { hi: 'जागता हुआ शहर', en: 'The Awakening City' },
      start: 25,
    },
    {
      id: 'ch-4',
      episodeId: 'ep-4',
      title: { hi: 'दिन की नई शुरुआत', en: 'A Fresh Beginning' },
      start: 40,
    },
  ]

  for (const ch of defaultChapters) {
    if (episodeMap.has(ch.episodeId)) {
      await prisma.chapter.upsert({
        where: { id: ch.id },
        update: {
          episodeId: ch.episodeId,
          title: ch.title,
          start: ch.start,
        },
        create: {
          id: ch.id,
          episodeId: ch.episodeId,
          title: ch.title,
          start: ch.start,
        },
      })
    }
  }

  // 9. Transcripts from sampleTranscripts
  console.log('Seeding Transcripts...')
  for (const [slug, lines] of Object.entries(sampleTranscripts)) {
    const episode = Array.from(episodeMap.values()).find((e) => e.slug === slug)
    if (!episode) continue

    for (const line of lines) {
      await prisma.transcriptLine.upsert({
        where: { id: line.id },
        update: {
          episodeId: episode.id,
          start: line.start,
          end: line.end,
          speaker: line.speaker || null,
          hi: line.hi,
          en: line.en,
        },
        create: {
          id: line.id,
          episodeId: episode.id,
          start: line.start,
          end: line.end,
          speaker: line.speaker || null,
          hi: line.hi,
          en: line.en,
        },
      })
    }
  }

  // 10. Sample Comments
  console.log('Seeding Sample Comments...')
  const sampleComments = [
    {
      id: 'ep-1-c1',
      contentId: 'ep-1',
      parentId: null,
      authorName: 'आदित्य वर्मा (Aaditya Verma)',
      userId: null,
      body: 'यह दृष्टिकोण वाकई आँखें खोल देने वाला है! कॉर्नर कोना की स्टोरीटेलिंग बाकी सभी न्यूज़ पोर्टल्स से कहीं बेहतर है।',
      likes: 24,
      reported: false,
      status: 'approved',
    },
    {
      id: 'ep-1-c1-r1',
      contentId: 'ep-1',
      parentId: 'ep-1-c1',
      authorName: 'प्रिया नायर (Priya Nair)',
      userId: null,
      body: 'बिल्कुल सहमत हूँ! ऑडियो फॉर्मेट में सुनने पर यह और भी गहरा प्रभाव छोड़ता है।',
      likes: 8,
      reported: false,
      status: 'approved',
    },
    {
      id: 'ep-1-c2',
      contentId: 'ep-1',
      parentId: null,
      authorName: 'कबीर मेहता (Kabir Mehta)',
      userId: null,
      body: 'कहानियों को इस तरह संजोना कि युवा पीढ़ी भी जुड़ सके, यही आज के दौर की सबसे बड़ी ज़रूरत है।',
      likes: 19,
      reported: false,
      status: 'approved',
    },
  ]

  for (const c of sampleComments) {
    await prisma.comment.upsert({
      where: { id: c.id },
      update: {
        contentId: c.contentId,
        parentId: c.parentId,
        authorName: c.authorName,
        userId: c.userId,
        body: c.body,
        likes: c.likes,
        reported: c.reported,
        status: c.status,
      },
      create: {
        id: c.id,
        contentId: c.contentId,
        parentId: c.parentId,
        authorName: c.authorName,
        userId: c.userId,
        body: c.body,
        likes: c.likes,
        reported: c.reported,
        status: c.status,
      },
    })
  }

  // 11. Sample Listening Progress
  console.log('Seeding Sample Listening Progress...')
  await prisma.listeningProgress.upsert({
    where: {
      visitorId_episodeId: {
        visitorId: 'demo-visitor-101',
        episodeId: 'ep-1',
      },
    },
    update: {
      positionSec: 145.0,
    },
    create: {
      visitorId: 'demo-visitor-101',
      episodeId: 'ep-1',
      positionSec: 145.0,
    },
  })

  // 12. Sample Newsletter Subscriber
  console.log('Seeding Newsletter Subscriber...')
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'subscriber@cornerkona.com' },
    update: {},
    create: {
      email: 'subscriber@cornerkona.com',
    },
  })

  // 13. Report Row Counts
  console.log('\n--- ROW COUNTS PER TABLE ---')
  const counts = {
    Category: await prisma.category.count(),
    Episode: await prisma.episode.count(),
    Story: await prisma.story.count(),
    Short: await prisma.short.count(),
    LiveBlog: await prisma.liveBlog.count(),
    LiveEntry: await prisma.liveEntry.count(),
    HeroConfig: await prisma.heroConfig.count(),
    Chapter: await prisma.chapter.count(),
    TranscriptLine: await prisma.transcriptLine.count(),
    Comment: await prisma.comment.count(),
    ListeningProgress: await prisma.listeningProgress.count(),
    NewsletterSubscriber: await prisma.newsletterSubscriber.count(),
  }

  console.table(counts)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
