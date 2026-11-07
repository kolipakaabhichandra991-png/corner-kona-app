import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth/admin'

const ACTIONS = { approve: 'approved', spam: 'spam', delete: 'deleted' } as const
type Action = keyof typeof ACTIONS

async function applyAction(id: string, action: Action, adminName: string, note: string | null) {
  const existing = await prisma.comment.findUnique({ where: { id }, select: { id: true } })
  if (!existing) return null

  const status = ACTIONS[action]
  await prisma.$transaction([
    prisma.comment.update({
      where: { id },
      data: { status, reported: action === 'approve' ? false : undefined },
    }),
    prisma.moderationAction.create({ data: { commentId: id, action, adminName, note } }),
  ])
  return { id, status }
}

/** PATCH /api/admin/comments/[id]  { action: 'approve' | 'spam' | 'delete', note? } -> admin only */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'admin_required' }, { status: 401 })

    const { id } = await ctx.params
    const input = await req.json().catch(() => null)
    const action = input?.action as Action
    if (!action || !(action in ACTIONS)) {
      return NextResponse.json({ error: 'invalid_action' }, { status: 422 })
    }
    const note = typeof input?.note === 'string' && input.note.trim() ? input.note.trim().slice(0, 300) : null

    const result = await applyAction(id, action, admin.user, note)
    if (!result) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

/** DELETE /api/admin/comments/[id] -> soft delete (status "deleted"), logged in ModerationAction. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'admin_required' }, { status: 401 })

    const { id } = await ctx.params
    const result = await applyAction(id, 'delete', admin.user, null)
    if (!result) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
