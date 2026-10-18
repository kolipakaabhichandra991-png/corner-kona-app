'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, Check, Radio, Sparkles, UserRound } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export function HeaderActions({ locale, t }: { locale: Locale; t: Dictionary }) {
  const isHi = locale === 'hi'
  const [unreadCount, setUnreadCount] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    {
      id: 1,
      title: isHi ? 'भारत बनाम ऑस्ट्रेलिया: लाइव ब्लॉग शुरू' : 'India vs Australia: Live Blog is now active',
      time: isHi ? '10 मिनट पहले' : '10m ago',
      href: localePath(locale, '/live/india-vs-australia-live'),
      isLive: true,
    },
    {
      id: 2,
      title: isHi ? 'नया एपिसोड: गली से वर्ल्ड कप तक' : 'New Episode: From Gully to World Cup',
      time: isHi ? '2 घंटे पहले' : '2h ago',
      href: localePath(locale, '/podcasts/gully-se-world-cup'),
    },
    {
      id: 3,
      title: isHi ? 'अंतर यात्रा: मन का मौन रिलीज़ हुआ' : 'Antar Yatra: Silence of the Mind released',
      time: isHi ? '1 दिन पहले' : '1d ago',
      href: localePath(locale, '/antar-yatra/mann-ka-maun'),
      isPremium: true,
    },
  ]

  return (
    <>
      {/* Search Button with hover animation */}
      <Link
        href={localePath(locale, '/search')}
        aria-label={t.nav.search}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'rounded-full transition-transform hover:scale-110 active:scale-95'
        )}
      >
        <Search className="size-5" aria-hidden="true" />
      </Link>

      {/* Notifications Popover */}
      <div ref={notifRef} className="relative hidden sm:inline-block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative rounded-full transition-transform hover:scale-110 active:scale-95"
          aria-label={`${t.nav.notifications} (${unreadCount})`}
        >
          <Bell className="size-5 transition-transform group-hover:rotate-12" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-live px-1 text-[10px] leading-4 font-bold text-white shadow-sm shadow-red-500/50 animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/80 bg-card p-3 shadow-2xl backdrop-blur animate-rise z-50">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 px-1">
              <span className="font-display font-extrabold text-sm">{t.nav.notifications}</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => setUnreadCount(0)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <Check className="size-3" />
                  {isHi ? 'सब पढ़ें' : 'Mark all read'}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setShowNotifications(false)}
                  className="flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-muted text-left"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    {n.isLive ? (
                      <Radio className="size-3.5 text-red-500 animate-pulse" />
                    ) : n.isPremium ? (
                      <Sparkles className="size-3.5 text-amber-500" />
                    ) : (
                      <Bell className="size-3.5" />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-snug">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <ThemeToggle label={t.nav.toggleTheme} className="hidden md:inline-flex" />

      {/* Profile/Account Button */}
      <Link
        href={localePath(locale, '/profile')}
        aria-label={t.nav.profile}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'hidden rounded-full transition-transform hover:scale-110 active:scale-95 sm:inline-flex'
        )}
      >
        <UserRound className="size-5" aria-hidden="true" />
      </Link>
    </>
  )
}
