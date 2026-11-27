import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { readGuestDraft, writeGuestDraft } from '@/features/cart/guest-draft.ts'
import { resetMergeState } from '@/features/cart/merge-guest.ts'
import { createAppQueryClient, setAppQueryClient } from '@/lib/query/session.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readSessionUser, readUsers, resetStore } from '@/mocks/store.ts'
import { routeTree } from '@/routeTree.gen.ts'

const server = setupServer(...handlers)

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
}

async function mount(path: string, width = 1440) {
  setViewport(width)
  const history = createMemoryHistory({ initialEntries: [path] })
  const router = createRouter({
    routeTree,
    history,
    parseSearch: parseCatalogLocation,
    stringifySearch: stringifyCatalogLocation,
  })
  const queryClient = createAppQueryClient()
  setAppQueryClient(queryClient)
  await router.load()
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )
  })
  return { container, router, root, queryClient }
}

function buttonNamed(container: ParentNode, name: string) {
  const found = [...container.querySelectorAll('button')].find((item) => item.textContent?.trim() === name)
  if (!found) throw new Error(`Botão ausente: ${name}`)
  return found
}

function field(container: ParentNode, label: string) {
  const root = container.querySelector('[role="dialog"]') ?? container
  const found = root.querySelector(`[aria-label="${label}"]`)
  if (!(found instanceof HTMLInputElement)) throw new Error(`Campo ausente: ${label}`)
  return found
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click()
  })
}

async function fill(input: HTMLInputElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

async function signIn(container: ParentNode, email: string, password: string) {
  await fill(field(container, 'E-mail'), email)
  await fill(field(container, 'Senha'), password)
  await click(buttonNamed(field(container, 'E-mail').closest('form') as HTMLElement, 'Entrar'))
}

describe('fusão na entrada e saída', () => {
  const mounted: Array<Awaited<ReturnType<typeof mount>>> = []

  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' })
  })

  afterEach(async () => {
    server.resetHandlers()
    resetStore()
    resetMergeState()
    sessionStorage.clear()
    await act(async () => {
      for (const view of mounted) view.root.unmount()
    })
    mounted.length = 0
    document.body.replaceChildren()
  })

  afterAll(() => {
    server.close()
  })

  it('entrar soma a quantidade e esvazia o rascunho', async () => {
    writeGuestDraft([
      { nftId: 'sage-nomad-009', quantity: 2 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])
    const view = await mount('/', 1440)
    mounted.push(view)
    await click(buttonNamed(view.container, 'Entrar'))
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(buttonNamed(view.container, 'Sair')).toBeTruthy()
    })
    expect(readGuestDraft()).toEqual([])
    expect(readUsers()[0]?.cart).toEqual([
      { nftId: 'sage-nomad-009', quantity: 3 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])

    await click(buttonNamed(view.container, 'Sair'))
    await vi.waitFor(() => {
      expect(readSessionUser()).toBeNull()
      expect(buttonNamed(view.container, 'Entrar')).toBeTruthy()
    })
    expect(readGuestDraft()).toEqual([])
    expect(readUsers()[0]?.cart).toEqual([
      { nftId: 'sage-nomad-009', quantity: 3 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])
    const cart = view.container.querySelector('header a[aria-label^="Carrinho"]')
    if (!(cart instanceof HTMLElement)) throw new Error('Carrinho ausente')
    await click(cart)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Seu carrinho está vazio.')
    })
    expect(view.container.textContent).not.toContain('Sage Nomad #009')
  })

  it('criar conta também funde e o rascunho vazio não mostra falha', async () => {
    writeGuestDraft([{ nftId: 'violet-nomad-314', quantity: 1 }])
    const view = await mount('/?conta=cadastro', 1440)
    mounted.push(view)
    await fill(field(view.container, 'Nome de usuário'), 'Lia')
    await fill(field(view.container, 'E-mail'), 'lia@kurio.test')
    await fill(field(view.container, 'Senha'), 'kurio')
    await fill(field(view.container, 'Confirmar senha'), 'kurio')
    await click(buttonNamed(field(view.container, 'E-mail').closest('form') as HTMLElement, 'Criar conta'))
    await vi.waitFor(() => {
      expect(buttonNamed(view.container, 'Sair')).toBeTruthy()
    })
    expect(readGuestDraft()).toEqual([])
    expect(readUsers().find((user) => user.email === 'lia@kurio.test')?.cart).toEqual([
      { nftId: 'violet-nomad-314', quantity: 1 },
    ])
    expect(view.container.textContent).not.toContain('Não foi possível guardar o carrinho.')
  })

  it('se a fusão falha o rascunho fica e a entrada seguinte grava', async () => {
    writeGuestDraft([{ nftId: 'emerald-ape-042', quantity: 1 }])
    server.use(http.post('/api/carrinho/fusao', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    const view = await mount('/carrinho', 1440)
    mounted.push(view)
    await click(buttonNamed(view.container, 'Entrar'))
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Não foi possível guardar o carrinho.')
    })
    expect(view.router.state.location.href).toContain('conta=entrar')
    expect(readGuestDraft()).toEqual([{ nftId: 'emerald-ape-042', quantity: 1 }])
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])

    server.resetHandlers()
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(view.router.state.location.href).not.toContain('conta=')
    })
    expect(readGuestDraft()).toEqual([])
    expect(readUsers()[0]?.cart).toEqual([
      { nftId: 'sage-nomad-009', quantity: 1 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Emerald Ape #042')
    })
    expect(view.container.textContent).not.toContain('Não foi possível guardar o carrinho.')
  })
})
