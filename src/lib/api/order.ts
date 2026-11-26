import { isAxiosError } from 'axios'
import type { OrderLineRef, OrderReceipt } from '@/lib/contracts/order.ts'
import { orderMessages } from '@/lib/contracts/order.ts'
import { apiClient } from '@/lib/api/client.ts'

export class OrderActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OrderActionError'
  }
}

const knownMessages = new Set<string>(Object.values(orderMessages))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toOrderError(error: unknown, fallback: string) {
  if (error instanceof OrderActionError) return error
  if (isAxiosError(error) && isRecord(error.response?.data)) {
    const message = error.response.data.message
    if (typeof message === 'string' && knownMessages.has(message)) return new OrderActionError(message)
  }
  return new OrderActionError(fallback)
}

export async function fetchOrder(orderId: string, signal?: AbortSignal) {
  try {
    const response = await apiClient.get<OrderReceipt>(`/api/pedidos/${encodeURIComponent(orderId)}`, { signal })
    return response.data
  } catch (error: unknown) {
    throw toOrderError(error, orderMessages.loadFailed)
  }
}

export function closeOrder(key: string, lines: OrderLineRef[]) {
  return (async () => {
    try {
      const response = await apiClient.post<OrderReceipt>('/api/pedidos', { key, lines })
      return response.data
    } catch (error: unknown) {
      throw toOrderError(error, orderMessages.createFailed)
    }
  })()
}
