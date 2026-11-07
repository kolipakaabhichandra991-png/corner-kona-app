import { auth } from '@/auth'
import { ProfilePage } from '@/components/pages/profile-page'
import { redirect } from 'next/navigation'

export default async function HindiProfileRoute() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <ProfilePage locale="hi" user={session.user} />
}
