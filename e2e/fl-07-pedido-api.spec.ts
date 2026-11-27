import { expect, test } from '@playwright/test'
import {
  ADA,
  apiFetch,
  expectOrderMessage,
  gotoOrderInPlace,
  resetMockStore,
  signIn,
} from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await resetMockStore(page)
})

test.describe('FL-07 Pedido idempotente', () => {
  test('TC-27 mesma chave devolve o mesmo pedido', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    const lines = [{ nftId: 'sage-nomad-009', quantity: 1 }]
    const key = 'chave-e2e-27'
    const first = await apiFetch(page, '/api/pedidos', { method: 'POST', body: { key, lines } })
    const second = await apiFetch(page, '/api/pedidos', { method: 'POST', body: { key, lines } })
    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect((first.body as { id: string }).id).toBe((second.body as { id: string }).id)
  })

  test('TC-28 chave com corpo diferente conflita', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    const key = 'chave-e2e-28'
    await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key, lines: [{ nftId: 'sage-nomad-009', quantity: 1 }] },
    })
    const conflict = await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key, lines: [{ nftId: 'emerald-ape-042', quantity: 1 }] },
    })
    expect(conflict.status).toBe(409)
  })

  test('TC-29 Golden Signal recusa pedido', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    await apiFetch(page, '/api/carrinho/itens/sage-nomad-009', { method: 'DELETE' })
    await apiFetch(page, '/api/carrinho/itens', { method: 'POST', body: { nftId: 'golden-signal-160' } })
    const created = await apiFetch(page, '/api/pedidos', {
      method: 'POST',
      body: { key: 'chave-e2e-29', lines: [{ nftId: 'golden-signal-160', quantity: 1 }] },
    })
    expect(created.status).toBe(200)
    await gotoOrderInPlace(page, (created.body as { id: string }).id)
    await page.waitForTimeout(3_500)
    await expectOrderMessage(page, 'Pedido recusado.', 40_000)
    await expect(page.locator('[data-order="pagina"]')).not.toContainText('Ivory Baron #088')
    await expect(page.getByText('Ivory Baron #088')).toHaveCount(0)
  })

  test('TC-30 repetir após criação devolve o gravado', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    const key = 'chave-e2e-30'
    const lines = [{ nftId: 'sage-nomad-009', quantity: 1 }]
    const first = await apiFetch(page, '/api/pedidos', { method: 'POST', body: { key, lines } })
    const again = await apiFetch(page, '/api/pedidos', { method: 'POST', body: { key, lines } })
    expect((first.body as { id: string }).id).toBe((again.body as { id: string }).id)
  })
})