import { expect, test } from '@playwright/test'
import { gotoHome, waitForCatalog } from './helpers.ts'

test.describe('FL-04 Favoritos @mobile', () => {
  test('TC-15 coração alterna e não navega', async ({ page }) => {
    await page.goto('/?q=neon')
    await waitForCatalog(page)
    const heart = page.getByRole('button', { name: 'Salvar Neon Vessel #552' })
    await heart.click()
    await expect(page.getByRole('button', { name: 'Remover Neon Vessel #552 dos favoritos' })).toBeVisible()
    await expect(page).toHaveURL(/q=neon/)
  })

  test('TC-16 coração não persiste entre telas', async ({ page }) => {
    await page.goto('/?q=neon')
    await waitForCatalog(page)
    await page.getByRole('button', { name: 'Salvar Neon Vessel #552' }).click()
    await page.getByRole('link', { name: /Neon Vessel #552/ }).first().click()
    await expect(page).toHaveURL(/neon-vessel-552/)
    await page.goto('/?q=neon')
    await waitForCatalog(page)
    await expect(page.getByRole('button', { name: 'Salvar Neon Vessel #552' })).toBeVisible()
  })
})