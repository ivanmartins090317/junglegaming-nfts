import type { QueryClient } from '@tanstack/react-query'

export function cartQueryKey(userId: string | null) {
  if (userId) return ['usuario', userId, 'carrinho'] as const
  return ['carrinho', 'visitante'] as const
}

export function quoteQueryKey(userId: string | null) {
  if (userId) return ['usuario', userId, 'cotacao'] as const
  return ['cotacao', 'visitante'] as const
}

export function invalidateCart(queryClient: QueryClient, userId: string | null) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: cartQueryKey(userId) }),
    queryClient.invalidateQueries({ queryKey: quoteQueryKey(userId) }),
  ])
}
