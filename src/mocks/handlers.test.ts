import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { worker } from '@/mocks/browser.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore, updateLiveStore } from '@/mocks/store.ts'

const workerState = vi.hoisted(() => ({
  handlers: [] as unknown[],
}))

vi.mock('msw/browser', () => ({
  setupWorker: (...received: unknown[]) => {
    workerState.handlers = received
    return { start: vi.fn() }
  },
}))

const server = setupServer(...handlers)

const happyCatalog = [
  { id: 'emerald-ape-042', name: 'Emerald Ape #042', price: '1.19', image: '/home/emerald.png' },
  { id: 'sage-nomad-009', name: 'Sage Nomad #009', price: '1.69', image: '/home/sage.png' },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    price: '1.99',
    compareAt: '2.29',
    image: '/home/neon.png',
    rare: true,
  },
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', price: '1.29', image: '/home/cosmic.png' },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', price: '1.39', image: '/home/violet.png' },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', price: '1.79', image: '/home/ivory.png' },
  { id: 'golden-beat-207', name: 'Golden Beat #207', price: '0.99', image: '/home/golden.png' },
  { id: 'golden-signal-160', name: 'Golden Signal #160', price: '0.39', image: '/home/golden.png' },
]

const happyUsers = [
  {
    id: 'usr-ada',
    name: 'Ada',
    email: 'ada@kurio.test',
    password: 'kurio',
    favorites: ['emerald-ape-042', 'neon-vessel-552'],
    cart: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    orders: [
      {
        id: 'ped-ada-1',
        item: { nftId: 'ivory-baron-088', quantity: 1 },
        total: '1.79',
        status: 'confirmado',
      },
    ],
  },
  {
    id: 'usr-bruno',
    name: 'Bruno',
    email: 'bruno@kurio.test',
    password: 'kurio',
    favorites: ['golden-beat-207'],
    cart: [{ nftId: 'cosmic-bloom-118', quantity: 2 }],
    orders: [
      {
        id: 'ped-bruno-1',
        item: { nftId: 'golden-signal-160', quantity: 1 },
        total: '0.39',
        status: 'confirmado',
      },
    ],
  },
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function priceOf(body: unknown, nftId: string) {
  if (!Array.isArray(body)) throw new Error('catálogo inválido')
  const nft = body.find((item) => isRecord(item) && item.id === nftId)
  if (!isRecord(nft) || typeof nft.price !== 'string') throw new Error(`peça ausente: ${nftId}`)
  return nft.price
}

function shared(left: string[], right: string[]) {
  return left.filter((id) => right.includes(id))
}

describe('loja simulada', () => {
  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'bypass' })
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

  it('devolve as oito peças do catálogo feliz, nesta ordem', async () => {
    const response = await fetch('/api/nfts')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(happyCatalog)
  })

  it('devolve a peça que existe', async () => {
    const response = await fetch('/api/nfts/neon-vessel-552')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      id: 'neon-vessel-552',
      name: 'Neon Vessel #552',
      price: '1.99',
      compareAt: '2.29',
      image: '/home/neon.png',
      rare: true,
    })
  })

  it('responde ausência quando a peça não está nas oito', async () => {
    const response = await fetch('/api/nfts/fora-da-semente')
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ message: 'NFT não encontrado.' })
  })

  it('nasce com Ada e Bruno separados', () => {
    expect(readUsers()).toEqual(happyUsers)

    const [ada, bruno] = readUsers()
    const adaCart = ada.cart.map((line) => line.nftId)
    const brunoCart = bruno.cart.map((line) => line.nftId)
    const adaOrders = ada.orders.map((order) => order.id)
    const brunoOrders = bruno.orders.map((order) => order.id)
    const adaItems = ada.orders.map((order) => order.item.nftId)
    const brunoItems = bruno.orders.map((order) => order.item.nftId)

    expect(shared(ada.favorites, bruno.favorites)).toEqual([])
    expect(shared(adaCart, brunoCart)).toEqual([])
    expect(shared(adaOrders, brunoOrders)).toEqual([])
    expect(shared(adaItems, brunoItems)).toEqual([])

    const owned = [...ada.favorites, ...bruno.favorites, ...adaCart, ...brunoCart, ...adaItems, ...brunoItems]
    expect(owned).not.toContain('violet-nomad-314')
    expect(happyCatalog.map((nft) => nft.id)).toContain('violet-nomad-314')
  })

  it('devolve a semente em cada recomeço, sem acumular a alteração', async () => {
    updateLiveStore((store) => {
      const nft = store.nfts.find((item) => item.id === 'emerald-ape-042')
      const ada = store.users.find((user) => user.id === 'usr-ada')
      if (!nft || !ada) throw new Error('semente incompleta')
      nft.price = '9.99'
      ada.favorites.push('violet-nomad-314')
      ada.cart[0].quantity = 4
      ada.orders[0].total = '9.99'
    })

    const dirty = await fetch('/api/nfts')
    expect(priceOf(await dirty.json(), 'emerald-ape-042')).toBe('9.99')
    expect(readUsers()[0]?.favorites).toContain('violet-nomad-314')
    expect(readUsers()[0]?.cart[0]?.quantity).toBe(4)
    expect(readUsers()[0]?.orders[0]?.total).toBe('9.99')

    const firstReset = await fetch('/api/dev/reset', { method: 'POST' })
    expect(firstReset.status).toBe(204)
    expect(await firstReset.text()).toBe('')
    expect(await (await fetch('/api/nfts')).json()).toEqual(happyCatalog)
    expect(readUsers()).toEqual(happyUsers)

    updateLiveStore((store) => {
      store.nfts[0].price = '8.88'
      store.users[1].cart[0].quantity = 7
      store.users[1].orders[0].total = '8.88'
    })

    const secondReset = await fetch('/api/dev/reset', { method: 'POST' })
    expect(secondReset.status).toBe(204)
    expect(await (await fetch('/api/nfts')).json()).toEqual(happyCatalog)
    expect(readUsers()).toEqual(happyUsers)
  })

  it('não responde no lugar de um pedido desconhecido e exporta o worker', async () => {
    expect(worker).toMatchObject({ start: expect.any(Function) })
    expect(workerState.handlers).toHaveLength(handlers.length)
    for (const handler of handlers) expect(workerState.handlers).toContain(handler)

    await expect(fetch('/api/desconhecido')).rejects.toThrow()
  })
})
