import { expect, type Locator, type Page } from '@playwright/test'



export const catalogSeedNames = [

  'Emerald Ape #042',

  'Sage Nomad #009',

  'Neon Vessel #552',

  'Cosmic Bloom #118',

  'Violet Nomad #314',

  'Ivory Baron #088',

  'Golden Beat #207',

  'Golden Signal #160',

] as const



export const ADA = { email: 'ada@kurio.test', password: 'kurio' } as const

export const BRUNO = { email: 'bruno@kurio.test', password: 'kurio' } as const



export async function waitForCatalog(page: Page) {

  await expect(page.locator('#grade h3').first()).toBeVisible({ timeout: 20_000 })

}



export async function gotoHome(page: Page) {

  await page.goto('/')

  await waitForCatalog(page)

}



export function searchInput(page: Page): Locator {

  return page.locator('input[aria-label="Busca"]').locator('visible=true')

}



export function enterButton(page: Page): Locator {

  return page.getByRole('button', { name: 'Entrar', exact: true }).locator('visible=true')

}



export function authForm(page: Page): Locator {

  return page.locator('form').filter({ has: page.getByLabel('Senha', { exact: true }) }).first()

}



const desktopMinWidth = 1280

function isMobileViewport(page: Page) {
  return (page.viewportSize()?.width ?? desktopMinWidth) < desktopMinWidth
}

function entryOpen(page: Page) {
  const url = page.url()
  return url.includes('conta=entrar') || url.includes('conta=cadastro') || url.includes('/entrar') || url.includes('/cadastro')
}

async function ensureEntryForm(page: Page) {
  if (!isMobileViewport(page)) {
    if (!entryOpen(page)) {
      await gotoHome(page)
      await openEntryDesktop(page)
    }
    return
  }

  if (pathnameIs(page, '/entrar') || pathnameIs(page, '/cadastro')) {
    await expect(page.getByRole('heading', { name: /Entrar|Criar perfil/, level: 1 })).toBeVisible()
    return
  }

  const retorno = new URL(page.url()).searchParams.get('retorno')
  await page.goto(retorno ? `/entrar?retorno=${retorno}` : '/entrar')
  await expect(page.getByRole('heading', { name: 'Entrar', level: 1 })).toBeVisible()
}

function showsDesktopSair(page: Page) {
  const path = new URL(page.url()).pathname
  return path === '/' || path === '/carrinho' || path.startsWith('/nfts/')
}

async function expectSignedIn(page: Page) {
  await expect
    .poll(async () => (await apiFetch(page, '/api/sessao')).status, { timeout: 10_000 })
    .toBe(200)

  if (!isMobileViewport(page) && showsDesktopSair(page)) {
    await expect(page.getByRole('button', { name: 'Sair' }).locator('visible=true')).toBeVisible()
  }
}



export async function openEntryDesktop(page: Page) {

  await enterButton(page).click()

  await expect(page).toHaveURL(/conta=entrar/)

}



export async function openEntryMobile(page: Page) {

  await page.goto('/entrar')

  await expect(page.getByRole('heading', { name: 'Entrar', level: 1 })).toBeVisible()

}



export async function ensureServerSession(page: Page, email: string, password: string) {
  let user: { id: string; name: string; email: string } | undefined
  await expect
    .poll(
      async () => {
        const res = await apiFetch(page, '/api/sessao', { method: 'POST', body: { email, password } })
        if (res.status !== 200) return false
        user = res.body as typeof user
        return true
      },
      { timeout: 15_000 },
    )
    .toBe(true)

  await page.evaluate((sessionUser) => {
    const bridge = (window as Window & { kurioE2E?: { setSession: (value: unknown) => void } }).kurioE2E
    if (!bridge) throw new Error('kurioE2E indisponível')
    bridge.setSession(sessionUser)
  }, user)
}

function pathnameIs(page: Page, path: string) {
  return new URL(page.url()).pathname === path
}

export async function visitProtected(page: Page, path: string, creds: { email: string; password: string }) {
  const retorno = encodeURIComponent(path)
  if (isMobileViewport(page)) {
    await page.goto(`/entrar?retorno=${retorno}`)
  } else {
    await page.goto(`/?conta=entrar&retorno=${retorno}`)
  }
  await signIn(page, creds.email, creds.password)
  await expect.poll(() => pathnameIs(page, path), { timeout: 20_000 }).toBe(true)
}

export async function gotoAuthenticated(page: Page, path: string, creds: { email: string; password: string }) {
  await visitProtected(page, path, creds)
}

export async function openSignedInCart(page: Page, creds: { email: string; password: string }) {
  await signIn(page, creds.email, creds.password)
  await page.getByRole('link', { name: 'Carrinho' }).click()
  await expect(page).toHaveURL(/\/carrinho/)
}

export async function signIn(page: Page, email: string, password: string) {
  await ensureEntryForm(page)

  const form = authForm(page)

  await form.getByLabel('E-mail').fill(email)

  await form.getByLabel('Senha', { exact: true }).fill(password)

  const login = page.waitForResponse(
    (res) => res.url().includes('/api/sessao') && res.request().method() === 'POST',
  )
  await form.locator('button[type="submit"]').click()
  await login
  await expectSignedIn(page)
}



export async function signOut(page: Page) {
  await apiFetch(page, '/api/sessao', { method: 'DELETE' })
  await page.goto('/')
  await waitForCatalog(page)
  await expect(enterButton(page)).toBeVisible()
}



export async function addToCartFromDetail(page: Page, nftId: string) {

  await page.goto(`/nfts/${nftId}`)

  await page.getByRole('button', { name: 'COMPRAR', exact: true }).click()

  await expect(page).toHaveURL(/\/carrinho/, { timeout: 15_000 })

}



export function cartBadge(page: Page) {

  return page.locator('header a[aria-label^="Carrinho"] span').first()

}



export function cartLinesDesktop(page: Page) {
  return page.locator('[data-cart="lines-desktop"]')
}

export function cartLines(page: Page) {
  if (isMobileViewport(page)) return page.locator('[data-cart="lines-mobile"]')
  return cartLinesDesktop(page)
}



export function checkoutDesktop(page: Page) {

  return page.locator('[data-cart="summary-desktop"]').getByRole('button', { name: 'Conectar e finalizar' })

}



export function cartTotalDesktop(page: Page) {

  return page.locator('[data-cart="summary-desktop"] [data-field="total"]')

}



export async function expectOrderMessage(page: Page, message: string, timeout = 25_000) {

  const root = page.locator('[data-order="pagina"]')

  await expect
    .poll(
      async () => {
        const text = await root.textContent()
        if (!text || text.includes('Carregando')) return false
        return text.includes(message)
      },
      { timeout },
    )
    .toBe(true)

}



export async function apiFetch<T = unknown>(

  page: Page,

  path: string,

  init?: { method?: string; body?: unknown },

) {

  return page.evaluate(

    async ({ path: p, init: options }) => {

      const res = await fetch(p, {

        method: options?.method ?? 'GET',

        headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,

        body: options?.body ? JSON.stringify(options.body) : undefined,

      })

      const text = await res.text()

      let json: unknown = null

      try {

        json = text.length > 0 ? JSON.parse(text) : null

      } catch {

        json = text

      }

      return { status: res.status, body: json as T }

    },

    { path, init },

  )

}



export async function resetMockStore(page: Page) {
  await page.goto('/')
  await waitForCatalog(page)
  const res = await apiFetch(page, '/api/dev/reset', { method: 'POST' })
  expect(res.status).toBe(204)
  await page.reload()
  await waitForCatalog(page)
}

export function profileMain(page: Page) {
  return page.locator('main')
}

export async function gotoOrder(
  page: Page,
  orderId: string,
  creds: { email: string; password: string },
) {
  await visitProtected(page, `/pedidos/${orderId}`, creds)
}

export async function gotoOrderInPlace(page: Page, orderId: string) {
  const path = `/pedidos/${orderId}`
  await page.evaluate(async (target) => {
    const bridge = (window as Window & { kurioE2E?: { navigate: (href: string) => Promise<void> } }).kurioE2E
    if (!bridge) throw new Error('kurioE2E indisponível')
    await bridge.navigate(target)
  }, path)
  await expect.poll(() => pathnameIs(page, path), { timeout: 20_000 }).toBe(true)
  await expect(page.locator('[data-order="pagina"]')).toBeVisible({ timeout: 20_000 })
}

export async function waitForUserCart(page: Page) {
  await expect(cartLines(page)).toContainText('Sage Nomad #009', { timeout: 20_000 })
}
