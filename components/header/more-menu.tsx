'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bell, Search, Sparkles } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { categories } from '@/lib/content/seed'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { sectionStyle } from '@/lib/sections'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export function MoreMenu({ locale, t, children }: { locale: Locale; t: Dictionary; children: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children} />
      <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-3xl pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">{t.nav.more}</SheetTitle>
          <SheetDescription className="sr-only">{t.mega.categories}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-4">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={localePath(locale, `/${c.slug}`)}
                onClick={close}
                className="flex items-center gap-2.5 rounded-xl border p-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <span className={cn('size-3 rounded-full', sectionStyle[c.key].bg)} aria-hidden="true" />
                {c.name[locale]}
              </Link>
            ))}
            <Link
              href={locale === 'en' ? '/' : '/en'}
              onClick={close}
              className="flex items-center gap-2.5 rounded-xl border-2 border-english p-3 text-sm font-bold text-english"
            >
              {t.nav.englishLabel}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={localePath(locale, '/search')}
              onClick={close}
              className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 rounded-full')}
            >
              <Search className="size-4" aria-hidden="true" />
              {t.nav.search}
            </Link>
            <Button variant="outline" className="flex-1 rounded-full">
              <Bell className="size-4" aria-hidden="true" />
              {t.nav.notifications}
            </Button>
            <ThemeToggle label={t.nav.toggleTheme} className="border" />
          </div>
          <Link
            href={localePath(locale, '/antar-yatra')}
            onClick={close}
            className={cn(buttonVariants({ size: 'lg', variant: 'brand' }), 'rounded-full font-bold shadow-md')}
          >
            <Sparkles className="size-4 mr-2 text-amber-300" />
            {t.nav.antarYatra} · {locale === 'hi' ? 'प्रीमियम मेंबरशिप' : 'Patron Membership'}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
