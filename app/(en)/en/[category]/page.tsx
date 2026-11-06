import { notFound } from 'next/navigation'
import { CategoryPage } from '@/components/pages/category-page'
import { getCategory } from '@/lib/content/repository'

export default async function EnglishCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = await getCategory(category)
  if (!cat) notFound()
  return <CategoryPage locale="en" category={cat} />
}
