'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Search, Check, Radio, Sparkles, UserRound } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { localePath, type Dictionary, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { FloatingSearchTab } from '@/components/search/floating-search-tab'

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

  const clearNotifications = () => {
    setUnreadCount(0)
  }

  return (
    <>
      <FloatingSearchTab locale={locale} t={t} />

      {/* Notification Bell with Dropdown */}
      <div className="relative" ref={notifRef}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t.nav.notifications}
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative rounded-full transition-transform hover:scale-110 active:scale-95"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1.5 right-1.5 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sports opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-sports" />
            </span>
          )}
        </Button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-popover/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 z-50">
            <div className="flex items-center justify-between border-b pb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.nav.notifications}
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <Check className="size-3" />
                  {isHi ? 'सब पढ़ा हुआ' : 'Mark all read'}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setShowNotifications(false)}
                  className="flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-muted"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                    {n.isLive ? (
                      <Radio className="size-3.5 text-rose-500 animate-pulse" />
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
