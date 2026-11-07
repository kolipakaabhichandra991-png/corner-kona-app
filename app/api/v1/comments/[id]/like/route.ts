import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/current-user'
import { VISIBLE_STATUSES } from '@/lib/comments'

/** POST /api/v1/comments/[id]/like -> toggles the logged-in user's like. */
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'login_required' }, { status: 401 })

    const { id } = await ctx.params
    const comment = await prisma.comment.findUnique({ where: { id }, select: { id: true, status: true } })
    if (!comment || !VISIBLE_STATUSES.includes(comment.status)) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.commentLike.findUnique({
        where: { commentId_userId: { commentId: id, userId: user.id } },
      })
      if (existing) {
        await tx.commentLike.delete({ where: { id: existing.id } })
        const updated = await tx.comment.update({
          where: { id },
          data: { likes: { decrement: 1 } },
          select: { likes: true },
        })
        return { liked: false, likes: Math.max(0, updated.likes) }
      }
      await tx.commentLike.create({ data: { commentId: id, userId: user.id } })
      const updated = await tx.comment.update({
        where: { id },
        data: { likes: { increment: 1 } },
        select: { likes: true },
      })
      return { liked: true, likes: updated.likes }
    })

    return NextResponse.json({ data: result })
  } catch (e) {
    // Two clicks at the same instant can collide on the unique rule; ask the client to retry.
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'try_again' }, { status: 409 })
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
