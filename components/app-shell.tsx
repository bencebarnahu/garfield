"use client"

import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { Sticker } from "lucide-react"

interface AppShellProps {
  userId: string
  children: React.ReactNode
}

export function AppShell({ userId, children }: AppShellProps) {
  const pathname = usePathname()

  const pageTitle =
    pathname.startsWith("/album") ? "My Album" :
    pathname.startsWith("/duplicates") ? "Duplicates" :
    pathname.startsWith("/search") ? "Search Collectors" :
    pathname.startsWith("/collector") ? "Collector Album" :
    pathname.startsWith("/profile") ? "Profile" : "Sticker Exchange"

  return (
    <div className="flex min-h-dvh bg-background">
      <DesktopSidebar currentPath={pathname} userId={userId} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-2.5 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-lg lg:px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary lg:hidden">
            <Sticker className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-bold text-foreground lg:hidden">
            Sticker Exchange
          </h1>
          <h1 className="hidden text-lg font-bold text-foreground lg:block">
            {pageTitle}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4 lg:px-6 lg:pb-6">
          <div className="mx-auto max-w-2xl">{children}</div>
        </main>
        <BottomNav currentPath={pathname} />
      </div>
    </div>
  )
}
