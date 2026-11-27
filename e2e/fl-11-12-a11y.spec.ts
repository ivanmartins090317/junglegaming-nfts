import { expect, test } from '@playwright/test'
import { enterButton, gotoHome } from './helpers.ts'

test.describe('FL-11 Teclado', () => {
  test('TC-44 Esc fecha painel de entrada', async ({ page }) => {
    await gotoHome(page)
    await enterButton(page).click()
    await page.keyboard.press('Escape')
    await expect(page).not.toHaveURL(/conta=/)
  })

  test('TC-45 erros aparecem como texto', async ({ page }) => {
    await gotoHome(page)
    await enterButton(page).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('E-mail').fill('ada@kurio.test')
    await dialog.getByLabel('Senha', { exact: true }).fill('errada')
    await dialog.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('E-mail ou senha não conferem.')).toBeVisible()
  })
})

test.describe('FL-12 Rede lenta', () => {
  test('TC-47 catálogo mostra Carregando sem skeleton', async ({ page }) => {
    await page.route('**/api/nfts', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      await route.continue()
    })
    await page.goto('/')
    const loading = page.getByText('Carregando')
    await expect(loading).toBeVisible()
    await expect(page.locator('[data-skeleton]')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Emerald Ape #042', level: 3 })).toBeVisible({
      timeout: 15_000,
    })
  })
})