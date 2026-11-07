import { Suspense } from 'react'
import { LoginPage } from '@/components/pages/login-page'

export default function HindiLoginRoute() {
  return (
    <Suspense>
      <LoginPage locale="hi" />
    </Suspense>
  )
}