import { useQuery } from '@tanstack/react-query'
import { orderMessages } from '@/lib/contracts/order.ts'
import { fetchOrder, OrderActionError } from '@/lib/api/order.ts'
import { orderQueryKey } from '@/lib/query/order.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { OrderReceiptView } from '@/features/order/order-receipt.tsx'

export function OrderPage({ orderId }: { orderId: string }) {
  const session = useSessionQuery()
  const userId = session.data?.id
  const order = useQuery({
    queryKey: userId ? orderQueryKey(userId, orderId) : ['pedido', 'sem-sessao', orderId],
    queryFn: ({ signal }) => fetchOrder(orderId, signal),
    enabled: Boolean(userId),
  })

  const message = pageMessage(Boolean(userId), order.isPending, order.error)

  return (
    <div data-order="pagina" className="min-h-screen bg-ink px-7 pt-16 text-foreground desktop:px-0">
      {message ? <p className="m-0 text-[14px] leading-[16px]">{message}</p> : null}
      {order.data ? <OrderReceiptView order={order.data} /> : null}
    </div>
  )
}

function pageMessage(hasUser: boolean, pending: boolean, error: unknown) {
  if (!hasUser || pending) return orderMessages.loading
  if (!error) return null
  if (error instanceof OrderActionError) return error.message
  return orderMessages.loadFailed
}
