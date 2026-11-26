import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import type { SessionUser } from '@/lib/contracts/session.ts'
import { deleteSession } from '@/lib/api/session.ts'
import { cartQueryKey, quoteQueryKey } from '@/lib/query/cart.ts'
import { clearSessionCache, sessionQueryKey } from '@/lib/query/session.ts'
import { leaveOrderListen } from '@/lib/socket/client.ts'
import { entryHref, isDesktopEntry, isPrivatePath } from '@/features/session/entry-location.ts'

export function useEndSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return async function endSession() {
    const current = queryClient.getQueryData<SessionUser>(sessionQueryKey)
    try {
      await deleteSession()
    } finally {
      leaveOrderListen(current?.id)
      queryClient.setQueryData(sessionQueryKey, null)
      clearSessionCache(queryClient, current?.id)
      queryClient.removeQueries({ queryKey: cartQueryKey(null) })
      queryClient.removeQueries({ queryKey: quoteQueryKey(null) })
    }
    if (!isPrivatePath(pathname)) return
    await navigate({ href: entryHref(pathname, isDesktopEntry()) })
  }
}
