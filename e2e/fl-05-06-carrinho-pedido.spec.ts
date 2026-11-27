import { expect, test } from '@playwright/test'
import {
  ADA,
  addToCartFromDetail,
  cartBadge,
  cartLinesDesktop,
  cartTotalDesktop,
  checkoutDesktop,
  expectOrderMessage,
  gotoOrder,
  openSignedInCart,
  visitProtected,  resetMockStore,
  signIn,
  signOut,
  waitForUserCart,
} from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await resetMockStore(page)
})

test.describe('FL-05 Carrinho', () => {
  test('TC-18 visitante inclui peça e mantém rascunho no reload', async ({ page }) => {
    await addToCartFromDetail(page, 'emerald-ape-042')
    await expect(cartBadge(page)).toHaveText('1', { timeout: 10_000 })
    await page.goto('/carrinho')
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible()
    await expect(cartTotalDesktop(page)).toHaveText('1.206 ETH', { timeout: 15_000 })
    await page.reload()
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible()
  })

  test('TC-20 carrinho vazio não vai ao pagamento', async ({ page }) => {
    await page.goto('/carrinho')
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
    await expect(checkoutDesktop(page)).toHaveAttribute('aria-disabled', 'true')
    await expect(page).toHaveURL(/\/carrinho/)
  })

  test('TC-21 com linha e sessão vai ao pagamento', async ({ page }) => {
    await openSignedInCart(page, ADA)
    await waitForUserCart(page)
    await expect(cartLinesDesktop(page)).toContainText('Sage Nomad #009', { timeout: 15_000 })
    await expect(checkoutDesktop(page)).toHaveAttribute('aria-disabled', 'false')
    await checkoutDesktop(page).click()
    await expect(page).toHaveURL(/\/pagamento/)
    await expect(page.getByText('Revisão e envio')).toBeVisible()
  })

  test('TC-21 sem sessão abre guarda antes do pagamento', async ({ page }) => {
    await addToCartFromDetail(page, 'emerald-ape-042')
    await page.goto('/carrinho')
    await checkoutDesktop(page).click()
    await expect(page).toHaveURL(/conta=entrar/)
    await signIn(page, ADA.email, ADA.password)
    await expect(page).toHaveURL(/\/pagamento/)
  })
})

test.describe('FL-06 Compra até o recibo', () => {
  test('TC-23 recibo da Ada sem cabeçalho da loja', async ({ page }) => {
    await gotoOrder(page, 'ped-ada-1', ADA)
    const receipt = page.locator('[data-order="pagina"]').getByRole('article')
    await expect(receipt).toContainText('Ivory Baron #088', { timeout: 20_000 })
    await expect(receipt).toContainText('1.79 ETH')
    await expect(receipt).toContainText('0xADA1')
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeHidden()
  })

  test('TC-24 fechar recibo volta ao início', async ({ page }) => {
    await gotoOrder(page, 'ped-ada-1', ADA)
    await page.getByRole('button', { name: 'Fechar' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('nav[aria-label="Principal"]')).toBeVisible()
  })

  test('TC-25 pedido alheio não abre na Ada', async ({ page }) => {
    await gotoOrder(page, 'ped-bruno-1', ADA)
    await expectOrderMessage(page, 'Pedido não encontrado.')
  })

  test('TC-26 pagamento não cria pedido novo', async ({ page }) => {
    await visitProtected(page, '/pagamento', ADA)
    await expect(page.getByText('Revisão e envio')).toBeVisible()
    await page.goto('/')
    await expect(page.locator('nav[aria-label="Principal"]')).toBeVisible()
  })
})

test.describe('FL-05 fusão visitante', () => {
  test('TC-19 Ada soma rascunho do visitante', async ({ page }) => {
    await addToCartFromDetail(page, 'emerald-ape-042')
    await page.goto('/carrinho')
    await page.getByRole('button', { name: /Aumentar Emerald/ }).click()
    await openSignedInCart(page, ADA)
    await waitForUserCart(page)
    await expect(cartLinesDesktop(page)).toContainText('Sage Nomad #009', { timeout: 15_000 })
    await expect(cartLinesDesktop(page)).toContainText('Emerald Ape #042')
    await signOut(page)
    await page.goto('/carrinho')
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })
})