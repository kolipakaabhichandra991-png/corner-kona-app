import { notFound } from 'next/navigation'
import { CategoryPage } from '@/components/pages/category-page'
import { getCategory } from '@/lib/content/repository'

export default async function HindiCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = await getCategory(category)
  if (!cat) notFound()
  return <CategoryPage locale="hi" category={cat} />
}
