import type { ReactNode } from 'react'
import { MobileTabs } from '@/components/layout/mobile-tabs.tsx'
import { SiteHeader } from '@/components/layout/site-header.tsx'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-ink text-foreground">
      <div className="px-6 pt-10 pb-28 md:px-7 desktop:px-[120px] desktop:pt-6 desktop:pb-6">
        <SiteHeader />
        <main className="mt-4 desktop:mt-8">{children}</main>
      </div>
      <MobileTabs />
    </div>
  )
}
