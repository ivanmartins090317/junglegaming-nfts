import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { addCartItem, removeCartItem, setCartQuantity } from '@/lib/api/cart.ts'
import { fetchSession } from '@/lib/api/session.ts'
import { cartMessages } from '@/lib/contracts/cart.ts'
import { invalidateCart } from '@/lib/query/cart.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import { addGuestOne, removeGuestLine, setGuestQuantity } from '@/features/cart/guest-draft.ts'

export function useCartMutations() {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)

  async function commit(work: (userId: string | null) => Promise<void>) {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    setMessage(null)
    try {
      const user = await queryClient.fetchQuery({
        queryKey: sessionQueryKey,
        queryFn: fetchSession,
      })
      await work(user?.id ?? null)
      await invalidateCart(queryClient, user?.id ?? null)
    } catch {
      setMessage(cartMessages.updateFailed)
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  function addOne(nftId: string) {
    return commit(async (userId) => {
      if (userId) {
        await addCartItem(nftId)
        return
      }
      addGuestOne(nftId)
    })
  }

  function setQuantity(nftId: string, quantity: number) {
    return commit(async (userId) => {
      if (quantity < 1) return
      if (userId) {
        await setCartQuantity(nftId, quantity)
        return
      }
      setGuestQuantity(nftId, quantity)
    })
  }

  function remove(nftId: string) {
    return commit(async (userId) => {
      if (userId) {
        await removeCartItem(nftId)
        return
      }
      removeGuestLine(nftId)
    })
  }

  return { message, busy, addOne, setQuantity, remove }
}
