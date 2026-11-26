import type { OrderStatus } from '@/lib/contracts/order.ts'
import { withStore } from '@/mocks/store.ts'

function isSafeVersion(value: number) {
  return Number.isSafeInteger(value) && value >= 1
}

function isDecimalPrice(value: string) {
  return /^\d+(\.\d+)?$/.test(value)
}

const terminal: Record<OrderStatus, boolean> = {
  pendente: false,
  confirmado: true,
  recusado: true,
}

export function readNftVersion(nftId: string): number {
  return withStore((store) => store.nftVersions[nftId] ?? 1)
}

export function readOrderVersion(orderId: string): number {
  return withStore((store) => store.orderVersions[orderId] ?? 1)
}

export function acceptNftPrice(nftId: string, price: string, version: number): boolean {
  if (!isSafeVersion(version) || !isDecimalPrice(price)) return false
  return withStore((store) => {
    const nft = store.nfts.find((item) => item.id === nftId)
    if (!nft) return false
    const current = store.nftVersions[nftId] ?? 1
    if (version <= current) return false
    nft.price = price
    store.nftVersions[nftId] = version
    return true
  })
}

export function acceptOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus,
  version: number,
): boolean {
  if (!isSafeVersion(version)) return false
  if (status !== 'pendente' && status !== 'confirmado' && status !== 'recusado') return false
  return withStore((store) => {
    const user = store.users.find((item) => item.id === userId)
    if (!user) return false
    const order = user.orders.find((item) => item.id === orderId)
    if (!order) return false
    if (terminal[order.status]) return false
    const current = store.orderVersions[orderId] ?? 1
    if (version <= current) return false
    order.status = status
    store.orderVersions[orderId] = version
    return true
  })
}