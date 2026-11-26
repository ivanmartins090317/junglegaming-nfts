import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { createAppQueryClient, setAppQueryClient } from '@/lib/query/session.ts'
import { closeOrder } from '@/lib/api/order.ts'
import { handlers } from '@/mocks/handlers.ts'
import { resetStore, updateLiveStore } from '@/mocks/store.ts'
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
  return { container, router, root }
}

async function enter(email: string) {
  const response = await fetch('/api/sessao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'kurio' }),
  })
  expect(response.status).toBe(200)
}

async function click(element: Element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  })
}

describe('confirmação', () => {
  const mounted: Array<Awaited<ReturnType<typeof mount>>> = []

  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' })
  })

  beforeEach(() => {
    resetStore()
  })

  afterEach(async () => {
    server.resetHandlers()
    await act(async () => {
      for (const view of mounted) view.root.unmount()
    })
    mounted.length = 0
    document.body.replaceChildren()
  })

  afterAll(() => {
    server.close()
  })

  it('mostra o recibo da Ada e o X volta ao início', async () => {
    await enter('ada@kurio.test')
    const view = await mount('/pedidos/ped-ada-1', 1440)
    mounted.push(view)

    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Ivory Baron #088')
    })
    expect(view.container.querySelector('header')).toBeNull()
    expect(view.container.querySelector('nav[aria-label="Atalhos"]')).toBeNull()
    expect(view.container.textContent).toContain('Seus NFTs agora estão na sua carteira')
    expect(view.container.textContent).toContain('THANK')
    expect(view.container.textContent).toContain('YOU')
    expect(view.container.textContent).toContain('0xADA1…A1E1')
    expect(view.container.textContent).toContain('29 Jul, 2026')
    expect(view.container.textContent).toContain('1.79 ETH')
    expect(view.container.textContent).toContain('MetaMask')
    expect(view.container.textContent).toContain('ID do token: ivory-baron-088')
    expect(view.container.textContent).toContain('(x 1)')
    expect(view.container.textContent).toContain('0.00 ETH')
    expect(view.container.textContent).toContain(
      'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.',
    )
    expect(view.container.textContent).not.toContain('26.846 ETH')
    expect(view.container.textContent).not.toContain('Emerald Ape #042')

    const page = view.container.querySelector('[data-order="pagina"]')
    if (!page) throw new Error('página ausente')
    await click(page)
    expect(view.router.state.location.pathname).toBe('/pedidos/ped-ada-1')

    const etherscan = [...view.container.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Ver no Etherscan',
    )
    if (!etherscan) throw new Error('botão ausente')
    await click(etherscan)
    expect(view.router.state.location.pathname).toBe('/pedidos/ped-ada-1')
    expect(view.container.textContent?.toLowerCase()).not.toContain('sucesso')

    const close = view.container.querySelector('button[aria-label="Fechar"]')
    if (!close) throw new Error('fechar ausente')
    await click(close)
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/')
    })
  })

  it('não abre o pedido do Bruno na sessão da Ada', async () => {
    await enter('ada@kurio.test')
    const view = await mount('/pedidos/ped-bruno-1', 1440)
    mounted.push(view)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Pedido não encontrado.')
    })
    expect(view.container.textContent).not.toContain('Golden Signal #160')
    expect(view.container.querySelector('article')).toBeNull()
  })

  it('em 390 o modal encaixa na coluna e a casca continua fora', async () => {
    await enter('ada@kurio.test')
    const view = await mount('/pedidos/ped-ada-1', 390)
    mounted.push(view)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Ivory Baron #088')
    })
    const page = view.container.querySelector('[data-order="pagina"]')
    expect(page?.className).toContain('px-7')
    expect(view.container.querySelector('article')?.className).toContain('max-w-[358px]')
    expect(view.container.querySelector('header')).toBeNull()
    expect(view.container.querySelector('nav[aria-label="Atalhos"]')).toBeNull()
  })

  it('mostra aguardando no pedido novo e recusa sem modal', async () => {
    await enter('ada@kurio.test')
    const created = await closeOrder('chave-page-1', [{ nftId: 'sage-nomad-009', quantity: 1 }])
    const waiting = await mount(`/pedidos/${created.id}`, 1440)
    mounted.push(waiting)
    await vi.waitFor(() => {
      expect(waiting.container.textContent).toContain('Aguardando confirmação do pedido.')
    })
    expect(waiting.container.textContent).not.toContain(
      'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.',
    )
    expect(waiting.container.querySelector('article')).toBeNull()

    updateLiveStore((store) => {
      const user = store.users.find((item) => item.id === 'usr-ada')
      const order = user?.orders.find((item) => item.id === created.id)
      if (!order) throw new Error('pedido ausente')
      order.status = 'recusado'
    })
    const refused = await mount(`/pedidos/${created.id}`, 1440)
    mounted.push(refused)
    await vi.waitFor(() => {
      expect(refused.container.textContent).toContain('Pedido recusado.')
    })
    expect(refused.container.querySelector('article')).toBeNull()
    expect(refused.container.textContent).not.toContain(
      'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.',
    )
  })

  it('mostra carregando e a frase de falha sem o modal', async () => {
    let release = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    server.use(
      http.get('/api/pedidos/:pedidoId', async () => {
        await gate
        return HttpResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 })
      }),
    )
    await enter('ada@kurio.test')
    const loading = await mount('/pedidos/ped-ada-1', 1440)
    mounted.push(loading)
    expect(loading.container.textContent).toContain('Carregando')
    expect(loading.container.querySelector('article')).toBeNull()
    release()
    await vi.waitFor(() => {
      expect(loading.container.textContent).toContain('Pedido não encontrado.')
    })

    server.use(http.get('/api/pedidos/:pedidoId', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    const failed = await mount('/pedidos/ped-9', 1440)
    mounted.push(failed)
    await vi.waitFor(() => {
      expect(failed.container.textContent).toContain('Não foi possível carregar o pedido.')
    })
    expect(failed.container.querySelector('article')).toBeNull()
  })
})
