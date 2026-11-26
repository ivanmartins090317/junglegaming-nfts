import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { routeTree } from '@/routeTree.gen.ts'

async function mount(path: string) {
  const history = createMemoryHistory({ initialEntries: [path] })
  const router = createRouter({ routeTree, history })
  await router.load()
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(<RouterProvider router={router} />)
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
    const view = await mount('/')
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
    expect(home.className).toContain('border-primary')
    expect(market.className).toContain('font-normal')
    expect(market.className).not.toContain('text-text-accent')
    expect(market.getAttribute('aria-current')).toBeNull()

    const search = view.container.querySelector('input')
    expect(header?.querySelector('button[aria-label="Busca"]')).not.toBeNull()
    expect(search?.getAttribute('aria-label')).toBe('Busca')
    expect(search?.readOnly).toBe(true)
    expect(search?.getAttribute('placeholder')).toBe('Explorar coleções')

    const cart = [...view.container.querySelectorAll('a')].find((anchor) =>
      anchor.textContent?.includes('Carrinho'),
    )
    const badge = cart?.querySelector('span')
    expect(cart?.getAttribute('href')).toBe('/carrinho')
    expect(badge?.textContent).toBe('5')
    expect(badge?.className).toContain('h-[16px]')
    expect(badge?.className).toContain('min-w-[16px]')
    expect(badge?.className).toContain('bg-primary')

    const signIn = [...view.container.querySelectorAll('a')].find(
      (anchor) => anchor.textContent?.trim() === 'Entrar',
    )
    expect(signIn?.getAttribute('href')).toBe('/entrar')
    expect(signIn?.className).toContain('h-[35px]')
    expect(signIn?.className).toContain('w-auto')
    expect(signIn?.className).toContain('bg-primary')
    expect(signIn?.className).toContain('text-ink')
    expect(signIn?.className).toContain('font-medium')

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

  it.each([
    ['/carrinho', 'Carrinho'],
    ['/pagamento', 'Revisão e envio'],
    ['/entrar', 'Entrar'],
    ['/cadastro', 'Cadastro'],
    ['/perfil', 'Perfil'],
    ['/carteiras', 'Carteiras'],
  ])('mostra só o nome em %s', async (path, title) => {
    const view = await mount(path)
    mounted.push(view)
    expect(miolo(view.container)?.textContent).toBe(title)
    expect(miolo(view.container)?.className).toContain('text-foreground')
    expect(view.container.querySelector('header')).not.toBeNull()
  })

  it('mostra o identificador ao lado do nome nas telas dinâmicas', async () => {
    const nft = await mount('/nfts/rune-1')
    mounted.push(nft)
    expect(miolo(nft.container)?.textContent).toBe('Detalhe rune-1')

    const order = await mount('/pedidos/ped-9')
    mounted.push(order)
    expect(miolo(order.container)?.textContent).toBe('Confirmação ped-9')
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
    const view = await mount('/perfil')
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
    ).toBe('5')

    await act(async () => {
      const signIn = [...view.container.querySelectorAll('a')].find(
        (anchor) => anchor.textContent?.trim() === 'Entrar',
      )
      signIn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(view.router.state.location.pathname).toBe('/entrar')

    const beforeBrand = view.router.state.location.pathname
    await act(async () => {
      view.container.querySelector('header span')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    expect(view.router.state.location.pathname).toBe(beforeBrand)
  })

  it('não grava a busca no endereço', async () => {
    const view = await mount('/carrinho')
    mounted.push(view)
    const search = view.container.querySelector('input')
    if (!search) throw new Error('Campo de busca ausente')

    await act(async () => {
      search.focus()
      search.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
      search.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(search.readOnly).toBe(true)
    expect(view.router.state.location.href).not.toContain('q=')
    expect(view.router.state.location.pathname).toBe('/carrinho')
  })
})
