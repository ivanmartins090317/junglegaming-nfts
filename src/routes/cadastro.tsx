import { createFileRoute } from '@tanstack/react-router'
import { AuthScreen } from '@/features/session/auth-entry.tsx'
import { authRouteSearch } from '@/features/session/entry-location.ts'
import { redirectSignedOutEntry } from '@/features/session/guard.ts'

export const Route = createFileRoute('/cadastro')({
  validateSearch: authRouteSearch,
  beforeLoad: ({ search }) => redirectSignedOutEntry('cadastro', search.retorno),
  component: SignUpRoute,
})

function SignUpRoute() {
  return <AuthScreen mode="cadastro" />
}
