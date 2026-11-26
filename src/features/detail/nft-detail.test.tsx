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

function backLink(container: ParentNode) {
  const link = [...container.querySelectorAll('a')].find((anchor) => anchor.textContent?.trim() === 'Voltar')
  if (!link) throw new Error('Voltar ausente')
  return link
}

describe('detalhe da peça', () => {
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

  it('mostra imagem, nome, preços e a marca rara', async () => {
    const view = await mount('/nfts/neon-vessel-552')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Neon Vessel #552')
    })
    const image = view.container.querySelector('img[alt="Neon Vessel #552"]')
    expect(image?.getAttribute('src')).toBe('/home/neon.png')
    expect(image?.className).toContain('rounded-[15px]')
    expect(view.container.textContent).toContain('1.99')
    expect(view.container.textContent).toContain('2.29')
    expect(view.container.textContent).toContain('RARO')
    expect(view.container.querySelector('header')).not.toBeNull()
    expect(backLink(view.container).getAttribute('href')).toBe('/')
  })

  it('separa peça ausente de falha de leitura', async () => {
    const missing = await mount('/nfts/nao-existe')
    mounted.push(missing)
    await vi.waitFor(() => {
      expect(missing.container.textContent).toContain('NFT não encontrado.')
    })
    expect(missing.container.textContent).not.toContain('Não foi possível carregar a peça.')
    expect(missing.container.querySelector('header')).not.toBeNull()

    server.use(http.get('/api/nfts/:nftId', () => HttpResponse.error()))
    const failed = await mount('/nfts/neon-vessel-552')
    mounted.push(failed)
    await vi.waitFor(() => {
      expect(failed.container.textContent).toContain('Não foi possível carregar a peça.')
    })
    expect(failed.container.textContent).not.toContain('NFT não encontrado.')
  })

  it('mostra Carregando sem esconder a casca', async () => {
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    server.use(
      http.get('/api/nfts/:nftId', async () => {
        await gate
        return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 })
      }),
    )
    const view = await mount('/nfts/neon-vessel-552')
    mounted.push(view)
    expect(view.container.textContent).toContain('Carregando')
    expect(view.container.querySelector('header')).not.toBeNull()
    expect(view.container.textContent).not.toContain('Neon Vessel #552')
    release()
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('NFT não encontrado.')
    })
  })

  it('mantém q na peça e o Voltar reabre a grade recortada', async () => {
    const view = await mount('/nfts/neon-vessel-552?q=neon')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Neon Vessel #552')
    })
    expect(view.container.textContent).toContain('1.99')
    const search = view.container.querySelector('header input')
    if (!(search instanceof HTMLInputElement)) throw new Error('Campo de busca ausente')
    expect(search.value).toBe('neon')
    expect(backLink(view.container).getAttribute('href')).toBe('/?q=neon')

    await act(async () => {
      backLink(view.container).click()
    })
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/')
    })
    expect(view.router.state.location.href).toContain('q=neon')
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Neon Vessel #552')
    })
    expect(view.container.textContent).not.toContain('Emerald Ape #042')
  })

  it('o Voltar sem busca reabre a grade inteira', async () => {
    const view = await mount('/nfts/sage-nomad-009')
    mounted.push(view)
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Sage Nomad #009')
    })
    await act(async () => {
      backLink(view.container).click()
    })
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Golden Signal #160')
    })
    expect(view.router.state.location.pathname).toBe('/')
    expect(view.router.state.location.href).not.toContain('q=')
  })
})
