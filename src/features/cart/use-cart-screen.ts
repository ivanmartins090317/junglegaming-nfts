import { useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchGuestCart, fetchGuestQuote, fetchSessionQuote, fetchUserCart } from '@/lib/api/cart.ts'
import type { CartLine, Quote } from '@/lib/contracts/cart.ts'
import { cartQueryKey, quoteQueryKey } from '@/lib/query/cart.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { readGuestDraft } from '@/features/cart/guest-draft.ts'
import { readMergeFailed, subscribeMergeFailed } from '@/features/cart/merge-guest.ts'
import { useCartMutations } from '@/features/cart/use-cart-mutations.ts'

export function useCartScreen() {
  const session = useSessionQuery()
  const userId = session.data?.id ?? null
  const signedIn = session.isSuccess
  const cart = useQuery({
    queryKey: cartQueryKey(signedIn ? userId : null),
    enabled: signedIn,
    retry: false,
    queryFn: () => (userId ? fetchUserCart() : fetchGuestCart(readGuestDraft())),
  })
  const quote = useQuery({
    queryKey: quoteQueryKey(signedIn ? userId : null),
    enabled: signedIn && cart.isSuccess,
    retry: false,
    queryFn: () => (userId ? fetchSessionQuote() : fetchGuestQuote(readGuestDraft())),
  })
  const mutations = useCartMutations()
  const mergeFailed = useSyncExternalStore(subscribeMergeFailed, readMergeFailed, readMergeFailed)
  const waiting = session.isPending || (session.isSuccess && cart.isPending)
  const failed = session.isError || cart.isError
  const lines: CartLine[] = cart.data?.lines ?? []
  const quoteData: Quote | undefined = quote.isSuccess ? quote.data : undefined

  return {
    waiting,
    failed,
    lines,
    quote: quoteData,
    quoteFailed: cart.isSuccess && quote.isError,
    mergeFailed,
    canCheckout: !waiting && !failed && lines.length > 0,
    mutations,
  }
}
