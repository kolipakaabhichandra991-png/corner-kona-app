import { notFound } from 'next/navigation'
import { ShortPage } from '@/components/pages/short-page'
import { getShort } from '@/lib/content/repository'

export default async function EnglishVideoDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const short = await getShort(slug)
  if (!short) notFound()
  return <ShortPage locale="en" short={short} />
}
