import { NextResponse } from 'next/server'
import { getActiveLiveBlog, resolveLiveBlog } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET() {
  const blog = await getActiveLiveBlog()
  return NextResponse.json({ data: blog ? resolveLiveBlog(blog) : null })
}
