import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 1366, height: 850 } })

const nav = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Navegação principal' })

test('dropdown do menu fecha ao clicar fora', async ({ page }) => {
  await page.goto('/')
  const trigger = nav(page).getByRole('button', { name: 'A paróquia' })

  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(nav(page).getByRole('link', { name: 'Nossa história' })).toBeVisible()

  await page.locator('main').click({ position: { x: 10, y: 10 } })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(nav(page).getByRole('link', { name: 'Nossa história' })).toBeHidden()
})

test('apenas um dropdown fica aberto por vez', async ({ page }) => {
  await page.goto('/')
  const first = nav(page).getByRole('button', { name: 'A paróquia' })
  const second = nav(page).getByRole('button', { name: 'Sacramentos' })

  await first.click()
  await second.click()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
})

test('dropdown fecha com Esc e devolve o foco ao botão', async ({ page }) => {
  await page.goto('/')
  const trigger = nav(page).getByRole('button', { name: 'A paróquia' })

  await trigger.click()
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
})

test('dropdown fecha ao navegar e marca a seção atual', async ({ page }) => {
  await page.goto('/')
  const trigger = nav(page).getByRole('button', { name: 'A paróquia' })

  await trigger.click()
  await nav(page).getByRole('link', { name: 'Nossa história' }).click()
  await expect(page).toHaveURL(/\/paroquia$/)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.click()
  await expect(nav(page).getByRole('link', { name: 'Nossa história' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('botões da faixa de contato do rodapé são legíveis', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('link', { name: 'Ver comunicação' })

  await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)')
})

test('URL inexistente mostra o 404 da paróquia', async ({ page }) => {
  const response = await page.goto('/pagina-que-nao-existe')

  expect(response?.status()).toBe(404)
  await expect(page.getByText('Não foi possível encontrar este conteúdo.')).toBeVisible()
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('main')).toHaveCount(1)
})

test.describe('menu mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('abre em tela cheia, trava a rolagem e fecha ao navegar', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menu' })

    await expect(page.locator('header')).toHaveJSProperty('offsetHeight', 65)
    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/nav-locked/)

    await nav(page).getByRole('button', { name: 'Sacramentos' }).click()
    await nav(page).getByRole('link', { name: 'Batismo' }).click()

    await expect(page).toHaveURL(/\/vida\/batismo$/)
    await expect(page.locator('html')).not.toHaveClass(/nav-locked/)
    await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  test('não tem rolagem horizontal', async ({ page }) => {
    await page.goto('/')
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(width).toBeLessThanOrEqual(375)
  })
})

test('Missas e horários é link direto no menu', async ({ page }) => {
  await page.goto('/')
  await nav(page).getByRole('link', { name: 'Missas e horários' }).click()
  await expect(page).toHaveURL(/\/horarios$/)
  await expect(nav(page).getByRole('link', { name: 'Missas e horários' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})
