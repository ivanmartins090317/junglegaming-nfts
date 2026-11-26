import { QueryClient } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { readGuestDraft, writeGuestDraft } from '@/features/cart/guest-draft.ts'
import { mergeGuestDraft, readMergeFailed, resetMergeState } from '@/features/cart/merge-guest.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore } from '@/mocks/store.ts'

const server = setupServer(...handlers)

async function enterAda() {
  const response = await fetch('/api/sessao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ada@kurio.test', password: 'kurio' }),
  })
  expect(response.status).toBe(200)
}

describe('fusão do rascunho', () => {
  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' })
  })

  beforeEach(() => {
    resetStore()
    resetMergeState()
    sessionStorage.clear()
  })

  afterEach(() => {
    server.resetHandlers()
    resetMergeState()
    sessionStorage.clear()
  })

  afterAll(() => {
    server.close()
  })

  it('só apaga o rascunho depois do sucesso e não envia de novo no meio', async () => {
    await enterAda()
    writeGuestDraft([{ nftId: 'emerald-ape-042', quantity: 1 }])
    const queryClient = new QueryClient()
    queryClient.setQueryData(sessionQueryKey, {
      id: 'usr-ada',
      name: 'Ada',
      email: 'ada@kurio.test',
    })
    let release: () => void = () => {}
    let calls = 0
    server.use(
      http.post('/api/carrinho/fusao', async () => {
        calls += 1
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return HttpResponse.json({ lines: [] })
      }),
    )

    const first = mergeGuestDraft(queryClient)
    await vi.waitFor(() => {
      expect(calls).toBe(1)
    })
    expect(await mergeGuestDraft(queryClient)).toBe('busy')
    expect(readGuestDraft()).toEqual([{ nftId: 'emerald-ape-042', quantity: 1 }])
    release()
    await expect(first).resolves.toBe('merged')
    expect(readGuestDraft()).toEqual([])
    expect(readMergeFailed()).toBe(false)
  })

  it('mantém o rascunho quando a gravação falha e a tentativa seguinte grava', async () => {
    await enterAda()
    writeGuestDraft([{ nftId: 'emerald-ape-042', quantity: 1 }])
    const queryClient = new QueryClient()
    queryClient.setQueryData(sessionQueryKey, {
      id: 'usr-ada',
      name: 'Ada',
      email: 'ada@kurio.test',
    })
    server.use(http.post('/api/carrinho/fusao', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))

    expect(await mergeGuestDraft(queryClient)).toBe('failed')
    expect(readMergeFailed()).toBe(true)
    expect(readGuestDraft()).toEqual([{ nftId: 'emerald-ape-042', quantity: 1 }])
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])

    server.resetHandlers()
    expect(await mergeGuestDraft(queryClient)).toBe('merged')
    expect(readMergeFailed()).toBe(false)
    expect(readGuestDraft()).toEqual([])
    expect(readUsers()[0]?.cart).toEqual([
      { nftId: 'sage-nomad-009', quantity: 1 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])
  })

  it('não chama a loja quando o rascunho está vazio', async () => {
    let calls = 0
    server.use(
      http.post('/api/carrinho/fusao', () => {
        calls += 1
        return HttpResponse.json({ lines: [] })
      }),
    )
    const queryClient = new QueryClient()
    expect(await mergeGuestDraft(queryClient)).toBe('empty')
    expect(calls).toBe(0)
    expect(readMergeFailed()).toBe(false)
  })
})
