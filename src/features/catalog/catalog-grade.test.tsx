import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { handlers } from '@/mocks/handlers.ts'
import { resetStore } from '@/mocks/store.ts'
import { routeTree } from '@/routeTree.gen.ts'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'

const server = setupServer(...handlers)
const seedNames = [
  'Emerald Ape #042',
  'Sage Nomad #009',
  'Neon Vessel #552',
  'Cosmic Bloom #118',
  'Violet Nomad #314',
  'Ivory Baron #088',
  'Golden Beat #207',
  'Golden Signal #160',
]

async function mount(path: string) {
  const history = createMemoryHistory({ initialEntries: [path] })
  const router = createRouter({
    routeTree,
    history,
    parseSearch: parseCatalogLocation,
    stringifySearch: stringifyCatalogLocation,
  })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
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

function cardNames(container: ParentNode) {
  return [...container.querySelectorAll('#grade h3')].map((node) => node.textContent)
}

async function shownNames(container: ParentNode) {
  await vi.waitFor(() => {
    expect(cardNames(container).length).toBeGreaterThan(0)
  })
  return cardNames(container)
}

describe('grade do catálogo', () => {
  const mounted: Array<Awaited<ReturnType<typeof mount>>> = []

  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' })
  })

  afterEach(async () => {
    server.resetHandlers()
    resetStore()
    await act(async () => {
      for (const view of mounted) view.root.unmount()
    })
    mounted.length = 0
    document.body.replaceChildren()
  })

  afterAll(() => {
    server.close()
  })

  it('pinta as oito peças da loja e mantém o restante do início', async () => {
    const view = await mount('/')
    mounted.push(view)

    expect(await shownNames(view.container)).toEqual(seedNames)
    expect(view.container.textContent).toContain('SEJA DONO DO FUTURO')
    expect(view.container.textContent).toContain('NFT EM DESTAQUE')
    expect(view.container.textContent).toContain('Como funciona a propriedade de NFTs')
    expect(view.container.textContent).toContain('RARO')
    expect(view.container.textContent).toContain('2.29 ETH')
  })

  it('recorta pelo começo do nome e esvazia quando o texto não é prefixo', async () => {
    const neon = await mount('/?q=neon')
    mounted.push(neon)
    expect(await shownNames(neon.container)).toEqual(['Neon Vessel #552'])

    const upper = await mount('/?q=NEON')
    mounted.push(upper)
    expect(await shownNames(upper.container)).toEqual(['Neon Vessel #552'])

    for (const query of ['nomad', '552', 'inexistente']) {
      const view = await mount(`/?q=${query}`)
      mounted.push(view)
      await vi.waitFor(() => {
        expect(view.container.textContent).toContain('Nenhuma peça com esse nome.')
      })
      expect(cardNames(view.container)).toEqual([])
      expect(view.container.textContent).not.toContain('Sage Nomad #009')
      expect(view.container.textContent).not.toContain('Neon Vessel #552')
    }
  })

  it('tira q do endereço e devolve as oito peças quando a busca é apagada', async () => {
    const view = await mount('/?q=neon')
    mounted.push(view)
    expect(await shownNames(view.container)).toEqual(['Neon Vessel #552'])

    const input = view.container.querySelector('header input')
    if (!(input instanceof HTMLInputElement)) throw new Error('Campo de busca ausente')
    await typeSearch(input, '')

    await vi.waitFor(() => {
      expect(view.router.state.location.href).not.toContain('q=')
    })
    expect(await shownNames(view.container)).toEqual(seedNames)
  })

  it('não muda a lista nem o endereço quando a aba, o filtro ou a página mudam', async () => {
    const view = await mount('/?q=sage')
    mounted.push(view)
    expect(await shownNames(view.container)).toEqual(['Sage Nomad #009'])

    await act(async () => {
      clickText(view.container, 'Em alta')
      clickText(view.container, 'Música')
      clickText(view.container, 'Ethereum')
      clickText(view.container, 'Aplicar')
      clickText(view.container, 'Listados recentemente')
      clickText(view.container, '3')
    })

    expect(view.router.state.location.href).toContain('q=sage')
    expect(view.router.state.location.href).not.toContain('aba')
    expect(cardNames(view.container)).toEqual(['Sage Nomad #009'])
    expect(view.container.querySelector('[aria-pressed="true"]')).not.toBeNull()
  })

  it('abre a peça pelo card e o coração fica na grade', async () => {
    const view = await mount('/?q=neon')
    mounted.push(view)
    expect(await shownNames(view.container)).toEqual(['Neon Vessel #552'])

    const heart = view.container.querySelector('button[aria-label="Salvar Neon Vessel #552"]')
    if (!(heart instanceof HTMLButtonElement)) throw new Error('Coração ausente')
    await act(async () => {
      heart.click()
    })
    expect(heart.getAttribute('aria-pressed')).toBe('true')
    expect(view.router.state.location.pathname).toBe('/')
    expect(view.router.state.location.href).toContain('q=neon')

    const card = [...view.container.querySelectorAll('a')].find((anchor) =>
      anchor.textContent?.includes('Neon Vessel #552'),
    )
    await act(async () => {
      card?.click()
    })
    expect(view.router.state.location.pathname).toBe('/nfts/neon-vessel-552')
    expect(view.router.state.location.href).toContain('q=neon')
  })

  it('mostra Carregando e, se a leitura falha, a frase do catálogo', async () => {
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    server.use(
      http.get('/api/nfts', async () => {
        await gate
        return HttpResponse.json([
          { id: 'emerald-ape-042', name: 'Emerald Ape #042', price: '1.19', image: '/home/emerald.png' },
        ])
      }),
    )
    const loading = await mount('/')
    mounted.push(loading)
    expect(loading.container.textContent).toContain('Carregando')
    expect(loading.container.textContent).toContain('SEJA DONO DO FUTURO')
    expect(loading.container.textContent).toContain('OFERTA LIMITADA')
    release()
    await vi.waitFor(() => {
      expect(loading.container.textContent).toContain('Emerald Ape #042')
    })

    server.use(http.get('/api/nfts', () => HttpResponse.error()))
    const failed = await mount('/')
    mounted.push(failed)
    await vi.waitFor(() => {
      expect(failed.container.textContent).toContain('Não foi possível carregar o catálogo.')
    })
    expect(failed.container.textContent).toContain('Como funciona a propriedade de NFTs')
    expect(failed.container.textContent).not.toContain('Nenhuma peça com esse nome.')
  })
})

function clickText(container: ParentNode, text: string) {
  const target = [...container.querySelectorAll('button')].find(
    (button) => button.textContent?.trim() === text,
  )
  target?.click()
}

async function typeSearch(input: HTMLInputElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
