import { expect, test } from '@playwright/test'
import {
  ADA,
  BRUNO,
  enterButton,
  expectOrderMessage,
  gotoHome,
  gotoAuthenticated,
  gotoOrder,
  profileMain,
  resetMockStore,
  signIn,
  signOut,
} from './helpers.ts'

test.beforeEach(async ({ page }) => {
  await resetMockStore(page)
})

test.describe('FL-03 Conta e troca de usuário', () => {
  test('TC-09 painel desktop abre e fecha por X e Esc', async ({ page }) => {
    await gotoHome(page)
    await enterButton(page).click()
    await expect(page).toHaveURL(/conta=entrar/)
    await page.getByRole('button', { name: 'Criar conta' }).click()
    await expect(page).toHaveURL(/conta=cadastro/)
    await page.getByRole('button', { name: 'Fechar' }).click()
    await expect(page).not.toHaveURL(/conta=/)

    await enterButton(page).click()
    await page.keyboard.press('Escape')
    await expect(page).not.toHaveURL(/conta=/)
  })

  test('TC-09 rotas /entrar e /cadastro viram conta na home', async ({ page }) => {
    await page.goto('/entrar')
    await expect(page).toHaveURL(/conta=entrar/)
    await page.goto('/cadastro')
    await expect(page).toHaveURL(/conta=cadastro/)
  })

  test('TC-10 Ada entra e senha errada falha', async ({ page }) => {
    await gotoHome(page)
    await enterButton(page).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('E-mail').fill(ADA.email)
    await dialog.getByLabel('Senha', { exact: true }).fill('errada')
    await dialog.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('E-mail ou senha não conferem.')).toBeVisible()
    await signIn(page, ADA.email, ADA.password)
  })

  test('TC-11 cadastro e validações', async ({ page }) => {
    await gotoHome(page)
    await enterButton(page).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Criar conta' }).click()
    await dialog.locator('form').getByRole('button', { name: 'Criar conta' }).click()
    await expect(page.getByText('Informe nome, e-mail e senha.')).toBeVisible()
    await dialog.getByLabel('Nome de usuário').fill('Lia')
    await dialog.getByLabel('E-mail').fill(`lia-${Date.now()}@kurio.test`)
    await dialog.getByLabel('Senha', { exact: true }).fill('kurio')
    await dialog.getByLabel('Confirmar senha').fill('kurio')
    await dialog.locator('form').getByRole('button', { name: 'Criar conta' }).click()
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible()

    await signOut(page)
    await enterButton(page).click()
    const again = page.getByRole('dialog')
    await again.getByRole('button', { name: 'Criar conta' }).click()
    await again.getByLabel('Nome de usuário').fill('X')
    await again.getByLabel('E-mail').fill(BRUNO.email)
    await again.getByLabel('Senha', { exact: true }).fill('kurio')
    await again.getByLabel('Confirmar senha').fill('kurio')
    await again.locator('form').getByRole('button', { name: 'Criar conta' }).click()
    await expect(page.getByText('Este e-mail já tem conta.')).toBeVisible()
  })

  test('TC-12 troca Ada e Bruno e isolamento de pedido', async ({ page }) => {
    await gotoOrder(page, 'ped-bruno-1', ADA)
    await expectOrderMessage(page, 'Pedido não encontrado.')
    await signOut(page)
    await gotoAuthenticated(page, '/perfil', BRUNO)
    await expect(profileMain(page).getByLabel('E-mail')).toHaveValue(BRUNO.email)
  })

  test('TC-13 guarda e retorno após sucesso', async ({ page }) => {
    await page.goto('/perfil')
    await expect(page).toHaveURL(/conta=entrar/)
    await signIn(page, ADA.email, ADA.password)
    await expect(page).toHaveURL(/\/perfil/)
  })

  test('TC-13 recarregar perde sessão', async ({ page }) => {
    await signIn(page, ADA.email, ADA.password)
    await page.reload()
    await expect(enterButton(page)).toBeVisible()
  })
})

test.describe('FL-03 mobile entrada cheia @mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('TC-14 entrada cheia e sociais visíveis', async ({ page }) => {
    await page.goto('/entrar')
    await expect(page.getByRole('heading', { name: 'Entrar', level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continuar com Google' })).toBeVisible()
    await page.getByRole('button', { name: 'Continuar com Google' }).click()
    await expect(page).toHaveURL(/\/entrar/)
  })
})