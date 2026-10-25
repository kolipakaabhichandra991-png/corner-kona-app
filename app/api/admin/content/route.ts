import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { addEpisode, addShort, addStory, deleteEpisode, deleteShort, deleteStory, loadStore } from '@/lib/content/store'
import type { Episode, Short, Story } from '@/lib/content/types'

function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post'
  )
}

export async function GET() {
  try {
    const store = loadStore()
    return NextResponse.json({
      success: true,
      stats: {
        totalShorts: store.shorts.length,
        totalStories: store.stories.length,
        totalEpisodes: store.episodes.length,
        totalCategories: store.categories.length,
      },
      shorts: store.shorts,
      stories: store.stories,
      episodes: store.episodes,
      categories: store.categories,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ success: false, error: 'Type and data are required' }, { status: 400 })
    }

    if (type === 'short') {
      const { titleHi, titleEn, category, durationSec, image, views } = data

      if (!titleHi && !titleEn) {
        return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
      }

      const slugBase = generateSlug(titleEn || titleHi)
      const slug = `${slugBase}-${Date.now().toString().slice(-4)}`

      const newShort: Short = {
        id: `sh-${Date.now()}`,
        slug,
        title: {
          hi: titleHi || titleEn,
          en: titleEn || titleHi,
        },
        category: category || 'sports',
        durationSec: Number(durationSec) || 35,
        image: image || '/images/hero-podcast.png',
        views: views || '1.0K',
      }

      addShort(newShort)
      revalidatePath('/', 'layout')
      return NextResponse.json({ success: true, item: newShort, message: 'Short video posted successfully!' })
    }

    if (type === 'story') {
      const { titleHi, titleEn, dekHi, dekEn, category, readMin, image } = data

      if (!titleHi && !titleEn) {
        return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
      }

      const slugBase = generateSlug(titleEn || titleHi)
      const slug = `${slugBase}-${Date.now().toString().slice(-4)}`

      const newStory: Story = {
        id: `st-${Date.now()}`,
        slug,
        title: {
          hi: titleHi || titleEn,
          en: titleEn || titleHi,
        },
        dek: {
          hi: dekHi || 'कोना एक्सक्लूसिव रिसर्च और विश्लेषण',
          en: dekEn || 'Corner Kona exclusive research and analysis',
        },
        category: category || 'news',
        readMin: Number(readMin) || 5,
        image: image || '/images/geo-summit.png',
        publishedAt: 'अभी-अभी • Just now',
        formats: [{ format: 'article', href: `/stories/${slug}` }],
      }

      addStory(newStory)
      revalidatePath('/', 'layout')
      return NextResponse.json({ success: true, item: newStory, message: 'Story posted successfully!' })
    }

    if (type === 'episode') {
      const { titleHi, titleEn, showHi, showEn, category, kind, durationMin, image, premium } = data

      if (!titleHi && !titleEn) {
        return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
      }

      const slugBase = generateSlug(titleEn || titleHi)
      const slug = `${slugBase}-${Date.now().toString().slice(-4)}`

      const newEpisode: Episode = {
        id: `ep-${Date.now()}`,
        slug,
        kind: kind === 'audiobook' ? 'audiobook' : 'podcast',
        title: {
          hi: titleHi || titleEn,
          en: titleEn || titleHi,
        },
        show: {
          hi: showHi || 'कोना टॉक्स',
          en: showEn || 'Kona Talks',
        },
        category: category || 'sports',
        durationMin: Number(durationMin) || 30,
        image: image || '/images/hero-podcast.png',
        premium: Boolean(premium),
        language: 'hi',
        publishedAt: 'अभी-अभी • Just now',
        formats: [
          { format: 'audio', href: `/podcasts/${slug}` },
          { format: 'video', href: `/podcasts/${slug}?view=video` },
        ],
      }

      addEpisode(newEpisode)
      revalidatePath('/', 'layout')
      return NextResponse.json({ success: true, item: newEpisode, message: 'Podcast/Episode posted successfully!' })
    }

    return NextResponse.json({ success: false, error: 'Unknown content type' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Type and id are required' }, { status: 400 })
    }

    let success = false
    if (type === 'short') success = deleteShort(id)
    else if (type === 'story') success = deleteStory(id)
    else if (type === 'episode') success = deleteEpisode(id)

    if (success) {
      revalidatePath('/', 'layout')
      return NextResponse.json({ success: true, message: `Deleted ${type} ${id}` })
    } else {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
