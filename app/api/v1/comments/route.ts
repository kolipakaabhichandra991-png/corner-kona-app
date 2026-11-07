import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/current-user'
import { MAX_COMMENT_LENGTH, VISIBLE_STATUSES, toDTO, toTree } from '@/lib/comments'

/** GET /api/v1/comments?contentId=...&sort=newest|top  -> public, only approved/reported comments */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const contentId = (searchParams.get('contentId') ?? '').trim()
    const sort = searchParams.get('sort') === 'top' ? 'top' : 'newest'
    if (!contentId || contentId.length > 200) {
      return NextResponse.json({ error: 'invalid_content_id' }, { status: 422 })
    }

    const rows = await prisma.comment.findMany({
      where: { contentId, status: { in: VISIBLE_STATUSES } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    let liked = new Set<string>()
    const user = await getCurrentUser()
    if (user && rows.length > 0) {
      const likes = await prisma.commentLike.findMany({
        where: { userId: user.id, commentId: { in: rows.map((r) => r.id) } },
        select: { commentId: true },
      })
      liked = new Set(likes.map((l) => l.commentId))
    }

    return NextResponse.json({ data: toTree(rows, liked, sort) })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

/** POST /api/v1/comments  { contentId, body, parentId? }  -> logged-in users only */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'login_required' }, { status: 401 })

    const input = await req.json().catch(() => null)
    const contentId = typeof input?.contentId === 'string' ? input.contentId.trim() : ''
    const text = typeof input?.body === 'string' ? input.body.trim() : ''
    const parentId = typeof input?.parentId === 'string' && input.parentId ? input.parentId : null

    if (!contentId || contentId.length > 200) {
      return NextResponse.json({ error: 'invalid_content_id' }, { status: 422 })
    }
    if (!text || text.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json({ error: 'invalid_body' }, { status: 422 })
    }

    // Basic rate limit: at most 5 comments per user per minute.
    const recent = await prisma.comment.count({
      where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 60_000) } },
    })
    if (recent >= 5) {
      return NextResponse.json({ error: 'too_many_comments' }, { status: 429 })
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { contentId: true, status: true },
      })
      if (!parent || parent.contentId !== contentId || !VISIBLE_STATUSES.includes(parent.status)) {
        return NextResponse.json({ error: 'invalid_parent' }, { status: 422 })
      }
    }

    const created = await prisma.comment.create({
      data: { contentId, parentId, authorName: user.name, userId: user.id, body: text },
    })
    return NextResponse.json({ data: toDTO(created, new Set()) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
