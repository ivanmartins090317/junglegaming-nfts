import { redirect } from '@tanstack/react-router'
import { fetchSession } from '@/lib/api/session.ts'
import { getAppQueryClient, sessionQueryKey } from '@/lib/query/session.ts'
import { entryHref, isDesktopEntry, pathWhenAlreadySignedIn } from '@/features/session/entry-location.ts'

async function loadSession() {
  try {
    const user = await getAppQueryClient().fetchQuery({
      queryKey: sessionQueryKey,
      queryFn: fetchSession,
    })
    return { failed: false, user }
  } catch {
    return { failed: true, user: null }
  }
}

export async function requireSession(returnTo: string) {
  const result = await loadSession()
  if (!result.failed && result.user) return
  throw redirect({ href: entryHref(returnTo, isDesktopEntry()) })
}

export async function redirectSignedOutEntry(mode: 'entrar' | 'cadastro', retorno: string | undefined) {
  const result = await loadSession()
  if (!result.failed && result.user) {
    throw redirect({ href: pathWhenAlreadySignedIn(retorno) })
  }
  if (!isDesktopEntry()) return
  const params = new URLSearchParams()
  params.set('conta', mode)
  if (retorno) params.set('retorno', retorno)
  throw redirect({ href: `/?${params.toString()}` })
}
