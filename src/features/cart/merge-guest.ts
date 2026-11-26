import type { QueryClient } from '@tanstack/react-query'
import { mergeCart } from '@/lib/api/cart.ts'
import type { SessionUser } from '@/lib/contracts/session.ts'
import { cartQueryKey, invalidateCart, quoteQueryKey } from '@/lib/query/cart.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import { clearGuestDraft, readGuestDraft } from '@/features/cart/guest-draft.ts'

export type MergeOutcome = 'empty' | 'merged' | 'failed' | 'busy'

let mergeFailed = false
let flight: Promise<MergeOutcome> | null = null
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

export function subscribeMergeFailed(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function readMergeFailed() {
  return mergeFailed
}

export function resetMergeState() {
  mergeFailed = false
  flight = null
  notify()
}

function forgetGuestCache(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: cartQueryKey(null) })
  queryClient.removeQueries({ queryKey: quoteQueryKey(null) })
}

function refreshSignedInCart(queryClient: QueryClient) {
  const user = queryClient.getQueryData<SessionUser>(sessionQueryKey)
  if (!user) return Promise.resolve()
  return invalidateCart(queryClient, user.id)
}

export function mergeGuestDraft(queryClient: QueryClient): Promise<MergeOutcome> {
  if (flight) return Promise.resolve('busy')
  const lines = readGuestDraft()
  if (lines.length === 0) {
    mergeFailed = false
    notify()
    return Promise.resolve('empty')
  }
  flight = (async () => {
    try {
      await mergeCart(lines)
      clearGuestDraft()
      mergeFailed = false
      forgetGuestCache(queryClient)
      await refreshSignedInCart(queryClient)
      return 'merged' as const
    } catch {
      mergeFailed = true
      await refreshSignedInCart(queryClient)
      return 'failed' as const
    } finally {
      flight = null
      notify()
    }
  })()
  return flight
}
