import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/pedidos/$pedidoId')({
  component: OrderRoute,
})

function OrderRoute() {
  const { pedidoId } = Route.useParams()
  return <EmptyRoute title="Confirmação" extra={pedidoId} />
}
