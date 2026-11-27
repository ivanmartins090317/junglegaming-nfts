import { expect, test } from '@playwright/test'
import { authForm } from './helpers.ts'

test.describe('Simulação desligada', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('TC-08 catálogo e detalhe com falha', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Não foi possível carregar o catálogo.')).toBeVisible({ timeout: 20_000 })
    await page.goto('/nfts/neon-vessel-552')
    await expect
      .poll(
        async () => {
          const text = await page.locator('article').innerText()
          if (text.includes('COMPRAR')) return 'loaded'
          if (text.includes('Não foi possível carregar a peça.')) return 'fail'
          if (text.includes('NFT não encontrado.')) return 'missing'
          if (text.includes('Carregando')) return 'loading'
          return text.slice(0, 40)
        },
        { timeout: 20_000 },
      )
      .not.toBe('loaded')
    await expect(page.locator('article')).not.toContainText('COMPRAR')
  })

  test('TC-14 sem mock a entrada não carrega sessão', async ({ page }) => {
    await page.goto('/entrar')
    const form = authForm(page)
    await form.getByLabel('E-mail').fill('ada@kurio.test')
    await form.getByLabel('Senha', { exact: true }).fill('kurio')
    await form.locator('button[type="submit"]').click()
    await expect(page.getByText('Não foi possível carregar a sessão.')).toBeVisible()
  })

  test('TC-39 sem escuta de preço nem pedido', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Não foi possível carregar o catálogo.')).toBeVisible({ timeout: 20_000 })
    await page.goto('/nfts/neon-vessel-552')
    await expect(page.locator('article')).not.toContainText('COMPRAR', { timeout: 20_000 })
  })
})
