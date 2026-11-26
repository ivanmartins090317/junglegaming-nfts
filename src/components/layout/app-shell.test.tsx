import { QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { routeTree } from '@/routeTree.gen.ts'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { createAppQueryClient, setAppQueryClient } from '@/lib/query/session.ts'

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
}

async function mount(path: string, width = 1024) {
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

function navItem(container: ParentNode, name: string) {
  const nav = container.querySelector('nav')
  const item = [...(nav?.querySelectorAll('a, button') ?? [])].find(
    (element) => element.textContent?.trim() === name,
  )
  if (!item) throw new Error(`Item de navegação ausente: ${name}`)
  return item
}

function miolo(container: ParentNode) {
  return container.querySelector('main p')
}

describe('casca e rotas vazias', () => {
  const mounted: Array<Awaited<ReturnType<typeof mount>>> = []

  afterEach(async () => {
    await act(async () => {
      for (const view of mounted) view.root.unmount()
    })
    mounted.length = 0
    document.body.replaceChildren()
  })

  it('abre o início com a casca medida e sem o estado do mock', async () => {
    const view = await mount('/', 1440)
    mounted.push(view)
    const header = view.container.querySelector('header')
    const headerChildren = [...(header?.children ?? [])]

    expect(headerChildren.map((element) => element.tagName)).toEqual(['DIV', 'DIV'])
    expect(header?.querySelector('span')?.textContent).toBe('KURIO')
    expect(header?.querySelectorAll('nav a, nav button')).toHaveLength(4)
    expect(
      [...(header?.querySelectorAll('nav a, nav button') ?? [])].map((element) =>
        element.textContent?.trim(),
      ),
    ).toEqual(['Início', 'Mercado', 'Criadores', 'Aprenda'])

    const brand = header?.querySelector('span')
    expect(brand?.className).toContain('text-[14px]')
    expect(brand?.className).toContain('font-bold')
    expect(brand?.className).toContain('tracking-[0.1em]')
    expect(brand?.className).toContain('text-foreground')
    expect(brand?.closest('a')).toBeNull()

    const home = navItem(view.container, 'Início')
    const market = navItem(view.container, 'Mercado')
    expect(home.getAttribute('href')).toBe('/')
    expect(market.getAttribute('href')).toBe('/')
    expect(home.getAttribute('aria-current')).toBe('page')
    expect(home.className).toContain('font-bold')
    expect(home.className).toContain('text-text-accent')
    expect(home.className).toContain('after:bg-primary')
    expect(home.className).toContain('after:-bottom-px')
    expect(market.className).toContain('font-normal')
    expect(market.className).not.toContain('text-text-accent')
    expect(market.getAttribute('aria-current')).toBeNull()

    const search = view.container.querySelector('input')
    expect(header?.querySelector('button[aria-label="Busca"]')).not.toBeNull()
    expect(search?.getAttribute('aria-label')).toBe('Busca')
    expect(search?.readOnly).toBe(false)
    expect(search?.getAttribute('placeholder')).toBe('Explorar coleções')

    const cart = [...view.container.querySelectorAll('a')].find((anchor) =>
      anchor.textContent?.includes('Carrinho'),
    )
    const badge = cart?.querySelector('span')
    expect(cart?.getAttribute('href')).toBe('/carrinho')
    expect(badge?.textContent).toBe('0')
    expect(badge?.className).toContain('h-[16px]')
    expect(badge?.className).toContain('min-w-[16px]')
    expect(badge?.className).toContain('bg-primary')
    expect(view.container.querySelector('button[aria-label="Carteira"] span')?.textContent).toBe('2')

    const signIn = [...view.container.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Entrar',
    )
    expect(signIn?.tagName).toBe('BUTTON')
    expect(signIn?.getAttribute('href')).toBeNull()
    expect(signIn?.className).toContain('h-[35px]')
    expect(signIn?.className).toContain('w-auto')
    expect(signIn?.className).toContain('bg-primary')
    expect(signIn?.className).toContain('text-ink')
    expect(signIn?.className).toContain('font-medium')

    await act(async () => {
      signIn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(view.router.state.location.pathname).toBe('/')
    expect(view.router.state.location.href).toContain('conta=entrar')
    expect(view.container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(view.container.textContent).toContain('Entre para gerenciar sua carteira, coleção e perfil de')

    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Não foi possível carregar o catálogo.')
    })
    expect(view.container.textContent).toContain('SEJA DONO DO FUTURO')
    expect(view.container.textContent).toContain('SEJA DONO DA CULTURA DIGITAL')
    expect(view.container.textContent).not.toContain('Mock ligado')
    expect(view.container.textContent).not.toContain('Mock desligado')
    expect(view.container.querySelectorAll('nav')).toHaveLength(2)

    const padded = view.container.querySelector('[class*="desktop:px-[120px]"]')
    expect(padded?.className).toContain('desktop:px-[120px]')
    expect(padded?.querySelector('header')).not.toBeNull()
    expect(padded?.querySelector('main')).not.toBeNull()
  })

  it('mostra o identificador ao lado do nome nas telas dinâmicas', async () => {
    const nft = await mount('/nfts/rune-1')
    mounted.push(nft)
    await vi.waitFor(() => {
      expect(nft.container.textContent).toContain('Não foi possível carregar a peça.')
    })
    expect(nft.container.textContent).not.toContain('NFT não encontrado.')
    expect(nft.container.querySelector('header')).not.toBeNull()

    const order = await mount('/pedidos/ped-9', 390)
    mounted.push(order)
    expect(order.router.state.location.pathname).toBe('/entrar')
    expect(order.router.state.location.href).toContain('retorno=')
    expect(order.container.querySelector('header')).toBeNull()
    expect(order.container.textContent).not.toContain('Confirmação ped-9')
  })

  it('explica o endereço desconhecido e volta ao início', async () => {
    const view = await mount('/blog')
    mounted.push(view)
    const message = miolo(view.container)
    expect(message?.textContent).toBe('Esta página não existe.')
    expect(message?.className).toContain('text-text-coral')
    expect(message?.className).toContain('text-[14px]')
    expect(message?.className).toContain('leading-[16px]')
    expect(message?.className).toContain('font-normal')
    expect(navItem(view.container, 'Início').getAttribute('aria-current')).toBeNull()

    const homeButton = [...view.container.querySelectorAll('a')].find(
      (anchor) =>
        anchor.textContent?.trim() === 'Início' && anchor.className.includes('bg-primary'),
    )
    expect(homeButton?.getAttribute('href')).toBe('/')

    await act(async () => {
      homeButton?.click()
    })

    expect(view.router.state.location.pathname).toBe('/')
    expect(navItem(view.container, 'Início').getAttribute('aria-current')).toBe('page')
    expect(navItem(view.container, 'Mercado').getAttribute('aria-current')).toBeNull()
    expect(view.container.textContent).toContain('SEJA DONO DO FUTURO')
  })

  it('navega pelo topo sem ativar Mercado e sem sair de Criadores ou Aprenda', async () => {
    const view = await mount('/carrinho', 1440)
    mounted.push(view)

    await act(async () => {
      navItem(view.container, 'Mercado').dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    expect(view.router.state.location.pathname).toBe('/')
    expect(navItem(view.container, 'Início').className).toContain('text-text-accent')
    expect(navItem(view.container, 'Mercado').className).not.toContain('text-text-accent')

    const stayed = view.router.state.location.pathname
    await act(async () => {
      navItem(view.container, 'Criadores').dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
      navItem(view.container, 'Aprenda').dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    expect(view.router.state.location.pathname).toBe(stayed)
    expect(view.container.textContent?.toLowerCase()).not.toContain('sucesso')

    await act(async () => {
      const cart = [...view.container.querySelectorAll('a')].find((anchor) =>
        anchor.textContent?.includes('Carrinho'),
      )
      cart?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(view.router.state.location.pathname).toBe('/carrinho')
    expect(navItem(view.container, 'Início').getAttribute('aria-current')).toBeNull()
    expect(navItem(view.container, 'Mercado').getAttribute('aria-current')).toBeNull()
    expect(
      [...view.container.querySelectorAll('a')]
        .find((anchor) => anchor.textContent?.includes('Carrinho'))
        ?.querySelector('span')?.textContent,
    ).toBe('0')

    await act(async () => {
      const signIn = [...view.container.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Entrar',
      )
      signIn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(view.router.state.location.pathname).toBe('/carrinho')
    expect(view.router.state.location.href).toContain('conta=entrar')
    expect(view.container.querySelector('[role="dialog"]')).not.toBeNull()

    const beforeBrand = view.router.state.location.pathname
    await act(async () => {
      view.container.querySelector('header span')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    expect(view.router.state.location.pathname).toBe(beforeBrand)
  })

  it('grava a busca em q e o voltar do navegador devolve a tela de origem', async () => {
    const view = await mount('/carrinho')
    mounted.push(view)
    const before = view.router.history.length

    await typeSearch(mobileSearch(view.container), 'n')
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/')
    })
    expect(view.router.state.location.href).toContain('q=n')
    expect(view.router.history.length).toBe(before + 1)

    await typeSearch(mobileSearch(view.container), 'ne')
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('q=ne')
    })
    expect(view.router.history.length).toBe(before + 1)

    await act(async () => {
      view.router.history.back()
    })
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/carrinho')
    })
  })

  it('abre o campo do desktop na lupa e já mostra q quando ele existe', async () => {
    const closed = await mount('/carrinho')
    mounted.push(closed)
    const closedBar = desktopBar(closed.container)
    expect(closedBar.querySelector('input')).toBeNull()

    await act(async () => {
      closedBar.querySelector('button[aria-label="Busca"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    const opened = closedBar.querySelector('input')
    expect(opened).not.toBeNull()
    expect(opened?.className).toContain('rounded-[var(--radius-field)]')
    expect(opened?.className).toContain('border-border')
    expect(closed.router.state.location.pathname).toBe('/carrinho')

    const withQuery = await mount('/nfts/neon-vessel-552?q=neon')
    mounted.push(withQuery)
    const field = desktopBar(withQuery.container).querySelector('input')
    if (!(field instanceof HTMLInputElement)) throw new Error('Campo desktop ausente')
    expect(desktopBar(withQuery.container).querySelector('button[aria-label="Busca"]')).toBeNull()
    expect(field.value).toBe('neon')
    expect(mobileSearch(withQuery.container).value).toBe('neon')
    expect(mobileSearch(withQuery.container).readOnly).toBe(false)
  })

  it('na busca do início cada letra substitui a entrada atual', async () => {
    const view = await mount('/')
    mounted.push(view)
    const before = view.router.history.length

    await typeSearch(mobileSearch(view.container), 'n')
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('q=n')
    })
    expect(view.router.history.length).toBe(before)

    await typeSearch(mobileSearch(view.container), 'ne')
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('q=ne')
    })
    expect(view.router.history.length).toBe(before)

    await typeSearch(mobileSearch(view.container), '')
    await vi.waitFor(() => {
      expect(view.router.state.location.href).not.toContain('q=')
    })
    expect(view.router.history.length).toBe(before)
    expect(view.router.state.location.pathname).toBe('/')
  })
})

function desktopBar(container: ParentNode) {
  const bar = container.querySelector('header')?.children[0]
  if (!bar) throw new Error('Topo desktop ausente')
  return bar
}

function mobileSearch(container: ParentNode) {
  const field = container.querySelector('header')?.children[1]?.querySelector('input')
  if (!(field instanceof HTMLInputElement)) throw new Error('Campo de busca ausente')
  return field
}

async function typeSearch(input: HTMLInputElement, value: string) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
