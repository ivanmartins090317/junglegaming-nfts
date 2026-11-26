import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { closeOrder } from '@/lib/api/order.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore } from '@/mocks/store.ts'

const server = setupServer(...handlers)

async function enter(email: string) {
  const response = await fetch('/api/sessao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'kurio' }),
  })
  expect(response.status).toBe(200)
}

describe('fecho do pedido no cliente', () => {
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

  it('espera a resposta e a mesma chave devolve o mesmo pedido', async () => {
    await enter('ada@kurio.test')
    const created = await closeOrder('chave-ada-1', [{ nftId: 'sage-nomad-009', quantity: 1 }])
    expect(created.total).toBe('1.706')
    expect(created.lines[0]).toMatchObject({ nftId: 'sage-nomad-009', total: '1.69' })
    expect(readUsers()[0]?.cart).toEqual([])

    const replay = await closeOrder('chave-ada-1', [{ nftId: 'sage-nomad-009', quantity: 1 }])
    expect(replay).toEqual(created)

    await expect(closeOrder('chave-ada-1', [{ nftId: 'sage-nomad-009', quantity: 2 }])).rejects.toThrow(
      'Esta chave já fechou outro pedido.',
    )
    expect(readUsers()[0]?.orders).toHaveLength(2)
  })
})
