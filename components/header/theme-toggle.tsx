'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full transition-transform duration-300 hover:rotate-45 active:scale-90', className)}
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="size-5 transition-transform duration-500 dark:hidden text-amber-500" aria-hidden="true" />
      <Moon className="hidden size-5 transition-transform duration-500 dark:block text-purple-400" aria-hidden="true" />
    </Button>
  )
}
