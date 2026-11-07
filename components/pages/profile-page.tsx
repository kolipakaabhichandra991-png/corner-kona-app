'use client'

import { signOut } from 'next-auth/react'
import { LogOut, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { localePath, type Locale } from '@/lib/i18n'

interface ProfilePageProps {
  locale: Locale
  user: {
    name?: string | null
    email?: string | null
  }
}

export function ProfilePage({ locale, user }: ProfilePageProps) {
  const isHi = locale === 'hi'

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 md:px-6 md:py-16">
      <div className="flex items-center gap-4 rounded-3xl border bg-card p-6 shadow-lg">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#9333EA]/20 to-[#0EA5E9]/20 text-primary">
          <UserRound className="size-7" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black">
            {user.name || (isHi ? 'आपका अकाउंट' : 'Your account')}
          </h1>
          {user.email && <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>}
        </div>
      </div>
      <Button
        variant="outline"
        className="w-fit gap-2 rounded-full"
        onClick={() => signOut({ redirectTo: localePath(locale, '/login') })}
      >
        <LogOut className="size-4" aria-hidden="true" />
        {isHi ? 'साइन आउट करें' : 'Sign out'}
      </Button>
    </section>
  )
}
