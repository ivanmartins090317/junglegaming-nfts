import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/entrar')({
  component: SignInRoute,
})

function SignInRoute() {
  return <EmptyRoute title="Entrar" />
}
