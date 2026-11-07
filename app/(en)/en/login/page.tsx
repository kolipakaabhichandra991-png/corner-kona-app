import { Suspense } from 'react'
import { LoginPage } from '@/components/pages/login-page'

export default function EnglishLoginRoute() {
  return (
    <Suspense>
      <LoginPage locale="en" />
    </Suspense>
  )
}