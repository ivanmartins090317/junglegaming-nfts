import { createFileRoute } from '@tanstack/react-router'
import { OrderPage } from '@/features/order/order-page.tsx'
import { returnToFrom } from '@/features/session/entry-location.ts'
import { requireSession } from '@/features/session/guard.ts'

export const Route = createFileRoute('/pedidos/$pedidoId')({
  beforeLoad: ({ location }) => requireSession(returnToFrom(location)),
  component: OrderRoute,
})

function OrderRoute() {
  const { pedidoId } = Route.useParams()
  return <OrderPage orderId={pedidoId} />
}
