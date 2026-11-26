import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { createAppQueryClient, privateQueryKey, setAppQueryClient } from '@/lib/query/session.ts'
import { handlers } from '@/mocks/handlers.ts'
import { readUsers, resetStore } from '@/mocks/store.ts'
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

function entryRoot(container: ParentNode) {
  return container.querySelector('[role="dialog"]') ?? container
}

function buttonNamed(container: ParentNode, name: string) {
  const found = [...container.querySelectorAll('button')].find((item) => item.textContent?.trim() === name)
  if (!found) throw new Error(`Botão ausente: ${name}`)
  return found
}

function field(container: ParentNode, label: string) {
  const found = entryRoot(container).querySelector(`[aria-label="${label}"]`)
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

function authSubmit(container: ParentNode) {
  const form = field(container, 'E-mail').closest('form')
  const button = form?.querySelector('button[type="submit"]')
  if (!(button instanceof HTMLButtonElement)) throw new Error('Envio ausente')
  return button
}

async function signIn(container: ParentNode, email: string, password: string) {
  await fill(field(container, 'E-mail'), email)
  await fill(field(container, 'Senha'), password)
  await click(authSubmit(container))
}

describe('entrada, cadastro e guarda', () => {
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

  it('no desktop abre o painel na página atual e a aba troca o formulário', async () => {
    const view = await mount('/carrinho?q=neon', 1440)
    mounted.push(view)
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()

    await click(buttonNamed(view.container, 'Entrar'))
    expect(view.router.state.location.pathname).toBe('/carrinho')
    expect(view.router.state.location.href).toContain('conta=entrar')
    expect(view.router.state.location.href).toContain('q=neon')
    expect(view.container.textContent).toContain('Carrinho')
    expect(view.container.textContent).toContain('Entre para gerenciar sua carteira, coleção e perfil de')
    expect(field(view.container, 'Senha').className).toContain('border-primary')
    expect(field(view.container, 'E-mail').className).toContain('border-border')

    await click(buttonNamed(view.container, 'Criar conta'))
    expect(view.router.state.location.href).toContain('conta=cadastro')
    expect(view.container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(view.container.textContent).toContain('Crie seu perfil de colecionador e conecte uma')
    expect(view.container.textContent).toContain('Criar conta')
    expect(view.container.querySelector('[aria-label="Confirmar senha"]')?.parentElement?.querySelector('button')).toBeNull()

    const close = view.container.querySelector('[aria-label="Fechar"]')
    if (!(close instanceof HTMLElement)) throw new Error('Fechar ausente')
    await click(close)
    expect(view.router.state.location.pathname).toBe('/carrinho')
    expect(view.router.state.location.href).not.toContain('conta=')
    expect(view.router.state.location.href).toContain('q=neon')
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('abaixo de 1440 mostra a tela cheia e a frase inteira troca o formulário', async () => {
    const view = await mount('/cadastro', 390)
    mounted.push(view)
    expect(view.container.querySelector('header')).toBeNull()
    expect(view.container.querySelector('[aria-label="Fechar"]')).toBeNull()
    expect(view.container.textContent).toContain('KURIO')
    expect(view.container.textContent).toContain('Criar perfil de colecionador')
    expect(view.container.textContent).not.toContain('conecte uma carteira')
    expect(buttonNamed(view.container, 'Criar perfil')).toBeTruthy()
    expect(field(view.container, 'Nome de usuário').className).toContain('text-center')
    expect(field(view.container, 'E-mail').className).toContain('text-left')
    expect(field(view.container, 'Confirmar senha').parentElement?.querySelector('button')).not.toBeNull()
    expect(buttonNamed(view.container, 'Criar perfil').className).toContain('font-bold')

    await click(buttonNamed(view.container, 'Já tem uma conta? Entre'))
    expect(view.router.state.location.pathname).toBe('/entrar')
    expect(view.container.querySelector('header')).toBeNull()

    const tablet = await mount('/entrar', 768)
    mounted.push(tablet)
    expect(tablet.container.querySelector('header')).toBeNull()
    expect(tablet.container.textContent).toContain('Entrar')
  })

  it('Ada entra, a senha errada fica na tela e o olho só revela aquele campo', async () => {
    const view = await mount('/', 1440)
    mounted.push(view)
    await click(buttonNamed(view.container, 'Entrar'))
    await signIn(view.container, 'ada@kurio.test', 'Kurio')
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('E-mail ou senha não conferem.')
    })
    expect(view.router.state.location.href).toContain('conta=entrar')

    const secret = field(view.container, 'Senha')
    expect(secret.type).toBe('password')
    const eye = entryRoot(view.container).querySelector('[aria-label="Mostrar senha"]')
    if (!(eye instanceof HTMLElement)) throw new Error('Olho ausente')
    await click(eye)
    expect(field(view.container, 'Senha').type).toBe('text')
    expect(entryRoot(view.container).querySelector('[aria-label="Ocultar senha"]')).not.toBeNull()
    await signIn(view.container, 'Ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(buttonNamed(view.container, 'Sair')).toBeTruthy()
    })
    expect(view.router.state.location.pathname).toBe('/')
    expect(view.router.state.location.href).not.toContain('conta=')
    expect(window.localStorage.length).toBe(0)
    expect(window.sessionStorage.length).toBe(0)
  })

  it('cadastro recusado mostra a frase e o cadastro válido abre a sessão', async () => {
    const view = await mount('/?conta=cadastro', 1440)
    mounted.push(view)
    await click(authSubmit(view.container))
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Informe nome, e-mail e senha.')
    })

    await fill(field(view.container, 'Nome de usuário'), 'Lia')
    await fill(field(view.container, 'E-mail'), 'lia@kurio.test')
    await fill(field(view.container, 'Senha'), 'kurio')
    await fill(field(view.container, 'Confirmar senha'), 'outra')
    await click(authSubmit(view.container))
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('As senhas não conferem.')
    })

    await fill(field(view.container, 'E-mail'), 'ADA@kurio.test')
    await fill(field(view.container, 'Confirmar senha'), 'kurio')
    await click(authSubmit(view.container))
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Este e-mail já tem conta.')
    })
    expect(readUsers().map((user) => user.id)).toEqual(['usr-ada', 'usr-bruno'])

    await fill(field(view.container, 'Nome de usuário'), 'Lia')
    await fill(field(view.container, 'E-mail'), 'lia@kurio.test')
    await click(authSubmit(view.container))
    await vi.waitFor(() => {
      expect(buttonNamed(view.container, 'Sair')).toBeTruthy()
    })
    expect(readUsers().find((user) => user.email === 'lia@kurio.test')?.id).toBe('usr-3')
  })

  it('sem sessão a tela privada pede a entrada e o retorno válido volta', async () => {
    const blocked = await mount('/perfil', 390)
    mounted.push(blocked)
    expect(blocked.router.state.location.pathname).toBe('/entrar')
    expect(blocked.router.state.location.href).toContain('retorno=%2Fperfil')
    expect(blocked.container.querySelector('header')).toBeNull()
    expect(blocked.container.textContent).not.toContain('ada@kurio.test')

    await signIn(blocked.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(blocked.container.textContent).toContain('ada@kurio.test')
    })
    expect(blocked.router.state.location.pathname).toBe('/perfil')
    expect(blocked.container.querySelector('main input')).toBeNull()

    await click(buttonNamed(blocked.container.querySelector('main') as HTMLElement, 'Sair'))
    await vi.waitFor(() => {
      expect(blocked.router.state.location.pathname).toBe('/entrar')
    })
    expect(buttonNamed(blocked.container, 'Entrar')).toBeTruthy()
  })

  it('retorno inválido cai no início e o válido conserva a busca', async () => {
    const invalid = await mount(`/entrar?retorno=${encodeURIComponent('https://fora.exemplo')}`, 390)
    mounted.push(invalid)
    await signIn(invalid.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(invalid.router.state.location.pathname).toBe('/')
    })
    expect(invalid.router.state.location.href).not.toContain('fora.exemplo')

    resetStore()
    const valid = await mount(`/entrar?retorno=${encodeURIComponent('/nfts/neon-vessel-552?q=neon')}`, 390)
    mounted.push(valid)
    await signIn(valid.container, 'bruno@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(valid.router.state.location.pathname).toBe('/nfts/neon-vessel-552')
    })
    expect(valid.router.state.location.href).toContain('q=neon')
  })

  it('com sessão a confirmação mostra o nome da tela e sair limpa a chave privada', async () => {
    const view = await mount('/pedidos/ped-9', 1440)
    mounted.push(view)
    expect(view.router.state.location.pathname).toBe('/')
    expect(view.router.state.location.href).toContain('conta=entrar')
    expect(view.router.state.location.href).toContain('retorno=%2Fpedidos%2Fped-9')
    expect(view.container.textContent).not.toContain('Confirmação ped-9')

    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(view.container.textContent).toContain('Confirmação ped-9')
    })
    view.queryClient.setQueryData(privateQueryKey('usr-ada'), { pedido: 'ped-9' })
    view.queryClient.setQueryData(['nfts'], [{ id: 'neon-vessel-552' }])

    await click(buttonNamed(view.container, 'Sair'))
    await vi.waitFor(() => {
      expect(view.router.state.location.href).toContain('conta=entrar')
    })
    expect(view.queryClient.getQueryData(privateQueryKey('usr-ada'))).toBeUndefined()
    const catalog = view.queryClient.getQueryData<Array<{ id: string }>>(['nfts'])
    expect(catalog?.some((item) => item.id === 'neon-vessel-552')).toBe(true)
    expect(view.container.textContent).not.toContain('Confirmação ped-9')
  })

  it('atalhos sociais não entram e a falha de leitura não abre a tela privada', async () => {
    const view = await mount('/?conta=entrar', 1440)
    mounted.push(view)
    const before = view.router.state.location.href
    await click(buttonNamed(view.container, 'Esqueceu a senha?'))
    await click(buttonNamed(view.container, 'Continuar com Google'))
    await click(buttonNamed(view.container, 'Continuar com Facebook'))
    expect(view.router.state.location.href).toBe(before)
    expect(view.container.textContent?.toLowerCase()).not.toContain('sucesso')
    expect(buttonNamed(view.container, 'Entrar')).toBeTruthy()

    server.use(http.get('/api/sessao', () => HttpResponse.json({ message: 'falha' }, { status: 500 })))
    const blocked = await mount('/carteiras', 390)
    mounted.push(blocked)
    expect(blocked.router.state.location.pathname).toBe('/entrar')
    await vi.waitFor(() => {
      expect(blocked.container.textContent).toContain('Não foi possível carregar a sessão.')
    })
    expect(blocked.container.textContent).not.toContain('Carteiras')
  })

  it('quem já entrou não vê o formulário de novo', async () => {
    const view = await mount('/entrar?retorno=/carrinho', 390)
    mounted.push(view)
    await signIn(view.container, 'ada@kurio.test', 'kurio')
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/carrinho')
    })

    await act(async () => {
      await view.router.navigate({ href: '/cadastro' })
    })
    await vi.waitFor(() => {
      expect(view.router.state.location.pathname).toBe('/')
    })
    expect(view.container.textContent).not.toContain('Esqueceu a senha?')
  })
})
