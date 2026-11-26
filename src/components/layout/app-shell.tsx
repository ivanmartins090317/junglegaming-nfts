import type { ReactNode } from 'react'
import { MobileTabs } from '@/components/layout/mobile-tabs.tsx'
import { SiteHeader } from '@/components/layout/site-header.tsx'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-ink text-foreground">
      <div className="px-[28px] pb-28 md:pb-16 min-[1440px]:px-[120px]">
        <SiteHeader />
        <main className="mt-8 md:mt-10 min-[1440px]:mt-12">{children}</main>
      </div>
      <MobileTabs />
    </div>
  )
}
