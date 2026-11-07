import { auth } from '@/auth'
import { ProfilePage } from '@/components/pages/profile-page'
import { redirect } from 'next/navigation'

export default async function EnglishProfileRoute() {
  const session = await auth()

  if (!session?.user) {
    redirect('/en/login')
  }

  return <ProfilePage locale="en" user={session.user} />
}
