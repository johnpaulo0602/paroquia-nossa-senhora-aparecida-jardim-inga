import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/comunicacao',
  '/comunicacao/album-matriz',
  '/agenda',
  '/eventos/encontro-de-formacao-2026-11-15',
  '/horarios',
  '/secretaria',
  '/contato',
  '/paroquia',
  '/padroeira',
  '/equipe',
  '/comunidades',
  '/comunidades/matriz',
  '/vida',
  '/vida/catequese',
  '/vida/batismo',
  '/vida/matrimonio',
  '/vida/pastorais',
  '/pastorais/liturgia-musica',
  '/vida/in-cordibus-pastorum',
  '/vida/espiritualidade',
  '/reflexoes/escuta',
  '/vida/mural-do-dizimo',
  '/projetos',
  '/contribuir',
]

test('apresenta a home da paróquia', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Nossa Senhora Aparecida/)
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('footer')).toBeVisible()
})

for (const route of publicRoutes) {
  test(`abre a rota ${route}`, async ({ page }) => {
    const response = await page.goto(route)

    expect(response?.status()).toBe(200)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByText('Welcome to your new project.')).toHaveCount(0)
  })
}

test('apresenta 404 para conteúdo inexistente', async ({ page }) => {
  const response = await page.goto('/comunicacao/conteudo-inexistente')

  expect(response?.status()).toBe(404)
  await expect(page.getByText('Não foi possível encontrar este conteúdo.')).toBeVisible()
})

test('exporta arquivo ICS válido para evento público', async ({ request }) => {
  const response = await request.get('/eventos/encontro-de-formacao-2026-11-15/ics')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/calendar')
  const body = await response.text()
  expect(body).toContain('BEGIN:VCALENDAR')
  expect(body).toContain('BEGIN:VEVENT')
})
