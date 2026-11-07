import { redirect } from 'next/navigation'
import { loadStore } from '@/lib/content/store'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { getAdminSession } from '@/lib/auth/admin'

export const metadata = {
  title: 'Admin Portal Console | Corner Kona',
  description: 'Corner Kona Administrator Management Portal',
}

export default async function AdminDashboardRoute() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  const store = loadStore()

  return (
    <AdminDashboard
      initialCategories={store.categories}
      initialShorts={store.shorts}
      initialStories={store.stories}
      initialEpisodes={store.episodes}
    />
  )
}
