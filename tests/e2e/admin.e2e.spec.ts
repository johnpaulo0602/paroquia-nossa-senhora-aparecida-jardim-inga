import { expect, test } from '@playwright/test'

import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { login } from '../helpers/login'

test.describe('Admin Panel', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test.beforeEach(async ({ page }) => {
    await login({ page, user: testUser })
  })

  test('acessa o dashboard autenticado', async ({ page }) => {
    await page.goto('/admin')

    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible()
  })

  test('acessa a lista de usuários', async ({ page }) => {
    await page.goto('/admin/collections/users')

    await expect(page.getByRole('heading', { name: 'Usuários' }).first()).toBeVisible()
  })

  test('abre o formulário de novo usuário', async ({ page }) => {
    await page.goto('/admin/collections/users/create')

    await expect(page).toHaveURL(/\/admin\/collections\/users\/create$/)
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
  })

  test('abre os cadastros principais', async ({ page }) => {
    for (const collection of ['posts', 'events', 'communities', 'celebrations', 'highlights']) {
      await page.goto(`/admin/collections/${collection}`)
      await expect(page).toHaveURL(new RegExp(`/admin/collections/${collection}$`))
      await expect(page.locator('h1').first()).toBeVisible()
    }
  })
})
