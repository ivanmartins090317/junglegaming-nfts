import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/app-shell.tsx'
import { UnknownRoute } from '@/components/layout/empty-route.tsx'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: UnknownRoute,
})

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
