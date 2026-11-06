import { notFound } from 'next/navigation'
import { EpisodePage } from '@/components/pages/episode-page'
import { getEpisode } from '@/lib/content/repository'

export default async function HindiAntarYatraEpisodeRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ view?: string }>
}) {
  const { slug } = await params
  const { view } = await searchParams
  const episode = await getEpisode(slug)
  if (!episode) notFound()
  return <EpisodePage locale="hi" episode={episode} view={view} />
}
