export interface CartLineRef {
  nftId: string
  quantity: number
}

export interface CartLine {
  nftId: string
  name: string
  image: string
  unitPrice: string
  quantity: number
}

export interface CartView {
  lines: CartLine[]
}

export interface QuoteLineTotal {
  nftId: string
  total: string
}

export interface Quote {
  lineTotals: QuoteLineTotal[]
  subtotal: string
  discount: string
  networkFee: string
  total: string
}

export const cartMessages = {
  loading: 'Carregando',
  empty: 'Seu carrinho está vazio.',
  loadFailed: 'Não foi possível carregar o carrinho.',
  quoteFailed: 'Não foi possível calcular o total.',
  updateFailed: 'Não foi possível atualizar o carrinho.',
  mergeFailed: 'Não foi possível guardar o carrinho.',
} as const
