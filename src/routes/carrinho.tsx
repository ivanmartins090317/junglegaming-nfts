import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/carrinho')({
  component: CartRoute,
})

function CartRoute() {
  return <EmptyRoute title="Carrinho" />
}
