import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { addCartItem, removeCartItem, setCartQuantity } from '@/lib/api/cart.ts'
import { fetchSession } from '@/lib/api/session.ts'
import { cartMessages } from '@/lib/contracts/cart.ts'
import { invalidateCart } from '@/lib/query/cart.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import { addGuestMany, removeGuestLine, setGuestQuantity } from '@/features/cart/guest-draft.ts'

export function useCartMutations() {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)

  async function commit(work: (userId: string | null) => Promise<void>): Promise<boolean> {
    if (lock.current) return false
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
      return true
    } catch {
      setMessage(cartMessages.updateFailed)
      return false
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  function addMany(nftId: string, amount: number) {
    return commit(async (userId) => {
      if (userId) {
        const view = await addCartItem(nftId)
        if (amount < 2) return
        const current = view.lines.find((line) => line.nftId === nftId)?.quantity ?? 1
        await setCartQuantity(nftId, current + amount - 1)
        return
      }
      addGuestMany(nftId, amount)
    })
  }

  function addOne(nftId: string) {
    return addMany(nftId, 1)
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

  return { message, busy, addOne, addMany, setQuantity, remove }
}
