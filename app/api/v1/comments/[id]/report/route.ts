import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/current-user'
import { VISIBLE_STATUSES } from '@/lib/comments'

/** POST /api/v1/comments/[id]/report  { reason? } -> one report per user per comment. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'login_required' }, { status: 401 })

    const { id } = await ctx.params
    const input = await req.json().catch(() => null)
    const reason =
      typeof input?.reason === 'string' && input.reason.trim() ? input.reason.trim().slice(0, 300) : null

    const comment = await prisma.comment.findUnique({ where: { id }, select: { id: true, status: true } })
    if (!comment || !VISIBLE_STATUSES.includes(comment.status)) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.commentReport.upsert({
        where: { commentId_userId: { commentId: id, userId: user.id } },
        create: { commentId: id, userId: user.id, reason },
        update: {},
      }),
      // Only an approved comment flips to "reported"; spam/deleted stay as the admin set them.
      prisma.comment.updateMany({
        where: { id, status: 'approved' },
        data: { status: 'reported', reported: true },
      }),
    ])

    return NextResponse.json({ data: { reported: true } })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
