import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'
import type { CartView, Quote } from '@/lib/contracts/cart.ts'
import type { Nft } from '@/lib/contracts/nft.ts'
import type { OrderReceipt } from '@/lib/contracts/order.ts'
import { cartQueryKey, quoteQueryKey } from '@/lib/query/cart.ts'
import { catalogQueryKey, nftQueryKey } from '@/lib/query/nfts.ts'
import { orderQueryKey } from '@/lib/query/order.ts'
import {
  applyOrderNotice,
  applyPriceNotice,
  forgetOrderVersions,
  resetLiveNoticeMemory,
} from '@/lib/socket/apply-notice.ts'

const neon: Nft = {
  id: 'neon-vessel-552',
  name: 'Neon Vessel #552',
  price: '1.99',
  compareAt: '2.29',
  image: '/home/neon.png',
  rare: true,
}

function client() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function invalidated(queryClient: QueryClient, key: readonly unknown[]) {
  return queryClient.getQueryState(key)?.isInvalidated === true
}

describe('aviso ao vivo no cache', () => {
  beforeEach(() => {
    resetLiveNoticeMemory()
  })

  it('troca só o preço do catálogo', () => {
    const queryClient = client()
    queryClient.setQueryData(catalogQueryKey, [neon])
    expect(applyPriceNotice(queryClient, { nftId: neon.id, price: '2.09', version: 2 })).toBe(true)
    const catalog = queryClient.getQueryData<Nft[]>(catalogQueryKey)
    expect(catalog?.[0]?.price).toBe('2.09')
    expect(catalog?.[0]?.compareAt).toBe('2.29')
    expect(catalog?.[0]?.name).toBe(neon.name)
  })

  it('ignora marca repetida ou menor', () => {
    const queryClient = client()
    queryClient.setQueryData(catalogQueryKey, [neon])
    applyPriceNotice(queryClient, { nftId: neon.id, price: '2.09', version: 2 })
    expect(applyPriceNotice(queryClient, { nftId: neon.id, price: '9.99', version: 2 })).toBe(false)
    expect(applyPriceNotice(queryClient, { nftId: neon.id, price: '9.99', version: 1 })).toBe(false)
    expect(queryClient.getQueryData<Nft[]>(catalogQueryKey)?.[0]?.price).toBe('2.09')
  })

  it('não cria cache do catálogo ausente', () => {
    const queryClient = client()
    applyPriceNotice(queryClient, { nftId: neon.id, price: '2.09', version: 2 })
    expect(queryClient.getQueryData(catalogQueryKey)).toBeUndefined()
    expect(queryClient.getQueryData(nftQueryKey(neon.id))).toBeUndefined()
  })

  it('invalida carrinho e cotação só com a peça na linha', async () => {
    const queryClient = client()
    const cart: CartView = {
      lines: [{ nftId: neon.id, name: neon.name, image: neon.image, unitPrice: '1.99', quantity: 1 }],
    }
    queryClient.setQueryData(cartQueryKey(null), cart)
    queryClient.setQueryData(quoteQueryKey(null), { total: '2.00' } as Quote)
    applyPriceNotice(queryClient, { nftId: neon.id, price: '2.09', version: 2 })
    await Promise.resolve()
    expect(invalidated(queryClient, cartQueryKey(null))).toBe(true)
    expect(invalidated(queryClient, quoteQueryKey(null))).toBe(true)

    const otherClient = client()
    otherClient.setQueryData(cartQueryKey('usr-ada'), {
      lines: [{ nftId: 'sage-nomad-009', name: 'Sage', image: '/home/sage.png', unitPrice: '1.69', quantity: 1 }],
    })
    otherClient.setQueryData(quoteQueryKey('usr-ada'), { total: '1.706' } as Quote)
    await applyPriceNotice(otherClient, { nftId: neon.id, price: '2.09', version: 2 })
    expect(invalidated(otherClient, cartQueryKey('usr-ada'))).toBe(false)
    expect(invalidated(otherClient, quoteQueryKey('usr-ada'))).toBe(false)
  })

  it('atualiza só o status do pedido em cache', () => {
    const queryClient = client()
    const pending: OrderReceipt = {
      id: 'ped-novo-1',
      status: 'pendente',
      lines: [],
      networkFee: '0.016',
      total: '1.706',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      transactionId: '0xTEST',
    }
    queryClient.setQueryData(orderQueryKey('usr-ada', pending.id), pending)
    expect(applyOrderNotice(queryClient, 'usr-ada', { orderId: pending.id, status: 'confirmado', version: 2 })).toBe(
      true,
    )
    const saved = queryClient.getQueryData<OrderReceipt>(orderQueryKey('usr-ada', pending.id))
    expect(saved?.status).toBe('confirmado')
    expect(saved?.total).toBe('1.706')
  })

  it('não regride pedido confirmado', () => {
    const queryClient = client()
    const confirmed: OrderReceipt = {
      id: 'ped-ada-1',
      status: 'confirmado',
      lines: [],
      networkFee: '0.00',
      total: '1.79',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      transactionId: '0xADA1',
    }
    queryClient.setQueryData(orderQueryKey('usr-ada', confirmed.id), confirmed)
    expect(
      applyOrderNotice(queryClient, 'usr-ada', { orderId: confirmed.id, status: 'recusado', version: 9 }),
    ).toBe(false)
    expect(queryClient.getQueryData<OrderReceipt>(orderQueryKey('usr-ada', confirmed.id))?.status).toBe('confirmado')
  })

  it('não altera pedido de outra pessoa', () => {
    const queryClient = client()
    const bruno: OrderReceipt = {
      id: 'ped-bruno-1',
      status: 'pendente',
      lines: [],
      networkFee: '0.00',
      total: '0.39',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      transactionId: '0xB2',
    }
    queryClient.setQueryData(orderQueryKey('usr-bruno', bruno.id), bruno)
    applyOrderNotice(queryClient, 'usr-ada', { orderId: bruno.id, status: 'confirmado', version: 2 })
    expect(queryClient.getQueryData<OrderReceipt>(orderQueryKey('usr-bruno', bruno.id))?.status).toBe('pendente')
  })

  it('não cria leitura do pedido ausente', () => {
    const queryClient = client()
    expect(applyOrderNotice(queryClient, 'usr-ada', { orderId: 'ped-9', status: 'confirmado', version: 2 })).toBe(
      false,
    )
    expect(queryClient.getQueryData(orderQueryKey('usr-ada', 'ped-9'))).toBeUndefined()
  })

  it('esquece só marca de pedido', () => {
    const queryClient = client()
    queryClient.setQueryData(catalogQueryKey, [neon])
    applyPriceNotice(queryClient, { nftId: neon.id, price: '2.09', version: 2 })
    const pending: OrderReceipt = {
      id: 'ped-novo-2',
      status: 'pendente',
      lines: [],
      networkFee: '0.016',
      total: '1.706',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      transactionId: '0xTEST2',
    }
    queryClient.setQueryData(orderQueryKey('usr-ada', pending.id), pending)
    applyOrderNotice(queryClient, 'usr-ada', { orderId: pending.id, status: 'confirmado', version: 2 })
    forgetOrderVersions('usr-ada')
    expect(applyPriceNotice(queryClient, { nftId: neon.id, price: '9.99', version: 1 })).toBe(false)
    expect(queryClient.getQueryData<Nft[]>(catalogQueryKey)?.[0]?.price).toBe('2.09')
  })
})