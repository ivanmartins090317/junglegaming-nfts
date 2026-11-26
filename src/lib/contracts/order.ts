export interface OrderLineRef {
  nftId: string
  quantity: number
}

export interface OrderLine {
  nftId: string
  name: string
  image: string
  quantity: number
  total: string
}

export type OrderStatus = 'pendente' | 'confirmado' | 'recusado'

export interface OrderReceipt {
  id: string
  lines: OrderLine[]
  networkFee: string
  total: string
  wallet: string
  date: string
  transactionId: string
  status: OrderStatus
}

export const orderWallet = 'MetaMask'
export const orderDate = '29 Jul, 2026'

export const orderMessages = {
  loading: 'Carregando',
  missing: 'Pedido não encontrado.',
  loadFailed: 'Não foi possível carregar o pedido.',
  mismatch: 'O carrinho não confere com o pedido.',
  empty: 'O carrinho está vazio.',
  conflict: 'Esta chave já fechou outro pedido.',
  createFailed: 'Não foi possível registrar o pedido.',
  awaiting: 'Aguardando confirmação do pedido.',
  refused: 'Pedido recusado.',
} as const
