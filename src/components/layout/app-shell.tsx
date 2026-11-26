import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { MobileTabs } from '@/components/layout/mobile-tabs.tsx'
import { SiteHeader } from '@/components/layout/site-header.tsx'
import { AuthPanel } from '@/features/session/auth-entry.tsx'
import { isDesktopEntry } from '@/features/session/entry-location.ts'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const fullScreenAuth = (pathname === '/entrar' || pathname === '/cadastro') && !isDesktopEntry()
  const confirmationPage = pathname.startsWith('/pedidos/')
  const cartPage = pathname === '/carrinho'

  if (fullScreenAuth || confirmationPage) {
    return <div className="min-h-screen bg-ink text-foreground">{children}</div>
  }

  return (
    <div className="min-h-screen bg-ink text-foreground">
      <div
        className={
          cartPage
            ? 'px-7 pt-10 pb-0 desktop:px-[120px] desktop:pt-6 desktop:pb-6'
            : 'px-6 pt-10 pb-28 md:px-7 desktop:px-[120px] desktop:pt-6 desktop:pb-6'
        }
      >
        <SiteHeader />
        <main className="mt-4 desktop:mt-8">{children}</main>
      </div>
      {cartPage ? null : <MobileTabs />}
      <AuthPanel />
    </div>
  )
}
