import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth/admin'

const STATUSES = ['approved', 'reported', 'spam', 'deleted']

/** GET /api/admin/comments?status=all|approved|reported|spam|deleted&contentId=... -> admin only */
export async function GET(req: Request) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'admin_required' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'all'
    const contentId = (searchParams.get('contentId') ?? '').trim()
    if (status !== 'all' && !STATUSES.includes(status)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 422 })
    }

    const where = {
      ...(status !== 'all' ? { status } : {}),
      ...(contentId ? { contentId } : {}),
    }

    const [rows, grouped] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
        include: { _count: { select: { commentReports: true } } },
      }),
      prisma.comment.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const counts: Record<string, number> = { approved: 0, reported: 0, spam: 0, deleted: 0 }
    for (const g of grouped) counts[g.status] = g._count._all

    return NextResponse.json({
      data: rows.map((r) => ({
        id: r.id,
        contentId: r.contentId,
        parentId: r.parentId,
        authorName: r.authorName,
        userId: r.userId,
        body: r.body,
        likes: r.likes,
        status: r.status,
        reportCount: r._count.commentReports,
        createdAt: r.createdAt.toISOString(),
      })),
      counts,
    })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
