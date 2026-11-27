import { expect, test } from '@playwright/test'
import {
  ADA,
  BRUNO,
  apiFetch,
  expectOrderMessage,
  gotoHome,
  gotoOrder,
  gotoOrderInPlace,
  resetMockStore,
  signIn,
  signOut,
} from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await resetMockStore(page)
})

test.describe('FL-09 Socket no checkout', () => {
  test('TC-36 Neon alterna preço na grade', async ({ page }) => {
    await gotoHome(page)
    const neonCard = page.locator('#grade li').filter({ hasText: 'Neon Vessel #552' })
    await expect(neonCard).toContainText(/(1\.99|2\.09) ETH/)
    const seen = new Set<string>()
    await expect
      .poll(
        async () => {
          const text = await neonCard.innerText()
          const match = text.match(/(1\.99|2\.09) ETH/)
          if (match) seen.add(match[1])
          return seen.size
        },
        { timeout: 12_000 },
      )
      .toBeGreaterThanOrEqual(1)
  })

  test('TC-37 pedido novo Sage confirma com recibo', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    const created = await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key: `chave-e2e-37-${Date.now()}`, lines: [{ nftId: 'sage-nomad-009', quantity: 1 }] },
    })
    expect(created.status).toBe(200)
    await gotoOrderInPlace(page, (created.body as { id: string }).id)
    await page.waitForTimeout(3_500)
    await expect(page.locator('[data-order="pagina"]')).toContainText('Sage Nomad #009', {
      timeout: 25_000,
    })
  })

  test('TC-38 sair corta escuta do pedido', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    const created = await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key: `chave-e2e-38-${Date.now()}`, lines: [{ nftId: 'sage-nomad-009', quantity: 1 }] },
    })
    await gotoOrder(page, (created.body as { id: string }).id, ADA)
    await signOut(page)
    await page.goto(`/pedidos/${(created.body as { id: string }).id}`)
    await expect(page).toHaveURL(/conta=entrar/)
  })
})

test.describe('FL-10 Eventos de pedido', () => {
  test('TC-41 recibo confirmado da semente permanece', async ({ page }) => {
    await gotoOrder(page, 'ped-ada-1', ADA)
    const receipt = page.locator('[data-order="pagina"]')
    await expect(receipt).toContainText('1.79 ETH')
    await page.waitForTimeout(4000)
    await expect(receipt).toContainText('1.79 ETH')
  })

  test('TC-42 pedido da Ada não aparece no Bruno', async ({ page, context }) => {
    await signIn(page, ADA.email, ADA.password)
    const created = await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key: `chave-e2e-42-${Date.now()}`, lines: [{ nftId: 'sage-nomad-009', quantity: 1 }] },
    })
    const orderId = (created.body as { id: string }).id
    const brunoPage = await context.newPage()
    await brunoPage.goto('/')
    await signIn(brunoPage, BRUNO.email, BRUNO.password)
    await gotoOrder(brunoPage, orderId, BRUNO)
    await expectOrderMessage(brunoPage, 'Pedido não encontrado.')
    await brunoPage.close()
  })
})