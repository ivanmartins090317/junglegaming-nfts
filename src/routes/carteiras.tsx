import { createFileRoute } from '@tanstack/react-router'
import { WalletPage } from '@/features/wallet/wallet-page.tsx'
import { returnToFrom } from '@/features/session/entry-location.ts'
import { requireSession } from '@/features/session/guard.ts'

export const Route = createFileRoute('/carteiras')({
  beforeLoad: ({ location }) => requireSession(returnToFrom(location)),
  component: WalletsRoute,
})

function WalletsRoute() {
  return <WalletPage />
}