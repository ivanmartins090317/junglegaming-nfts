import type { OrderStatus } from '@/lib/contracts/order.ts'
import { acceptNftPrice, acceptOrderStatus } from '@/mocks/live-rules.ts'
import { emitOrder, emitPrice } from '@/mocks/live-socket.ts'
import { withStore } from '@/mocks/store.ts'

const neonId = 'neon-vessel-552'
const goldenId = 'golden-signal-160'

export function tickNeonPrice(): boolean {
  const next = withStore((store) => {
    const nft = store.nfts.find((item) => item.id === neonId)
    if (!nft) return undefined
    const price = nft.price === '1.99' ? '2.09' : '1.99'
    const version = (store.nftVersions[neonId] ?? 1) + 1
    return { price, version }
  })
  if (!next) return false
  const accepted = acceptNftPrice(neonId, next.price, next.version)
  if (accepted) {
    emitPrice({ nftId: neonId, price: next.price, version: next.version })
  }
  return accepted
}

export function resolvePendingOrder(userId: string, orderId: string): boolean {
  const next = withStore((store) => {
    const user = store.users.find((item) => item.id === userId)
    const order = user?.orders.find((item) => item.id === orderId)
    if (!order || order.status !== 'pendente') return undefined
    const refused = order.lines.some((line) => line.nftId === goldenId)
    const status: OrderStatus = refused ? 'recusado' : 'confirmado'
    const version = (store.orderVersions[orderId] ?? 1) + 1
    return { status, version }
  })
  if (!next) return false
  const accepted = acceptOrderStatus(userId, orderId, next.status, next.version)
  if (accepted) {
    emitOrder(userId, { orderId, status: next.status, version: next.version })
  }
  return accepted
}

export function scheduleOrderResolution(userId: string, orderId: string) {
  if (import.meta.env.MODE === 'test') return
  setTimeout(() => {
    resolvePendingOrder(userId, orderId)
  }, 2000)
}

let clockOn = false

export function startLiveClock() {
  if (import.meta.env.MODE === 'test') return
  if (clockOn) return
  clockOn = true
  setInterval(() => {
    tickNeonPrice()
  }, 3000)
}
