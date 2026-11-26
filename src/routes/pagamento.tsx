import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/pagamento')({
  component: PaymentRoute,
})

function PaymentRoute() {
  return <EmptyRoute title="Revisão e envio" />
}
