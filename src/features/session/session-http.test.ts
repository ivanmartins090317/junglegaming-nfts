import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { handlers } from '@/mocks/handlers.ts'
import { readSessionUser, readUsers, resetStore } from '@/mocks/store.ts'

const server = setupServer(...handlers)

async function post(path: string, body: Record<string, string>) {
  return fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('endereços da sessão', () => {
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

  it('entra Ada e Bruno sem devolver a senha e sem diferenciar maiúsculas no e-mail', async () => {
    const ada = await post('/api/sessao', { email: 'Ada@kurio.test', password: 'kurio' })
    expect(ada.status).toBe(200)
    expect(await ada.json()).toEqual({
      id: 'usr-ada',
      name: 'Ada',
      email: 'ada@kurio.test',
    })
    expect(JSON.stringify(await (await fetch('/api/sessao')).json())).not.toContain('password')
    expect(readUsers()[0]?.favorites).toEqual(['emerald-ape-042', 'neon-vessel-552'])

    const wrongCase = await post('/api/sessao', { email: 'bruno@kurio.test', password: 'Kurio' })
    expect(wrongCase.status).toBe(401)
    expect(await wrongCase.json()).toEqual({ message: 'E-mail ou senha não conferem.' })
    expect(readSessionUser()?.id).toBe('usr-ada')

    const bruno = await post('/api/sessao', { email: 'bruno@kurio.test', password: 'kurio' })
    expect(await bruno.json()).toEqual({
      id: 'usr-bruno',
      name: 'Bruno',
      email: 'bruno@kurio.test',
    })
    expect(readSessionUser()?.id).toBe('usr-bruno')
  })

  it('recusa credencial vazia ou desconhecida', async () => {
    const empty = await post('/api/sessao', { email: '', password: '' })
    expect(empty.status).toBe(401)
    expect(await empty.json()).toEqual({ message: 'E-mail ou senha não conferem.' })

    const missing = await post('/api/sessao', { email: 'lia@kurio.test', password: 'kurio' })
    expect(missing.status).toBe(401)
    expect(readSessionUser()).toBeNull()
  })

  it('cria Lia, recusa cadastro inválido e o recomeço devolve a semente', async () => {
    const created = await post('/api/cadastro', {
      name: 'Lia',
      email: 'lia@kurio.test',
      password: 'kurio',
      confirmPassword: 'kurio',
    })
    expect(created.status).toBe(200)
    expect(await created.json()).toEqual({
      id: 'usr-3',
      name: 'Lia',
      email: 'lia@kurio.test',
    })
    const lia = readUsers().find((user) => user.id === 'usr-3')
    expect(lia?.favorites).toEqual([])
    expect(lia?.cart).toEqual([])
    expect(lia?.orders).toEqual([])

    const next = await post('/api/cadastro', {
      name: 'Nilo',
      email: 'nilo@kurio.test',
      password: 'kurio',
      confirmPassword: 'kurio',
    })
    expect((await next.json()).id).toBe('usr-4')

    const empty = await post('/api/cadastro', {
      name: '   ',
      email: '',
      password: '',
      confirmPassword: '',
    })
    expect(empty.status).toBe(400)
    expect(await empty.json()).toEqual({ message: 'Informe nome, e-mail e senha.' })

    const mismatch = await post('/api/cadastro', {
      name: 'Lia',
      email: 'outra@kurio.test',
      password: 'kurio',
      confirmPassword: 'outra',
    })
    expect(mismatch.status).toBe(400)
    expect(await mismatch.json()).toEqual({ message: 'As senhas não conferem.' })

    const taken = await post('/api/cadastro', {
      name: 'Ada',
      email: 'ADA@kurio.test',
      password: 'kurio',
      confirmPassword: 'kurio',
    })
    expect(taken.status).toBe(409)
    expect(await taken.json()).toEqual({ message: 'Este e-mail já tem conta.' })
    expect(readSessionUser()?.id).toBe('usr-4')

    const reset = await fetch('/api/dev/reset', { method: 'POST' })
    expect(reset.status).toBe(204)
    expect(readSessionUser()).toBeNull()
    expect(readUsers().map((user) => user.id)).toEqual(['usr-ada', 'usr-bruno'])

    const again = await post('/api/cadastro', {
      name: 'Lia',
      email: 'lia@kurio.test',
      password: 'kurio',
      confirmPassword: 'kurio',
    })
    expect((await again.json()).id).toBe('usr-3')
  })

  it('visitante recebe não autorizado e sair apaga a sessão', async () => {
    const visitor = await fetch('/api/sessao')
    expect(visitor.status).toBe(401)

    await post('/api/sessao', { email: 'ada@kurio.test', password: 'kurio' })
    const left = await fetch('/api/sessao', { method: 'DELETE' })
    expect(left.status).toBe(204)
    expect(await left.text()).toBe('')
    expect((await fetch('/api/sessao')).status).toBe(401)
    expect((await fetch('/api/nfts')).status).toBe(200)
  })
})
