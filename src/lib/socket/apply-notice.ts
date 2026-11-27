import type { QueryClient } from '@tanstack/react-query'
import type { CartView } from '@/lib/contracts/cart.ts'
import type { Nft } from '@/lib/contracts/nft.ts'
import type { OrderReceipt } from '@/lib/contracts/order.ts'
import { cartQueryKey, invalidateCart } from '@/lib/query/cart.ts'
import { catalogQueryKey, nftQueryKey } from '@/lib/query/nfts.ts'
import { orderQueryKey } from '@/lib/query/order.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import type { SessionUser } from '@/lib/contracts/session.ts'
import type { OrderNotice, PriceNotice } from '@/lib/socket/events.ts'

const nftVersions = new Map<string, number>()
const orderVersions = new Map<string, Map<string, number>>()

function isSafeVersion(value: number) {
  return Number.isSafeInteger(value) && value >= 1
}

function isDecimalPrice(value: string) {
  return /^\d+(\.\d+)?$/.test(value)
}

function storedNftVersion(nftId: string) {
  return nftVersions.get(nftId) ?? 1
}

function storedOrderVersion(userId: string, orderId: string) {
  return orderVersions.get(userId)?.get(orderId) ?? 1
}

function userIdForCart(queryClient: QueryClient) {
  const session = queryClient.getQueryData<SessionUser>(sessionQueryKey)
  return session?.id ?? null
}

function cartHasNft(cart: CartView | undefined, nftId: string) {
  return Boolean(cart?.lines.some((line) => line.nftId === nftId))
}

function patchNftPrice(nft: Nft, price: string) {
  return { ...nft, price }
}

export function applyPriceNotice(queryClient: QueryClient, notice: PriceNotice): boolean {
  if (!isSafeVersion(notice.version) || !isDecimalPrice(notice.price)) return false
  const current = storedNftVersion(notice.nftId)
  if (notice.version <= current) return false
  nftVersions.set(notice.nftId, notice.version)

  const catalog = queryClient.getQueryData<Nft[]>(catalogQueryKey)
  if (catalog) {
    const hasNft = catalog.some((nft) => nft.id === notice.nftId)
    if (hasNft) {
      queryClient.setQueryData(
        catalogQueryKey,
        catalog.map((nft) => (nft.id === notice.nftId ? patchNftPrice(nft, notice.price) : nft)),
      )
    }
  }

  const detail = queryClient.getQueryData<Nft>(nftQueryKey(notice.nftId))
  if (detail) queryClient.setQueryData(nftQueryKey(notice.nftId), patchNftPrice(detail, notice.price))

  const userId = userIdForCart(queryClient)
  const guestCart = queryClient.getQueryData<CartView>(cartQueryKey(null))
  const sessionCart = userId ? queryClient.getQueryData<CartView>(cartQueryKey(userId)) : undefined

  if (cartHasNft(guestCart, notice.nftId)) void invalidateCart(queryClient, null)
  if (userId && cartHasNft(sessionCart, notice.nftId)) void invalidateCart(queryClient, userId)

  return true
}

export function applyOrderNotice(queryClient: QueryClient, userId: string, notice: OrderNotice): boolean {
  const key = orderQueryKey(userId, notice.orderId)
  const order = queryClient.getQueryData<OrderReceipt>(key)
  if (!order) {
    void queryClient.invalidateQueries({ queryKey: key })
    return false
  }
  if (order.status === 'confirmado' || order.status === 'recusado') return false
  if (!isSafeVersion(notice.version)) return false
  const current = storedOrderVersion(userId, notice.orderId)
  if (notice.version <= current) return false

  const byUser = orderVersions.get(userId) ?? new Map<string, number>()
  byUser.set(notice.orderId, notice.version)
  orderVersions.set(userId, byUser)

  queryClient.setQueryData(key, { ...order, status: notice.status })
  return true
}

export function forgetOrderVersions(userId: string) {
  orderVersions.delete(userId)
}

export function resetLiveNoticeMemory() {
  nftVersions.clear()
  orderVersions.clear()
}