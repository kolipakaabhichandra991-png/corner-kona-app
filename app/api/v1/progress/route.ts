import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVisitor, withVisitorCookie } from '@/lib/visitor'

const MAX_SECONDS = 172_800 // 48 hours

async function resolveEpisodeId(episodeId?: string | null, slug?: string | null): Promise<string | null> {
  if (episodeId) {
    const ep = await prisma.episode.findUnique({ where: { id: episodeId }, select: { id: true } })
    return ep?.id ?? null
  }
  if (slug) {
    const ep = await prisma.episode.findUnique({ where: { slug }, select: { id: true } })
    return ep?.id ?? null
  }
  return null
}

/** GET /api/v1/progress?episodeId=...  (or ?slug=...) -> { data: { positionSec } | null } */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const visitor = await getVisitor()
    const episodeId = await resolveEpisodeId(searchParams.get('episodeId'), searchParams.get('slug'))
    if (!episodeId) return withVisitorCookie(NextResponse.json({ error: 'episode_not_found' }, { status: 404 }), visitor)

    const row = await prisma.listeningProgress.findUnique({
      where: { visitorId_episodeId: { visitorId: visitor.id, episodeId } },
    })
    const data = row ? { episodeId, positionSec: row.positionSec, updatedAt: row.updatedAt.toISOString() } : null
    return withVisitorCookie(NextResponse.json({ data }), visitor)
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

/** PUT /api/v1/progress  { episodeId | slug, positionSec } -> saves where this visitor stopped. */
export async function PUT(req: Request) {
  try {
    const visitor = await getVisitor()
    const input = await req.json().catch(() => null)
    const positionSec = input?.positionSec
    if (typeof positionSec !== 'number' || !Number.isFinite(positionSec) || positionSec < 0 || positionSec > MAX_SECONDS) {
      return withVisitorCookie(NextResponse.json({ error: 'invalid_position' }, { status: 422 }), visitor)
    }

    const episodeId = await resolveEpisodeId(
      typeof input?.episodeId === 'string' ? input.episodeId : null,
      typeof input?.slug === 'string' ? input.slug : null,
    )
    if (!episodeId) return withVisitorCookie(NextResponse.json({ error: 'episode_not_found' }, { status: 404 }), visitor)

    await prisma.listeningProgress.upsert({
      where: { visitorId_episodeId: { visitorId: visitor.id, episodeId } },
      create: { visitorId: visitor.id, episodeId, positionSec },
      update: { positionSec },
    })
    return withVisitorCookie(NextResponse.json({ data: { saved: true } }), visitor)
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
