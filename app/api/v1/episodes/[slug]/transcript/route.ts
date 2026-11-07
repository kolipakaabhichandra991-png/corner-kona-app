import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTranscriptForSlug } from '@/lib/content/transcripts'

/** GET /api/v1/episodes/[slug]/transcript -> transcript lines + chapters (falls back to the generated transcript). */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await ctx.params
    const episode = await prisma.episode.findUnique({ where: { slug }, select: { id: true, title: true } })
    if (!episode) return NextResponse.json({ error: 'episode_not_found' }, { status: 404 })

    const [lines, chapters] = await Promise.all([
      prisma.transcriptLine.findMany({ where: { episodeId: episode.id }, orderBy: { start: 'asc' } }),
      prisma.chapter.findMany({ where: { episodeId: episode.id }, orderBy: { start: 'asc' } }),
    ])

    const title = episode.title as { hi?: string; en?: string } | null
    const data =
      lines.length > 0
        ? lines.map((l) => ({
            id: l.id,
            start: l.start,
            end: l.end,
            speaker: l.speaker ?? undefined,
            hi: l.hi,
            en: l.en,
          }))
        : getTranscriptForSlug(slug, title?.hi ?? '', title?.en ?? '')

    return NextResponse.json({
      data: {
        source: lines.length > 0 ? 'database' : 'generated',
        lines: data,
        chapters: chapters.map((c) => ({ id: c.id, title: c.title, start: c.start })),
      },
    })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
