import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  acceptNftPrice,
  acceptOrderStatus,
  readNftVersion,
  readOrderVersion,
} from '@/mocks/live-rules.ts'
import { scheduleOrderResolution, startLiveClock, tickNeonPrice, resolvePendingOrder } from '@/mocks/live-clock.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore, updateLiveStore, withStore } from '@/mocks/store.ts'

const server = setupServer(...handlers)

async function enter(email: string) {
  const response = await fetch('/api/sessao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'kurio' }),
  })
  expect(response.status).toBe(200)
}

async function postJson(path: string, body: unknown) {
  return fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('regras ao vivo da loja', () => {
  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' })
  })

  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('alterna o preço de Neon Vessel na primeira batida', () => {
    expect(tickNeonPrice()).toBe(true)
    const neon = withStore((store) => store.nfts.find((item) => item.id === 'neon-vessel-552'))
    const emerald = withStore((store) => store.nfts.find((item) => item.id === 'emerald-ape-042'))
    expect(neon?.price).toBe('2.09')
    expect(neon?.compareAt).toBe('2.29')
    expect(readNftVersion('neon-vessel-552')).toBe(2)
    expect(emerald?.price).toBe('1.19')
  })

  it('volta o preço de Neon Vessel na segunda batida', () => {
    tickNeonPrice()
    expect(tickNeonPrice()).toBe(true)
    expect(withStore((store) => store.nfts.find((item) => item.id === 'neon-vessel-552')?.price)).toBe('1.99')
    expect(readNftVersion('neon-vessel-552')).toBe(3)
    expect(withStore((store) => store.nfts.find((item) => item.id === 'neon-vessel-552')?.compareAt)).toBe('2.29')
  })

  it('ignora marca igual ou menor no preço', () => {
    acceptNftPrice('neon-vessel-552', '2.09', 2)
    acceptNftPrice('neon-vessel-552', '9.99', 3)
    expect(acceptNftPrice('neon-vessel-552', '2.09', 3)).toBe(false)
    expect(acceptNftPrice('neon-vessel-552', '9.99', 2)).toBe(false)
    expect(withStore((store) => store.nfts.find((item) => item.id === 'neon-vessel-552')?.price)).toBe('9.99')
  })

  it('não muda o recibo da Ada ao mudar outra peça', () => {
    acceptNftPrice('ivory-baron-088', '9.99', 2)
    const order = withStore((store) => store.users[0]?.orders.find((item) => item.id === 'ped-ada-1'))
    expect(order).toMatchObject({
      total: '1.79',
      networkFee: '0.00',
      lines: [{ nftId: 'ivory-baron-088', total: '1.79' }],
    })
  })

  it('não expõe marca de ordem no JSON', async () => {
    await enter('ada@kurio.test')
    const catalog = await (await fetch('/api/nfts')).json()
    const order = await (await fetch('/api/pedidos/ped-ada-1')).json()
    expect(catalog.every((nft: Record<string, unknown>) => !('version' in nft))).toBe(true)
    expect('version' in order).toBe(false)
  })

  it('fecha pendente e resolve para confirmado', async () => {
    await enter('ada@kurio.test')
    const created = await postJson('/api/pedidos', {
      key: 'chave-ada-live',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(created.status).toBe(200)
    const pending = await created.json()
    expect(pending.status).toBe('pendente')
    expect(readUsers()[0]?.cart).toEqual([])

    expect(resolvePendingOrder('usr-ada', pending.id)).toBe(true)
    const confirmed = await (await fetch(`/api/pedidos/${pending.id}`)).json()
    expect(confirmed.status).toBe('confirmado')
    expect(confirmed).toMatchObject({
      total: pending.total,
      networkFee: pending.networkFee,
      wallet: pending.wallet,
      date: pending.date,
      transactionId: pending.transactionId,
      lines: pending.lines,
    })

    const replay = await postJson('/api/pedidos', {
      key: 'chave-ada-live',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect((await replay.json()).status).toBe('confirmado')
    expect(readUsers()[0]?.cart).toEqual([])
  })

  it('recusa pedido com Golden Signal #160', async () => {
    await enter('ada@kurio.test')
    await fetch('/api/carrinho/itens/sage-nomad-009', { method: 'DELETE' })
    await postJson('/api/carrinho/itens', { nftId: 'golden-signal-160' })
    const created = await postJson('/api/pedidos', {
      key: 'chave-recusa',
      lines: [{ nftId: 'golden-signal-160', quantity: 1 }],
    })
    const pending = await created.json()
    expect(pending.status).toBe('pendente')
    expect(resolvePendingOrder('usr-ada', pending.id)).toBe(true)
    const refused = await (await fetch(`/api/pedidos/${pending.id}`)).json()
    expect(refused.status).toBe('recusado')
    expect(refused.total).toBe(pending.total)
    expect(acceptOrderStatus('usr-ada', pending.id, 'confirmado', readOrderVersion(pending.id) + 1)).toBe(false)
    expect((await (await fetch(`/api/pedidos/${pending.id}`)).json()).status).toBe('recusado')
  })

  it('não resolve pedidos da semente', () => {
    expect(resolvePendingOrder('usr-ada', 'ped-ada-1')).toBe(false)
    expect(resolvePendingOrder('usr-bruno', 'ped-bruno-1')).toBe(false)
    expect(withStore((store) => store.users[0]?.orders[0]?.status)).toBe('confirmado')
    expect(withStore((store) => store.users[1]?.orders[0]?.total)).toBe('0.39')
  })

  it('isola aviso de pedido por pessoa', () => {
    const orderId = 'ped-novo-99'
    updateLiveStore((store) => {
      store.users[0]?.orders.push({
        id: orderId,
        lines: [],
        networkFee: '0.016',
        total: '1.706',
        wallet: 'MetaMask',
        date: '29 Jul, 2026',
        transactionId: '0xTEST',
        status: 'pendente',
      })
      store.orderVersions[orderId] = 1
    })
    expect(acceptOrderStatus('usr-ada', orderId, 'confirmado', 2)).toBe(true)
    expect(withStore((store) => store.users[1]?.orders.find((item) => item.id === orderId))).toBeUndefined()
  })

  it('recomeço devolve preço e apaga pedido novo sem aviso', async () => {
    acceptNftPrice('neon-vessel-552', '2.09', 2)
    await enter('ada@kurio.test')
    const created = await postJson('/api/pedidos', {
      key: 'chave-reset',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    const pending = await created.json()
    expect(await fetch('/api/dev/reset', { method: 'POST' })).toMatchObject({ status: 204 })
    expect(withStore((store) => store.nfts.find((item) => item.id === 'neon-vessel-552')?.price)).toBe('1.99')
    expect(readNftVersion('neon-vessel-552')).toBe(1)
    expect(withStore((store) => store.users[0]?.orders.some((item) => item.id === pending.id))).toBe(false)
  })

  it('não arma relógio em modo teste', () => {
    const interval = vi.spyOn(globalThis, 'setInterval')
    const timeout = vi.spyOn(globalThis, 'setTimeout')
    startLiveClock()
    scheduleOrderResolution('usr-ada', 'ped-ada-1')
    expect(interval).not.toHaveBeenCalled()
    expect(timeout).not.toHaveBeenCalled()
    interval.mockRestore()
    timeout.mockRestore()
  })
})