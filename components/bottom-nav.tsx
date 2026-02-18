"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookOpen, List, Search, User } from "lucide-react"

const tabs = [
  { href: "/album", label: "My Album", icon: BookOpen },
  { href: "/lists", label: "Lists", icon: List },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
]

interface BottomNavProps {
  currentPath: string
}

export function BottomNav({ currentPath }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentPath.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 pt-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
