import { useQuery } from '@tanstack/react-query'
import { fetchGuestCart, fetchUserCart } from '@/lib/api/cart.ts'
import { cartQueryKey } from '@/lib/query/cart.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { readGuestDraft } from '@/features/cart/guest-draft.ts'

export function useCartBadgeCount() {
  const session = useSessionQuery()
  const userId = session.data?.id ?? null
  const cart = useQuery({
    queryKey: cartQueryKey(session.isSuccess ? userId : null),
    enabled: session.isSuccess,
    retry: false,
    queryFn: () => (userId ? fetchUserCart() : fetchGuestCart(readGuestDraft())),
  })
  if (!cart.data) return 0
  return cart.data.lines.reduce((sum, line) => sum + line.quantity, 0)
}
