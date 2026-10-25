import fs from 'fs'
import path from 'path'
import { categories, episodes, hero, liveBlogs, shorts, stories } from './seed'
import type { Category, Episode, Hero, LiveBlog, Short, Story } from './types'

export interface ContentStoreData {
  categories: Category[]
  episodes: Episode[]
  stories: Story[]
  shorts: Short[]
  hero: Hero
  liveBlogs: LiveBlog[]
}

const STORE_PATH = path.join(process.cwd(), 'data', 'content-store.json')

// In-memory cache for fast SSR access
let memoryStore: ContentStoreData | null = null

function getInitialData(): ContentStoreData {
  return {
    categories,
    episodes,
    stories,
    shorts,
    hero,
    liveBlogs,
  }
}

export function loadStore(): ContentStoreData {
  if (memoryStore) return memoryStore

  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8')
      const parsed = JSON.parse(raw)
      // Merge with seed categories to make sure all 12 categories are always present
      memoryStore = {
        ...getInitialData(),
        ...parsed,
        categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : categories,
      }
      return memoryStore
    }
  } catch (err) {
    console.error('Error reading content-store.json, using seed fallback:', err)
  }

  // Fallback to seed and initialize file
  memoryStore = getInitialData()
  saveStore(memoryStore)
  return memoryStore
}

export function saveStore(data: ContentStoreData) {
  memoryStore = data
  try {
    const dir = path.dirname(STORE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving to content-store.json:', err)
  }
}

export function addShort(newShort: Short): Short {
  const store = loadStore()
  // Add new short at the beginning of shorts list
  const updatedShorts = [newShort, ...store.shorts.filter((s) => s.id !== newShort.id)]
  saveStore({
    ...store,
    shorts: updatedShorts,
  })
  return newShort
}

export function deleteShort(id: string): boolean {
  const store = loadStore()
  const exists = store.shorts.some((s) => s.id === id)
  if (!exists) return false
  saveStore({
    ...store,
    shorts: store.shorts.filter((s) => s.id !== id),
  })
  return true
}

export function addStory(newStory: Story): Story {
  const store = loadStore()
  const updatedStories = [newStory, ...store.stories.filter((s) => s.id !== newStory.id)]
  saveStore({
    ...store,
    stories: updatedStories,
  })
  return newStory
}

export function deleteStory(id: string): boolean {
  const store = loadStore()
  const exists = store.stories.some((s) => s.id === id)
  if (!exists) return false
  saveStore({
    ...store,
    stories: store.stories.filter((s) => s.id !== id),
  })
  return true
}

export function addEpisode(newEpisode: Episode): Episode {
  const store = loadStore()
  const updatedEpisodes = [newEpisode, ...store.episodes.filter((e) => e.id !== newEpisode.id)]
  saveStore({
    ...store,
    episodes: updatedEpisodes,
  })
  return newEpisode
}

export function deleteEpisode(id: string): boolean {
  const store = loadStore()
  const exists = store.episodes.some((e) => e.id === id)
  if (!exists) return false
  saveStore({
    ...store,
    episodes: store.episodes.filter((e) => e.id !== id),
  })
  return true
}
