import { redirect } from 'next/navigation'
import { AdminLogin } from '@/components/admin/admin-login'
import { getAdminSession } from '@/lib/auth/admin'

export const metadata = {
  title: 'Admin Portal Login | Corner Kona',
  description: 'Corner Kona Administrator Login',
}

export default async function AdminLoginRoute() {
  const session = await getAdminSession()

  if (session) {
    redirect('/admin')
  }

  return <AdminLogin />
}
