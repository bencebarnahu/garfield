"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Copy, Search, User, Sticker, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

const tabs = [
  { href: "/album", label: "My Album", icon: BookOpen },
  { href: "/duplicates", label: "Duplicates", icon: Copy },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
]

interface DesktopSidebarProps {
  currentPath: string
  userId: string
}

export function DesktopSidebar({ currentPath }: DesktopSidebarProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Sticker className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-base font-bold text-foreground">
          Sticker Exchange
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2" aria-label="Sidebar navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentPath.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
