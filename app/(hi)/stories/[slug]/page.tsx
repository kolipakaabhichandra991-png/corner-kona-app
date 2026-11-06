import { notFound } from 'next/navigation'
import { StoryPage } from '@/components/pages/story-page'
import { getCategory, getStories } from '@/lib/content/repository'

export default async function HindiStoryDirectRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const stories = await getStories()
  const story = stories.find((s) => s.slug === slug)
  if (!story) notFound()

  const cat = await getCategory(story.category)
  if (!cat) notFound()

  return <StoryPage locale="hi" story={story} category={cat} />
}
