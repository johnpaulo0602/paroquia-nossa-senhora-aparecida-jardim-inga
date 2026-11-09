import { expect, test } from '@playwright/test'

test('horários mostra a próxima celebração e filtra por chips sem botão', async ({ page }) => {
  await page.goto('/horarios')

  await expect(page.getByText(/Próxima celebração/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Filtrar horários' })).toHaveCount(0)

  const filters = page.getByRole('navigation', { name: 'Filtrar horários' })
  await filters.getByRole('link', { name: 'Domingo' }).click()
  await expect(page).toHaveURL(/dia=sunday/)
  await expect(filters.getByRole('link', { name: 'Domingo' })).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('agenda abre em próximos eventos com um único seletor', async ({ page }) => {
  await page.goto('/agenda')

  const views = page.getByRole('navigation', { name: 'Como ver a agenda' })
  await expect(views.getByRole('link', { name: 'Próximos' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('button', { name: 'Filtrar' })).toHaveCount(0)

  await views.getByRole('link', { name: 'Calendário' }).click()
  await expect(page).toHaveURL(/visualizacao=calendario/)
})

test('páginas públicas não mostram placeholders de CMS', async ({ page }) => {
  for (const route of ['/', '/paroquia', '/padroeira', '/comunicacao', '/contato']) {
    await page.goto(route)
    const text = await page.locator('main').innerText()
    expect(text, route).not.toMatch(
      /não cadastrad|Nenhum destaque está em exibição|serão apresentados aqui|fictíci/i,
    )
  }
})

test('home mostra a próxima celebração com link para horários', async ({ page }) => {
  await page.goto('/')
  const strip = page.getByRole('link', { name: /Próxima celebração/ })
  await expect(strip).toHaveAttribute('href', '/horarios')
})
