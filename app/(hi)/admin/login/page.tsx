import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminLogin } from '@/components/admin/admin-login'

export const metadata = {
  title: 'Admin Portal Login | Corner Kona',
  description: 'Corner Kona Administrator Login',
}

export default async function AdminLoginRoute() {
  const cookieStore = await cookies()
  const token = cookieStore.get('corner_kona_admin_token')?.value

  if (token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
      if (decoded && decoded.user) {
        redirect('/admin')
      }
    } catch {
      // invalid token, show login
    }
  }

  return <AdminLogin />
}
