import type { OrderLine, OrderReceipt } from '@/lib/contracts/order.ts'
import { orderDate, orderMessages, orderWallet } from '@/lib/contracts/order.ts'
import { buildQuote, type PricedLine } from '@/lib/money.ts'
import { scheduleOrderResolution } from '@/mocks/live-clock.ts'
import { parseCartLines, withStore, type LiveStore } from '@/mocks/store.ts'

export type OrderWrite =
  | { ok: true; order: OrderReceipt }
  | { ok: false; status: 400 | 401 | 409; message: string }

export function readSessionOrder(orderId: string) {
  return withStore((store) => {
    const user = sessionUser(store)
    const order = user?.orders.find((item) => item.id === orderId)
    if (!order) return undefined
    return structuredClone(order)
  })
}

export function closeSessionOrder(key: unknown, lines: unknown): OrderWrite {
  return withStore((store) => {
    const user = sessionUser(store)
    if (!user) return refused(401, orderMessages.createFailed)
    if (typeof key !== 'string' || key.trim().length === 0) return refused(400, orderMessages.createFailed)

    const idempotencyKey = key.trim()
    const asked = parseCartLines(lines)
    const signature = lineSignature(asked)
    const previous = store.orderCloses.find((item) => item.userId === user.id && item.key === idempotencyKey)
    if (previous) {
      if (previous.signature !== signature) return refused(409, orderMessages.conflict)
      const order = user.orders.find((item) => item.id === previous.orderId)
      if (!order) return refused(400, orderMessages.createFailed)
      return { ok: true as const, order: structuredClone(order) }
    }

    const cart = parseCartLines(user.cart)
    if (cart.length === 0) return refused(400, orderMessages.empty)
    if (lineSignature(cart) !== signature) return refused(400, orderMessages.mismatch)

    const photographed = photograph(store, cart)
    if (!photographed) return refused(400, orderMessages.mismatch)

    const sequence = store.nextOrderSeq
    store.nextOrderSeq += 1
    const order: OrderReceipt = {
      id: `ped-novo-${sequence}`,
      lines: photographed.lines,
      networkFee: photographed.networkFee,
      total: photographed.total,
      wallet: orderWallet,
      date: orderDate,
      transactionId: transactionIdFor(sequence),
      status: 'pendente',
    }
    user.orders.push(order)
    store.orderVersions[order.id] = 1
    user.cart = []
    store.orderCloses.push({ userId: user.id, key: idempotencyKey, signature, orderId: order.id })
    scheduleOrderResolution(user.id, order.id)
    return { ok: true as const, order: structuredClone(order) }
  })
}

function sessionUser(store: LiveStore) {
  if (!store.sessionUserId) return undefined
  return store.users.find((item) => item.id === store.sessionUserId)
}

function refused(status: 400 | 401 | 409, message: string): OrderWrite {
  return { ok: false, status, message }
}

function lineSignature(lines: Array<{ nftId: string; quantity: number }>) {
  return lines.map((line) => `${line.nftId}:${line.quantity}`).join('|')
}

function photograph(store: LiveStore, lines: Array<{ nftId: string; quantity: number }>) {
  const priced: PricedLine[] = []
  const named: Array<{ nftId: string; name: string; image: string; quantity: number }> = []
  for (const line of lines) {
    const nft = store.nfts.find((item) => item.id === line.nftId)
    if (!nft) return undefined
    priced.push({ nftId: nft.id, unitPrice: nft.price, quantity: line.quantity })
    named.push({ nftId: nft.id, name: nft.name, image: nft.image, quantity: line.quantity })
  }
  const quote = buildQuote(priced)
  const receiptLines: OrderLine[] = named.map((line, index) => ({
    nftId: line.nftId,
    name: line.name,
    image: line.image,
    quantity: line.quantity,
    total: quote.lineTotals[index]?.total ?? '',
  }))
  if (receiptLines.some((line) => line.total.length === 0)) return undefined
  return { lines: receiptLines, networkFee: quote.networkFee, total: quote.total }
}

function transactionIdFor(sequence: number) {
  const tail = sequence.toString(16).toUpperCase().padStart(4, '0').slice(-4)
  return `0xC10E${'0'.repeat(22)}${tail}`
}
