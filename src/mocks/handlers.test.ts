import { http, HttpResponse } from 'msw'
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
        lines: [
          {
            nftId: 'ivory-baron-088',
            name: 'Ivory Baron #088',
            image: '/home/ivory.png',
            quantity: 1,
            total: '1.79',
          },
        ],
        networkFee: '0.00',
        total: '1.79',
        wallet: 'MetaMask',
        date: '29 Jul, 2026',
        transactionId: '0xADA1000000000000000000000000A1E1',
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
        lines: [
          {
            nftId: 'golden-signal-160',
            name: 'Golden Signal #160',
            image: '/home/golden.png',
            quantity: 1,
            total: '0.39',
          },
        ],
        networkFee: '0.00',
        total: '0.39',
        wallet: 'MetaMask',
        date: '29 Jul, 2026',
        transactionId: '0xB200000000000000000000000000B2E2',
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
    const adaItems = ada.orders.flatMap((order) => order.lines.map((line) => line.nftId))
    const brunoItems = bruno.orders.flatMap((order) => order.lines.map((line) => line.nftId))

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

  it('separa o carrinho da Ada e do Bruno e cota pela regra', async () => {
    await enter('ada@kurio.test')
    expect(await (await fetch('/api/carrinho')).json()).toEqual({
      lines: [
        {
          nftId: 'sage-nomad-009',
          name: 'Sage Nomad #009',
          image: '/home/sage.png',
          unitPrice: '1.69',
          quantity: 1,
        },
      ],
    })
    const adaQuote = await postJson('/api/cotacao', {
      lines: [{ nftId: 'emerald-ape-042', quantity: 4 }],
    })
    expect(adaQuote.status).toBe(200)
    expect(await adaQuote.json()).toMatchObject({
      subtotal: '1.69',
      discount: '0.00',
      networkFee: '0.016',
      total: '1.706',
    })

    expect((await fetch('/api/sessao', { method: 'DELETE' })).status).toBe(204)
    await enter('bruno@kurio.test')
    const bruno = await (await fetch('/api/carrinho')).json()
    expect(lineIds(bruno)).toEqual(['cosmic-bloom-118'])
    expect(lineQuantity(bruno, 'cosmic-bloom-118')).toBe(2)
    expect(await (await postJson('/api/cotacao', {})).json()).toMatchObject({
      subtotal: '2.58',
      total: '2.596',
    })
    expect(lineIds(bruno)).not.toContain('sage-nomad-009')
  })

  it('soma na fusão, ignora peça de fora e a conta nova nasce vazia', async () => {
    await enter('ada@kurio.test')
    const merged = await postJson('/api/carrinho/fusao', {
      lines: [
        { nftId: 'sage-nomad-009', quantity: 2 },
        { nftId: 'emerald-ape-042', quantity: 1 },
      ],
    })
    expect(merged.status).toBe(200)
    expect(lineIds(await merged.json())).toEqual(['sage-nomad-009', 'emerald-ape-042'])
    expect(lineQuantity(await (await fetch('/api/carrinho')).json(), 'sage-nomad-009')).toBe(3)
    expect(await (await postJson('/api/cotacao', {})).json()).toMatchObject({
      subtotal: '6.26',
      total: '6.276',
    })

    resetStore()
    await enter('ada@kurio.test')
    await postJson('/api/carrinho/fusao', {
      lines: [
        { nftId: 'fora-do-catalogo', quantity: 4 },
        { nftId: 'golden-signal-160', quantity: 1 },
      ],
    })
    const ignored = await (await fetch('/api/carrinho')).json()
    expect(lineIds(ignored)).toEqual(['sage-nomad-009', 'golden-signal-160'])
    expect(await (await postJson('/api/cotacao', {})).json()).toMatchObject({
      subtotal: '2.08',
      total: '2.096',
    })

    resetStore()
    const created = await postJson('/api/cadastro', {
      name: 'Lia',
      email: 'lia@kurio.test',
      password: 'kurio',
      confirmPassword: 'kurio',
    })
    expect(created.status).toBe(200)
    expect(await (await fetch('/api/carrinho')).json()).toEqual({ lines: [] })
    expect(await (await postJson('/api/cotacao', {})).json()).toMatchObject({
      subtotal: '0.00',
      networkFee: '0.00',
      total: '0.00',
    })
    await postJson('/api/carrinho/fusao', { lines: [{ nftId: 'violet-nomad-314', quantity: 1 }] })
    expect(lineIds(await (await fetch('/api/carrinho')).json())).toEqual(['violet-nomad-314'])
    expect(await (await postJson('/api/cotacao', {})).json()).toMatchObject({
      subtotal: '1.39',
      total: '1.406',
    })
  })

  it('o recomeço devolve o carrinho da semente e o visitante não grava linha', async () => {
    const denied = await fetch('/api/carrinho')
    expect(denied.status).toBe(401)
    const guest = await postJson('/api/cotacao', { lines: [{ nftId: 'emerald-ape-042', quantity: 1 }] })
    expect(await guest.json()).toMatchObject({ subtotal: '1.19', networkFee: '0.016', total: '1.206' })
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])

    await enter('ada@kurio.test')
    await postJson('/api/carrinho/itens', { nftId: 'emerald-ape-042' })
    expect((await fetch('/api/dev/reset', { method: 'POST' })).status).toBe(204)
    expect(await fetch('/api/carrinho')).toMatchObject({ status: 401 })
    await enter('ada@kurio.test')
    expect(await (await fetch('/api/carrinho')).json()).toEqual({
      lines: [
        {
          nftId: 'sage-nomad-009',
          name: 'Sage Nomad #009',
          image: '/home/sage.png',
          unitPrice: '1.69',
          quantity: 1,
        },
      ],
    })
    await fetch('/api/sessao', { method: 'DELETE' })
    await enter('bruno@kurio.test')
    expect(lineQuantity(await (await fetch('/api/carrinho')).json(), 'cosmic-bloom-118')).toBe(2)
  })

  it('grava o recibo uma vez, isola a pessoa e o recomeço apaga a chave', async () => {
    expect((await fetch('/api/pedidos/ped-ada-1')).status).toBe(401)
    const guest = await postJson('/api/pedidos', {
      key: 'chave-visitante',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(guest.status).toBe(401)
    expect(readUsers()[0]?.orders).toHaveLength(1)

    await enter('ada@kurio.test')
    const adaSeed = await (await fetch('/api/pedidos/ped-ada-1')).json()
    expect(adaSeed).toMatchObject({
      id: 'ped-ada-1',
      total: '1.79',
      networkFee: '0.00',
      status: 'confirmado',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      transactionId: '0xADA1000000000000000000000000A1E1',
      lines: [{ nftId: 'ivory-baron-088', name: 'Ivory Baron #088', quantity: 1, total: '1.79' }],
    })
    expect((await fetch('/api/pedidos/ped-bruno-1')).status).toBe(404)
    expect((await fetch('/api/pedidos/ped-9')).status).toBe(404)

    const mismatch = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'ivory-baron-088', quantity: 1 }],
    })
    expect(mismatch.status).toBe(400)
    expect(await mismatch.json()).toEqual({ message: 'O carrinho não confere com o pedido.' })
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])

    const created = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
      total: '99',
    })
    expect(created.status).toBe(200)
    const receipt = await created.json()
    expect(receipt).toMatchObject({
      status: 'pendente',
      networkFee: '0.016',
      total: '1.706',
      wallet: 'MetaMask',
      date: '29 Jul, 2026',
      lines: [{ nftId: 'sage-nomad-009', name: 'Sage Nomad #009', quantity: 1, total: '1.69' }],
    })
    expect(receipt.id).not.toBe('ped-ada-1')
    expect(readUsers()[0]?.cart).toEqual([])
    expect(readUsers()[0]?.orders).toHaveLength(2)
    expect(readUsers()[1]?.orders[0]?.total).toBe('0.39')

    const replay = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(replay.status).toBe(200)
    expect(await replay.json()).toMatchObject({ id: receipt.id, total: '1.706', transactionId: receipt.transactionId })
    expect(readUsers()[0]?.orders).toHaveLength(2)
    expect(readUsers()[0]?.cart).toEqual([])

    const conflict = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'sage-nomad-009', quantity: 2 }],
    })
    expect(conflict.status).toBe(409)
    expect(await conflict.json()).toEqual({ message: 'Esta chave já fechou outro pedido.' })
    expect(readUsers()[0]?.orders).toHaveLength(2)

    const empty = await postJson('/api/pedidos', { key: 'chave-vazia', lines: [] })
    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ message: 'O carrinho está vazio.' })

    updateLiveStore((store) => {
      const nft = store.nfts.find((item) => item.id === 'sage-nomad-009')
      if (!nft) throw new Error('peça ausente')
      nft.price = '9.99'
      nft.name = 'Sage Mudou'
    })
    const reread = await (await fetch(`/api/pedidos/${receipt.id}`)).json()
    expect(reread.lines[0]).toMatchObject({ name: 'Sage Nomad #009', total: '1.69' })
    expect(reread.total).toBe('1.706')

    await fetch('/api/sessao', { method: 'DELETE' })
    await enter('bruno@kurio.test')
    const brunoSeed = await (await fetch('/api/pedidos/ped-bruno-1')).json()
    expect(brunoSeed).toMatchObject({
      id: 'ped-bruno-1',
      total: '0.39',
      transactionId: '0xB200000000000000000000000000B2E2',
      lines: [{ nftId: 'golden-signal-160', quantity: 1, total: '0.39' }],
    })
    expect((await fetch(`/api/pedidos/${receipt.id}`)).status).toBe(404)
    const bruno = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'cosmic-bloom-118', quantity: 2 }],
    })
    expect(bruno.status).toBe(200)
    expect(await bruno.json()).toMatchObject({
      total: '2.596',
      networkFee: '0.016',
      lines: [{ nftId: 'cosmic-bloom-118', quantity: 2, total: '2.58' }],
    })
    expect(readUsers()[0]?.orders[1]?.total).toBe('1.706')
    expect(readUsers()[1]?.cart).toEqual([])

    expect((await fetch('/api/dev/reset', { method: 'POST' })).status).toBe(204)
    expect(readUsers()).toEqual(happyUsers)
    await enter('ada@kurio.test')
    const again = await postJson('/api/pedidos', {
      key: 'chave-ada-1',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(again.status).toBe(200)
    expect(readUsers()[0]?.orders).toHaveLength(2)
    expect(readUsers()[0]?.orders[0]?.id).toBe('ped-ada-1')
    expect(readUsers()[0]?.orders[0]?.total).toBe('1.79')
  })

  it('falha no fecho não grava a chave', async () => {
    server.use(http.post('/api/pedidos', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    await enter('ada@kurio.test')
    const failed = await postJson('/api/pedidos', {
      key: 'chave-ada-2',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(failed.status).toBe(500)
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])
    expect(readUsers()[0]?.orders).toHaveLength(1)

    server.resetHandlers()
    const retried = await postJson('/api/pedidos', {
      key: 'chave-ada-2',
      lines: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    })
    expect(retried.status).toBe(200)
    expect(await retried.json()).toMatchObject({ total: '1.706' })
    expect(readUsers()[0]?.cart).toEqual([])
  })
})

async function postJson(path: string, body: unknown) {
  return fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function enter(email: string) {
  const response = await postJson('/api/sessao', { email, password: 'kurio' })
  expect(response.status).toBe(200)
}

function lineIds(body: unknown) {
  if (!isRecord(body) || !Array.isArray(body.lines)) throw new Error('carrinho inválido')
  return body.lines.map((line) => {
    if (!isRecord(line) || typeof line.nftId !== 'string') throw new Error('linha inválida')
    return line.nftId
  })
}

function lineQuantity(body: unknown, nftId: string) {
  if (!isRecord(body) || !Array.isArray(body.lines)) throw new Error('carrinho inválido')
  const line = body.lines.find((item) => isRecord(item) && item.nftId === nftId)
  if (!isRecord(line) || typeof line.quantity !== 'number') throw new Error('quantidade ausente')
  return line.quantity
}
