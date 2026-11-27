import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { writeGuestDraft } from '@/features/cart/guest-draft.ts'
import { resetMergeState } from '@/features/cart/merge-guest.ts'
import { createAppQueryClient, setAppQueryClient } from '@/lib/query/session.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore } from '@/mocks/store.ts'
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

function region(container: ParentNode, name: string) {
  const found = container.querySelector(`[data-cart="${name}"]`)
  if (!found) throw new Error(`Região ausente: ${name}`)
  return found
}

function field(root: ParentNode, name: string) {
  return root.querySelector(`[data-field="${name}"]`)?.textContent
}

function badge(container: ParentNode) {
  return container.querySelector('header a[aria-label^="Carrinho"] span')?.textContent
}

function button(root: ParentNode, label: string) {
  const found = [...root.querySelectorAll('button')].find(
    (item) => item.getAttribute('aria-label') === label || item.textContent?.trim() === label,
  )
  if (!found) throw new Error(`Botão ausente: ${label}`)
  return found
}

async function click(element: HTMLElement) {
  await act(async () => {
    element.click()
  })
}

async function enter(email: string) {
  const response = await fetch('/api/sessao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'kurio' }),
  })
  expect(response.status).toBe(200)
}

describe('carrinho', () => {
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

  it('mostra a semente da Ada e o total da cotação', async () => {
    await enter('ada@kurio.test')
    const view = await mount('/carrinho', 1440)
    mounted.push(view)
    await vi.waitFor(() => {
      expect(region(view.container, 'lines-desktop').textContent).toContain('Sage Nomad #009')
    })
    const lines = region(view.container, 'lines-desktop')
    expect(lines.textContent).toContain('ID do token: sage-nomad-009')
    expect(lines.textContent).toContain('1.69 ETH')
    expect(button(lines, 'Diminuir Sage Nomad #009').hasAttribute('disabled')).toBe(true)
    const summary = region(view.container, 'summary-desktop')
    await vi.waitFor(() => {
      expect(field(summary, 'total')).toBe('1.706 ETH')
    })
    expect(field(summary, 'subtotal')).toBe('1.69 ETH')
    expect(field(summary, 'discount')).toBe('(-) 00.00')
    expect(field(summary, 'fee')).toBe('0.016 ETH')
    expect(summary.textContent).toContain('Taxa estimada')
    expect(badge(view.container)).toBe('1')
    expect(region(view.container, 'lines-mobile').textContent).toContain('sage-nomad-009')
    expect(region(view.container, 'lines-mobile').textContent).not.toContain('ID do token')
    expect(region(view.container, 'lines-mobile').textContent).not.toContain('Edição:')
    expect(region(view.container, 'lines-mobile').querySelector('[aria-label^="Remover"]')).toBeNull()
    expect(view.container.querySelector('nav[aria-label="Atalhos"]')).toBeNull()
    const shell = view.container.querySelector('[class*="desktop:px-[120px]"]')
    expect(shell?.className).toContain('px-7')
    expect(shell?.className).not.toContain('pb-28')
    const home = [...view.container.querySelectorAll('nav a, nav button')].find(
      (item) => item.textContent?.trim() === 'Início',
    )
    const market = [...view.container.querySelectorAll('nav a, nav button')].find(
      (item) => item.textContent?.trim() === 'Mercado',
    )
    expect(home?.className).not.toContain('text-text-accent')
    expect(market?.className).not.toContain('text-text-accent')
    expect(view.container.textContent).not.toContain('26.846')
    expect(view.container.textContent).not.toContain('8.936')
  })

  it('não mostra o carrinho da Ada para o Bruno', async () => {
    await enter('bruno@kurio.test')
    const view = await mount('/carrinho')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(region(view.container, 'lines-desktop').textContent).toContain('Cosmic Bloom #118')
    })
    const lines = region(view.container, 'lines-desktop')
    expect(lines.textContent).not.toContain('Sage Nomad')
    expect(button(lines, 'Aumentar Cosmic Bloom #118')).toBeTruthy()
    const summary = region(view.container, 'summary-desktop')
    await vi.waitFor(() => {
      expect(field(summary, 'total')).toBe('2.596 ETH')
    })
    expect(field(summary, 'subtotal')).toBe('2.58 ETH')
    expect(badge(view.container)).toBe('2')
  })

  it('o visitante muda a quantidade e o menos na unidade não tira a linha', async () => {
    writeGuestDraft([{ nftId: 'emerald-ape-042', quantity: 1 }])
    const view = await mount('/carrinho')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(field(region(view.container, 'summary-desktop'), 'total')).toBe('1.206 ETH')
    })
    const lines = region(view.container, 'lines-desktop')
    expect(button(lines, 'Diminuir Emerald Ape #042').hasAttribute('disabled')).toBe(true)
    await click(button(lines, 'Diminuir Emerald Ape #042'))
    expect(lines.textContent).toContain('Emerald Ape #042')
    await click(button(lines, 'Aumentar Emerald Ape #042'))
    await vi.waitFor(() => {
      expect(field(region(view.container, 'summary-desktop'), 'subtotal')).toBe('2.38 ETH')
    })
    expect(field(region(view.container, 'summary-desktop'), 'total')).toBe('2.396 ETH')
    expect(field(region(view.container, 'summary-desktop'), 'discount')).toBe('(-) 00.00')
    expect(field(region(view.container, 'summary-desktop'), 'fee')).toBe('0.016 ETH')
    expect(badge(view.container)).toBe('2')
    await click(button(lines, 'Diminuir Emerald Ape #042'))
    await vi.waitFor(() => {
      expect(field(region(view.container, 'summary-desktop'), 'total')).toBe('1.206 ETH')
    })
  })

  it('a lixeira tira a linha no desktop e o carrinho vazio zera a cotação', async () => {
    await enter('ada@kurio.test')
    const view = await mount('/carrinho')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(region(view.container, 'lines-desktop').textContent).toContain('Sage Nomad #009')
    })
    const lines = region(view.container, 'lines-desktop')
    await click(button(lines, 'Remover Sage Nomad #009'))
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Seu carrinho está vazio.')
    })
    const summary = region(view.container, 'summary-desktop')
    await vi.waitFor(() => {
      expect(field(summary, 'total')).toBe('0.00 ETH')
    })
    expect(field(summary, 'subtotal')).toBe('0.00 ETH')
    expect(field(summary, 'fee')).toBe('0.00 ETH')
    expect(field(summary, 'discount')).toBe('(-) 00.00')
    expect(badge(view.container)).toBe('0')
    expect(readUsers()[1]?.cart).toEqual([{ nftId: 'cosmic-bloom-118', quantity: 2 }])
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()

    const empty = await mount('/carrinho')
    mounted.push(empty)
    await vi.waitFor(() => {
      expect(empty.container.textContent).toContain('Seu carrinho está vazio.')
    })
    await click(button(region(empty.container, 'summary-desktop'), 'Conectar e finalizar'))
    expect(empty.router.state.location.pathname).toBe('/carrinho')
  })

  it('mostra carregando e a falha sem usar os números do desenho', async () => {
    await enter('ada@kurio.test')
    let release: () => void = () => {}
    server.use(
      http.get('/api/carrinho', async () => {
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return HttpResponse.json({ lines: [] })
      }),
    )
    const loading = await mount('/carrinho')
    mounted.push(loading)
    expect(loading.container.textContent).toContain('Carregando')
    expect(loading.container.textContent).not.toContain('26.846')
    expect(loading.container.textContent).not.toContain('8.936')
    expect(field(region(loading.container, 'summary-desktop'), 'total')).toBe('')
    release()

    server.use(http.get('/api/carrinho', () => HttpResponse.error()))
    const failed = await mount('/carrinho')
    mounted.push(failed)
    await vi.waitFor(() => {
      expect(failed.container.textContent).toContain('Não foi possível carregar o carrinho.')
    })
    expect(field(region(failed.container, 'summary-desktop'), 'total')).toBe('')
  })

  it('mantém a linha quando a cotação ou a gravação falha', async () => {
    await enter('ada@kurio.test')
    server.use(http.post('/api/cotacao', () => HttpResponse.error()))
    const quoted = await mount('/carrinho')
    mounted.push(quoted)
    await vi.waitFor(() => {
      expect(region(quoted.container, 'lines-desktop').textContent).toContain('Sage Nomad #009')
    })
    const lines = region(quoted.container, 'lines-desktop')
    await vi.waitFor(() => {
      expect(quoted.container.textContent).toContain('Não foi possível calcular o total.')
    })
    expect(field(region(quoted.container, 'summary-desktop'), 'total')).toBe('')
    expect(lines.textContent).not.toContain('1.706')

    server.resetHandlers()
    resetStore()
    await enter('ada@kurio.test')
    server.use(http.delete('/api/carrinho/itens/:nftId', () => HttpResponse.error()))
    const blocked = await mount('/carrinho')
    mounted.push(blocked)
    await vi.waitFor(() => {
      expect(region(blocked.container, 'lines-desktop').textContent).toContain('Sage Nomad #009')
    })
    const blockedLines = region(blocked.container, 'lines-desktop')
    await click(button(blockedLines, 'Remover Sage Nomad #009'))
    await vi.waitFor(() => {
      expect(blocked.container.textContent).toContain('Não foi possível atualizar o carrinho.')
    })
    expect(blockedLines.textContent).toContain('Sage Nomad #009')
    expect(readUsers()[0]?.cart).toEqual([{ nftId: 'sage-nomad-009', quantity: 1 }])
  })

  it('cupom, carrossel e atalhos não gravam sucesso e o card abre a peça', async () => {
    const view = await mount('/carrinho', 1440)
    mounted.push(view)
    await vi.waitFor(() => {
      expect(field(region(view.container, 'summary-desktop'), 'discount')).toBe('(-) 00.00')
    })
    const summary = region(view.container, 'summary-desktop')
    const coupon = summary.querySelector('[aria-label="Código promocional"]')
    if (!(coupon instanceof HTMLInputElement)) throw new Error('Cupom ausente')
    await type(coupon, 'KURIO')
    await click(button(summary, 'Aplicar'))
    expect(view.router.state.location.pathname).toBe('/carrinho')
    expect(field(summary, 'discount')).toBe('(-) 00.00')
    expect(view.container.textContent?.toLowerCase()).not.toContain('sucesso')

    await click(button(view.container, 'Página 1'))
    expect(button(view.container, 'Página 2').getAttribute('aria-current')).toBe('true')
    const card = [...region(view.container, 'recommendations').querySelectorAll('a')].find((anchor) =>
      anchor.textContent?.includes('Cosmic Bloom #118'),
    )
    if (!card) throw new Error('Card ausente')
    await click(card)
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/nfts/cosmic-bloom-118')
    })
  })

  it('finalizar pede a entrada sem sessão e continuar explorando abre o início', async () => {
    writeGuestDraft([{ nftId: 'emerald-ape-042', quantity: 1 }])
    const view = await mount('/carrinho', 1440)
    mounted.push(view)
    await vi.waitFor(() => {
      expect(field(region(view.container, 'summary-desktop'), 'total')).toBe('1.206 ETH')
    })
    await click(button(region(view.container, 'summary-desktop'), 'Conectar e finalizar'))
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('conta=entrar')
    })
    expect(view.router.state.location.href).toContain('retorno')

    const home = await mount('/carrinho', 1440)
    mounted.push(home)
    await vi.waitFor(() => {
      expect(home.container.textContent).toContain('Continuar explorando')
    })
    const link = [...home.container.querySelectorAll('a')].find(
      (anchor) => anchor.textContent?.trim() === 'Continuar explorando',
    )
    if (!link) throw new Error('Link ausente')
    await click(link)
    await vi.waitFor(() => {
      expect(home.router.state.location.pathname).toBe('/')
    })
  })

  it('o voltar sai da visita que começou no carrinho e volta da visita anterior', async () => {
    const started = await mount('/carrinho', 390)
    mounted.push(started)
    await click(button(started.container, 'Voltar'))
    await vi.waitFor(() => {
      expect(started.router.state.location.pathname).toBe('/')
    })

    const home = await mount('/', 390)
    mounted.push(home)
    const cart = home.container.querySelector('a[aria-label^="Carrinho"]')
    if (!(cart instanceof HTMLElement)) throw new Error('Carrinho ausente')
    await click(cart)
    await vi.waitFor(() => {
      expect(home.router.state.location.pathname).toBe('/carrinho')
    })
    await click(button(home.container, 'Voltar'))
    await vi.waitFor(() => {
      expect(home.router.state.location.pathname).toBe('/')
    })
  })
})

async function type(input: HTMLInputElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
