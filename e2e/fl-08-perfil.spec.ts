import { expect, test } from '@playwright/test'
import { ADA, BRUNO, gotoAuthenticated, profileMain, resetMockStore, signOut } from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await resetMockStore(page)
})

test.describe('FL-08 Perfil e carteiras', () => {
  test('TC-31 Ada vê perfil e Bruno isolado', async ({ page }) => {
    await gotoAuthenticated(page, '/perfil', ADA)
    await expect(profileMain(page).getByLabel('E-mail')).toHaveValue(ADA.email, { timeout: 15_000 })
    await signOut(page)
    await gotoAuthenticated(page, '/perfil', BRUNO)
    await expect(profileMain(page).getByLabel('E-mail')).toHaveValue(BRUNO.email)
  })

  test('TC-34 itens fora de escopo não navegam', async ({ page }) => {
    await gotoAuthenticated(page, '/perfil', ADA)
    await page.getByRole('button', { name: 'Atividade' }).click()
    await expect(page).toHaveURL(/\/perfil/)
  })

  test('TC-33 carteiras mostra frase da secundária', async ({ page }) => {
    await gotoAuthenticated(page, '/carteiras', ADA)
    await expect(page.getByRole('heading', { name: 'Carteira principal' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText('Você ainda não adicionou uma carteira secundária.')).toBeVisible()
  })
})