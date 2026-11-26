import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/carteiras')({
  component: WalletsRoute,
})

function WalletsRoute() {
  return <EmptyRoute title="Carteiras" />
}
