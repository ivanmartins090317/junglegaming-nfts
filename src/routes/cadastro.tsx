import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/cadastro')({
  component: SignUpRoute,
})

function SignUpRoute() {
  return <EmptyRoute title="Cadastro" />
}
