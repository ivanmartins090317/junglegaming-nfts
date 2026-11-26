export function orderQueryKey(userId: string, orderId: string) {
  return ['usuario', userId, 'pedido', orderId] as const
}
