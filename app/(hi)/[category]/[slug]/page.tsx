import { notFound } from 'next/navigation'
import { StoryPage } from '@/components/pages/story-page'
import { getCategory, getStory } from '@/lib/content/repository'

export default async function HindiCategoryStoryRoute({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const cat = await getCategory(category)
  if (!cat) notFound()

  const story = await getStory(category, slug)
  if (!story) notFound()

  return <StoryPage locale="hi" story={story} category={cat} />
}
