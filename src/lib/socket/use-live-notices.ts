import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { applyOrderNotice, applyPriceNotice } from '@/lib/socket/apply-notice.ts'
import { connectLiveSocket, leaveOrderListen } from '@/lib/socket/client.ts'
import { joinEvent, orderEvent, priceEvent, type OrderNotice, type PriceNotice } from '@/lib/socket/events.ts'
import { isMockEnabled } from '@/mocks/config.ts'
import { useSessionQuery } from '@/lib/query/session.ts'

export function useLiveNotices() {
  const queryClient = useQueryClient()
  const session = useSessionQuery()
  const userId = session.data?.id

  useEffect(() => {
    if (!isMockEnabled() || import.meta.env.MODE === 'test') return
    const live = connectLiveSocket()
    if (!live) return

    function onPrice(notice: PriceNotice) {
      applyPriceNotice(queryClient, notice)
    }

    live.on(priceEvent, onPrice)
    return () => {
      live.off(priceEvent, onPrice)
    }
  }, [queryClient])

  useEffect(() => {
    if (!isMockEnabled() || import.meta.env.MODE === 'test') return
    if (userId === undefined) return
    const activeUserId = userId
    const live = connectLiveSocket()
    if (!live) return

    live.emit(joinEvent, { userId: activeUserId })

    function onOrder(notice: OrderNotice) {
      applyOrderNotice(queryClient, activeUserId, notice)
    }

    live.on(orderEvent, onOrder)
    return () => {
      leaveOrderListen(activeUserId)
    }
  }, [queryClient, userId])
}