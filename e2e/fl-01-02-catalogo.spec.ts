import { expect, test } from '@playwright/test'
import { catalogSeedNames, gotoHome, searchInput, waitForCatalog } from './helpers.ts'

test.describe('FL-01 Catálogo e histórico', () => {
  test('TC-01 grade inicial na ordem da semente', async ({ page }) => {
    await gotoHome(page)
    const names = await page.locator('#grade h3').allTextContents()
    expect(names).toEqual([...catalogSeedNames])
    await expect(page.getByText('2.29')).toBeVisible()
  })

  test('TC-02 busca q recorta, case insensitive e apagar devolve oito peças', async ({ page }) => {
    await gotoHome(page)
    await page.getByRole('button', { name: 'Busca' }).click()
    const search = searchInput(page)
    await search.fill('neon')
    await expect(page).toHaveURL(/\?q=neon/)
    await expect(page.getByRole('heading', { name: 'Neon Vessel #552', level: 3 })).toHaveCount(1)

    await page.goto('/?q=NEON')
    await waitForCatalog(page)
    await expect(page.locator('#grade h3')).toHaveCount(1)

    for (const q of ['nomad', '552', 'inexistente']) {
      await page.goto(`/?q=${q}`)
      await expect(page.getByText('Nenhuma peça com esse nome.')).toBeVisible({ timeout: 15_000 })
    }

    await page.goto('/')
    await waitForCatalog(page)
    await expect(page).not.toHaveURL(/q=/)
    await expect(page.locator('#grade h3')).toHaveCount(8)
  })

  test('TC-03 histórico preserva q e voltar do carrinho', async ({ page }) => {
    await page.goto('/?q=neon')
    await waitForCatalog(page)
    await page.getByRole('heading', { name: 'Neon Vessel #552', level: 3 }).click()
    await expect(page).toHaveURL(/\/nfts\/neon-vessel-552/)
    await expect(page).toHaveURL(/q=neon/)
    await page.goBack()
    await expect(page).toHaveURL(/q=neon/)

    await page.goto('/carrinho')
    await page.getByRole('button', { name: 'Busca' }).click()
    await searchInput(page).fill('sage')
    await expect(page).toHaveURL(/\?q=sage/)
    await page.goBack()
    await expect(page).toHaveURL(/\/carrinho/)
  })

  test('TC-04 demais filtros visuais e faixa de preço funcional', async ({ page }) => {
    await gotoHome(page)
    await page.locator('aside').getByRole('button', { name: /Arte digital/ }).click()
    await page.locator('aside').getByRole('button', { name: /Ethereum/ }).click()
    await page.getByRole('tab', { name: 'Em alta' }).click()
    await page.getByRole('button', { name: 'Listados recentemente' }).click()
    await page.getByRole('button', { name: '3', exact: true }).click()
    await expect(page).not.toHaveURL(/aba|rede|pagina/)
    await expect(page.locator('#grade h3')).toHaveCount(8)

    await page.locator('input[name="preco-min"]').fill('1.50')
    await page.locator('input[name="preco-max"]').fill('2.00')
    await page.locator('aside').getByRole('button', { name: 'Aplicar' }).click()
    await waitForCatalog(page)
    const names = await page.locator('#grade h3').allTextContents()
    expect(names).toEqual(['Sage Nomad #009', 'Neon Vessel #552', 'Ivory Baron #088'])
    await expect(page).not.toHaveURL(/preco|min|max/)
  })

  test('TC-05 lupa abre busca no desktop', async ({ page }) => {
    await gotoHome(page)
    await expect(searchInput(page)).toBeHidden()
    await page.getByRole('button', { name: 'Busca' }).click()
    await expect(searchInput(page)).toBeVisible()
    await searchInput(page).fill('cosmic')
    await expect(page).toHaveURL(/\?q=cosmic/)
  })
})

test.describe('FL-01 mobile @mobile', () => {
  test('TC-05 mobile Explorar coleções grava q', async ({ page }) => {
    await gotoHome(page)
    await searchInput(page).fill('violet')
    await expect(page).toHaveURL(/\?q=violet/)
  })
})

test.describe('FL-02 Detalhe inexistente', () => {
  test('TC-06 detalhe direto da peça da semente', async ({ page }) => {
    await page.goto('/nfts/neon-vessel-552')
    await expect(page.getByRole('heading', { name: 'Neon Vessel #552' })).toBeVisible()
    await expect(page.locator('article')).toContainText('1.99 ETH')
    await expect(page.locator('article')).toContainText('2.29 ETH')
    await expect(page.getByText('RARO', { exact: true })).toBeVisible()
  })

  test('TC-07 identificador ausente', async ({ page }) => {
    await page.goto('/nfts/nao-existe')
    await expect(page.getByText('NFT não encontrado.')).toBeVisible()
  })
})