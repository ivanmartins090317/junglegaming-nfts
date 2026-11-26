import { createFileRoute } from '@tanstack/react-router'
import { AuthScreen } from '@/features/session/auth-entry.tsx'
import { authRouteSearch } from '@/features/session/entry-location.ts'
import { redirectSignedOutEntry } from '@/features/session/guard.ts'

export const Route = createFileRoute('/entrar')({
  validateSearch: authRouteSearch,
  beforeLoad: ({ search }) => redirectSignedOutEntry('entrar', search.retorno),
  component: SignInRoute,
})

function SignInRoute() {
  return <AuthScreen mode="entrar" />
}
