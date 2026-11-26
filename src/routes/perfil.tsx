import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/perfil')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return <EmptyRoute title="Perfil" />
}
