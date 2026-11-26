import type { CartLineRef, CartView, Quote } from '@/lib/contracts/cart.ts'
import { cartMessages } from '@/lib/contracts/cart.ts'
import { apiClient } from '@/lib/api/client.ts'

export class CartActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CartActionError'
  }
}

async function request<T>(work: () => Promise<T>, message: string) {
  try {
    return await work()
  } catch (error: unknown) {
    if (error instanceof CartActionError) throw error
    throw new CartActionError(message)
  }
}

export async function fetchUserCart() {
  return request(async () => {
    const response = await apiClient.get<CartView>('/api/carrinho')
    return response.data
  }, cartMessages.loadFailed)
}

export async function fetchGuestCart(lines: CartLineRef[]) {
  if (lines.length === 0) return { lines: [] }
  return request(async () => {
    const response = await apiClient.post<CartView>('/api/carrinho/leitura', { lines })
    return response.data
  }, cartMessages.loadFailed)
}

export async function fetchSessionQuote() {
  return request(async () => {
    const response = await apiClient.post<Quote>('/api/cotacao', {})
    return response.data
  }, cartMessages.quoteFailed)
}

export async function fetchGuestQuote(lines: CartLineRef[]) {
  return request(async () => {
    const response = await apiClient.post<Quote>('/api/cotacao', { lines })
    return response.data
  }, cartMessages.quoteFailed)
}

export function addCartItem(nftId: string) {
  return request(async () => {
    const response = await apiClient.post<CartView>('/api/carrinho/itens', { nftId })
    return response.data
  }, cartMessages.updateFailed)
}

export function setCartQuantity(nftId: string, quantity: number) {
  return request(async () => {
    const response = await apiClient.put<CartView>(`/api/carrinho/itens/${encodeURIComponent(nftId)}`, {
      quantity,
    })
    return response.data
  }, cartMessages.updateFailed)
}

export function removeCartItem(nftId: string) {
  return request(async () => {
    const response = await apiClient.delete<CartView>(`/api/carrinho/itens/${encodeURIComponent(nftId)}`)
    return response.data
  }, cartMessages.updateFailed)
}

export function mergeCart(lines: CartLineRef[]) {
  return request(async () => {
    const response = await apiClient.post<CartView>('/api/carrinho/fusao', { lines })
    return response.data
  }, cartMessages.mergeFailed)
}
