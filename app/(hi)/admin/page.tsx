import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loadStore } from '@/lib/content/store'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata = {
  title: 'Admin Portal Console | Corner Kona',
  description: 'Corner Kona Administrator Management Portal',
}

export default async function AdminDashboardRoute() {
  const cookieStore = await cookies()
  const token = cookieStore.get('corner_kona_admin_token')?.value

  if (!token) {
    redirect('/admin/login')
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    if (!decoded || !decoded.user) {
      redirect('/admin/login')
    }
  } catch {
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
