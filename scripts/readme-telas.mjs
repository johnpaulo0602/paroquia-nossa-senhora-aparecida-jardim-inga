/**
 * Gera os prints do README em docs/readme/telas.
 *
 *   npm run build && npm start          # em outro terminal, com o seed aplicado
 *   npm run docs:telas                  # BASE_URL=http://localhost:3000 por padrão
 *
 * Para o print do painel, defina PAYLOAD_ADMIN_EMAIL e PAYLOAD_ADMIN_PASSWORD no .env.
 */
import 'dotenv/config'

import { mkdir } from 'node:fs/promises'
import path from 'node:path'

import { chromium, devices } from 'playwright'
import sharp from 'sharp'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUT = path.resolve('docs/readme/telas')

const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
const mobile = { ...devices['iPhone 13'], deviceScaleFactor: 2 }

/** [arquivo, rota, contexto, ação opcional antes do print] */
const shots = [
  ['home', '/', desktop],
  ['horarios', '/horarios', desktop],
  ['agenda', '/agenda', desktop],
  ['vida-crista', '/vida', desktop],
  ['paroquia', '/paroquia', desktop],
  ['comunicacao', '/comunicacao', desktop],
  ['mobile-home', '/', mobile],
  [
    'mobile-menu',
    '/',
    mobile,
    async (page) => {
      await page.getByRole('button', { name: /menu/i }).first().click()
      await page.waitForTimeout(500)
    },
  ],
]

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  // Imagens com loading="lazy" só carregam perto da tela: rola até o fim e volta.
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 400))
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(600)
}

async function save(buffer, name) {
  const file = path.join(OUT, `${name}.webp`)
  await sharp(buffer).webp({ quality: 82 }).toFile(file)
  console.info(`[telas] ${path.relative(process.cwd(), file)}`)
}

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

try {
  for (const [name, route, options, before] of shots) {
    const context = await browser.newContext({ ...options, reducedMotion: 'reduce', locale: 'pt-BR' })
    const page = await context.newPage()
    await page.goto(new URL(route, BASE_URL).toString())
    await settle(page)
    if (before) await before(page)
    await save(await page.screenshot({ animations: 'disabled' }), name)
    await context.close()
  }

  const { PAYLOAD_ADMIN_EMAIL: email, PAYLOAD_ADMIN_PASSWORD: password } = process.env
  if (email && password) {
    const context = await browser.newContext({ ...desktop, locale: 'pt-BR' })
    const page = await context.newPage()
    await page.goto(new URL('/admin/login', BASE_URL).toString())
    await page.locator('#field-email').fill(email)
    await page.locator('#field-password').fill(password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/admin\/?$/)
    await page.waitForLoadState('networkidle')
    // Sem internet (CI, sandbox) o avatar do Gravatar vira imagem quebrada.
    await page.addStyleTag({ content: 'img[src*="gravatar"] { visibility: hidden }' })
    await save(await page.screenshot(), 'admin-painel')

    await page.goto(new URL('/admin/collections/celebrations', BASE_URL).toString())
    await page.waitForLoadState('networkidle')
    await page.addStyleTag({ content: 'img[src*="gravatar"] { visibility: hidden }' })
    await page.waitForTimeout(500)
    await save(await page.screenshot(), 'admin-celebracoes')
    await context.close()
  } else {
    console.info('[telas] Sem PAYLOAD_ADMIN_EMAIL/PASSWORD: prints do painel ignorados.')
  }
} finally {
  await browser.close()
}
