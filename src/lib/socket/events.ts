export interface PriceNotice {
  nftId: string
  price: string
  version: number
}

export interface OrderNotice {
  orderId: string
  status: 'pendente' | 'confirmado' | 'recusado'
  version: number
}

export const priceEvent = 'preco'
export const orderEvent = 'pedido'
export const joinEvent = 'entrar'
export const leaveEvent = 'sair'