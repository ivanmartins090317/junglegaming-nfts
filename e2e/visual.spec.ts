import { expect, test } from '@playwright/test'
import { ADA, cartLinesDesktop, gotoAuthenticated, gotoHome, openSignedInCart, signIn, waitForUserCart } from './helpers.ts'

test('TC-50 baseline início', async ({ page }) => {
  await gotoHome(page)
  await expect(page).toHaveScreenshot('home.png', { fullPage: true })
})

test('TC-51 baseline detalhe', async ({ page }) => {
  await page.goto('/nfts/neon-vessel-552')
  await expect(page.getByRole('heading', { name: 'Neon Vessel #552' })).toBeVisible()
  await expect(page.locator('main')).toHaveScreenshot('detail-neon.png')
})

test('TC-52 baseline carrinho vazio', async ({ page }) => {
  await page.goto('/carrinho')
  await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  await expect(page).toHaveScreenshot('cart-empty.png', { fullPage: true })
})

test('TC-53 baseline pagamento', async ({ page }) => {
  await gotoAuthenticated(page, '/pagamento', ADA)
  await expect(page.getByText('Revisão e envio')).toBeVisible()
  await expect(page).toHaveScreenshot('payment.png', { fullPage: true })
})

test('TC-52 carrinho com linha', async ({ page }) => {
  await openSignedInCart(page, ADA)
  await waitForUserCart(page)
  await expect(cartLinesDesktop(page)).toContainText('Sage Nomad #009', { timeout: 15_000 })
  await expect(page).toHaveScreenshot('cart-lines.png', { fullPage: true })
})