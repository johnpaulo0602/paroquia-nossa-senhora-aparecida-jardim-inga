import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** Main public routes: the pages most visitors land on. */
const routes = [
  '/',
  '/horarios',
  '/agenda',
  '/paroquia',
  '/comunidades',
  '/vida',
  '/vida/batismo',
  '/comunicacao',
  '/contato',
  '/contribuir',
]

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 850 },
]

const slug = (route: string) => (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-'))

test.describe('acessibilidade (axe, WCAG 2.1 AA)', () => {
  for (const route of routes) {
    test(`sem violações sérias em ${route}`, async ({ page }) => {
      await page.goto(route)
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const serious = violations
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
        .map((violation) => `${violation.id} (${violation.nodes.length}): ${violation.help}`)

      expect(serious, route).toEqual([])
    })
  }
})

test.describe('screenshots por largura', () => {
  for (const viewport of viewports) {
    test(`páginas principais em ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      for (const route of routes) {
        await page.goto(route)
        await page.evaluate(() => document.fonts.ready)
        const body = await page.screenshot({ fullPage: true, animations: 'disabled' })
        await testInfo.attach(`${viewport.name}-${slug(route)}.png`, {
          body,
          contentType: 'image/png',
        })

        // No horizontal scroll at any width.
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${route} @ ${viewport.width}px`).toBeLessThanOrEqual(0)
      }
    })
  }
})
