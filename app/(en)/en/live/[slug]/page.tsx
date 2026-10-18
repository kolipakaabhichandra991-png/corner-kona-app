import { notFound } from 'next/navigation'
import { LivePage } from '@/components/pages/live-page'
import { getLiveBlog } from '@/lib/content/repository'

export default async function EnglishLiveRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getLiveBlog(slug)
  if (!blog) notFound()
  return <LivePage locale="en" blog={blog} />
}
