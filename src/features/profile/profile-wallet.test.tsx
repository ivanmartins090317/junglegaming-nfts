import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { createAppQueryClient, setAppQueryClient } from '@/lib/query/session.ts'
import { handlers } from '@/mocks/handlers.ts'
import { resetStore } from '@/mocks/store.ts'
import { routeTree } from '@/routeTree.gen.ts'

const server = setupServer(...handlers)

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
}

async function mount(path: string, width: number) {
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

function mainOf(container: ParentNode) {
  const main = container.querySelector('main')
  if (!main) throw new Error('main ausente')
  return main
}

function buttonNamed(container: ParentNode, name: string) {
  const found = [...container.querySelectorAll('button')].find((item) => item.textContent?.trim() === name)
  if (!found) throw new Error(`Botão ausente: ${name}`)
  return found
}

function field(container: ParentNode, label: string) {
  const found = mainOf(container).querySelector(`[aria-label="${label}"]`)
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

function entryRoot(container: ParentNode) {
  return container.querySelector('[role="dialog"]') ?? container
}

async function signIn(container: ParentNode, email: string, password: string) {
  const emailInput = entryRoot(container).querySelector('[aria-label="E-mail"]')
  const passwordInput = entryRoot(container).querySelector('[aria-label="Senha"]')
  if (!(emailInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
    throw new Error('Formulário de entrada ausente')
  }
  await fill(emailInput, email)
  await fill(passwordInput, password)
  const form = emailInput.closest('form')
  const submit = form?.querySelector('button[type="submit"]')
  if (!(submit instanceof HTMLButtonElement)) throw new Error('Envio ausente')
  await click(submit)
}

describe('perfil e carteiras', () => {
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
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  afterAll(() => {
    server.close()
  })

  it('Ada vê o próprio e-mail no campo', async () => {
    const view = await mount('/entrar?retorno=/perfil', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/perfil')
      expect(field(view.container, 'E-mail').value).toBe('ada@kurio.test')
    })
    expect(field(view.container, 'Nome de exibição').value).toBe('Ada')
    expect(field(view.container, 'Nome de usuário').value).toBe('')
    const main = mainOf(view.container)
    expect(main.textContent).toContain('Meu perfil')
    expect(main.textContent).toContain('Perfil do colecionador')
    expect(main.textContent).toContain('Alterar')
    expect(main.textContent).toContain('Remover')
    expect(main.textContent).toContain('Salvar')
    expect(main.textContent).not.toContain('ada@kurio.test')
    expect(field(view.container, 'Senha atual').type).toBe('password')
    expect(field(view.container, 'Nova senha').type).toBe('password')
    expect(field(view.container, 'Confirmar nova senha').type).toBe('password')
    expect(field(view.container, 'Senha atual').value).toBe('')
  })

  it('o olho troca só a nova senha', async () => {
    const view = await mount('/perfil', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Ada')
    })
    const nova = field(view.container, 'Nova senha')
    const eye = nova.parentElement?.querySelector('[aria-label="Mostrar senha"]')
    if (!(eye instanceof HTMLElement)) throw new Error('Olho ausente')
    await click(eye)
    expect(field(view.container, 'Nova senha').type).toBe('text')
    expect(field(view.container, 'Senha atual').type).toBe('password')
    expect(field(view.container, 'Confirmar nova senha').type).toBe('password')
  })

  it('atalhos do perfil ficam na página', async () => {
    const view = await mount('/perfil', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Ada')
    })
    await click(buttonNamed(view.container, 'Alterar'))
    await click(buttonNamed(view.container, 'Remover'))
    await click(buttonNamed(view.container, 'Atividade'))
    expect(view.router.state.location.pathname).toBe('/perfil')
  })

  it('abaixo de 1440 a sidebar vem antes do formulário', async () => {
    const view = await mount('/perfil', 390)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Ada')
    })
    const main = mainOf(view.container)
    const content = main.textContent ?? ''
    expect(content.indexOf('Meu perfil')).toBeLessThan(content.indexOf('Perfil do colecionador'))
    expect(content.indexOf('Perfil do colecionador')).toBeLessThan(content.indexOf('Nome de exibição'))
    const frame = main.firstElementChild
    expect(frame?.className).toContain('flex-col')
    expect(frame?.className).toContain('desktop:flex-row')
  })

  it('falha de leitura deixa a sidebar', async () => {
    server.use(http.get('/api/perfil', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    const view = await mount('/perfil', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(mainOf(view.container).textContent).toContain('Não foi possível carregar o perfil.')
    })
    expect(mainOf(view.container).querySelector('[aria-label="Nome de exibição"]')).toBeNull()
    expect(buttonNamed(mainOf(view.container), 'Sair')).toBeTruthy()
  })

  it('salvar não leva o nome da Ada ao Bruno', async () => {
    const view = await mount('/perfil', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Ada')
    })
    await fill(field(view.container, 'Nome de exibição'), 'Ada Costa')
    await fill(field(view.container, 'Nome de usuário'), 'ada')
    await fill(field(view.container, 'E-mail'), 'ada.costa@kurio.test')
    await fill(field(view.container, 'Nome ENS'), 'ada')
    await fill(field(view.container, 'Apelido da carteira'), 'principal')
    await click(buttonNamed(view.container, 'Salvar'))
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Ada Costa')
    })
    await click(buttonNamed(mainOf(view.container), 'Sair'))
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('conta=entrar')
    })
    await signIn(view.container, 'bruno@kurio.test', 'kurio')
    await act(async () => {
      await view.router.navigate({ to: '/perfil' })
    })
    await vi.waitFor(() => {
      expect(field(view.container, 'Nome de exibição').value).toBe('Bruno')
    })
    expect(field(view.container, 'E-mail').value).toBe('bruno@kurio.test')
  })

  it('carteira da semente e cliques vazios', async () => {
    const view = await mount('/carteiras', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(mainOf(view.container).textContent).toContain('Carteira principal')
    })
    const main = mainOf(view.container)
    expect(main.textContent).toContain('Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.')
    expect(main.textContent).toContain('Salvar carteira')
    expect(main.textContent).toContain('Carteira secundária')
    expect(main.textContent).toContain('Você ainda não adicionou uma carteira secundária.')
    expect(buttonNamed(main, 'Selecione uma rede').textContent).toContain('Selecione uma rede')
    expect(buttonNamed(main, 'Selecione uma carteira').textContent).toContain('Selecione uma carteira')
    const optional = main.querySelector(`[aria-label="ENS ou carteira secundária (opcional)"]`)
    expect(optional).toBeTruthy()
    const adds = [...main.querySelectorAll('button')].filter((item) => item.textContent?.trim() === 'Adicionar')
    await click(adds[0] as HTMLElement)
    const marker = main.querySelector('[aria-label="Igual à carteira principal"]')
    if (!(marker instanceof HTMLElement)) throw new Error('Marcador ausente')
    await click(marker)
    expect(view.router.state.location.pathname).toBe('/carteiras')
    const circle = main.querySelector('.border-primary.rounded-full')
    expect(circle?.className).not.toContain('bg-primary')
  })

  it('falha da carteira deixa a sidebar', async () => {
    server.use(http.get('/api/carteiras', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    const view = await mount('/carteiras', 1440)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(mainOf(view.container).textContent).toContain('Não foi possível carregar as carteiras.')
    })
    expect(buttonNamed(mainOf(view.container), 'Sair')).toBeTruthy()
  })
})