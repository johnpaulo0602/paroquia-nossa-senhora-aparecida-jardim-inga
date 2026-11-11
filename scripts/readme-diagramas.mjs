/**
 * Gera os GIFs animados do README a partir de docs/readme/diagramas/fonte.
 *
 *   npm run docs:diagramas            # todos
 *   npm run docs:diagramas colecoes   # só um
 *
 * Cada diagrama é um SVG animado com Motion (vendor/motion.js). A timeline fica pausada e
 * este script avança quadro a quadro, então o resultado é idêntico a cada execução.
 * Requer o ffmpeg no PATH.
 */
import { execFileSync } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { chromium } from 'playwright'

const ROOT = process.cwd()
const SOURCE = 'docs/readme/diagramas/fonte/index.html'
const OUT = path.resolve('docs/readme/diagramas')
const FPS = 15
const ALL = ['arquitetura', 'requisicao', 'colecoes', 'editorial', 'formularios']
const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' }
const server = createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!file.startsWith(ROOT)) return res.writeHead(403).end()
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream')
  createReadStream(file).on('error', () => res.writeHead(404).end()).pipe(res)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/${SOURCE}`

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

try {
  for (const name of names) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 })
    await page.goto(`${base}?d=${name}`)
    await page.waitForSelector('html[data-ready="true"]')
    const card = page.locator('.card')
    const duration = await page.evaluate(() => window.diagram.duration)
    const frames = Math.ceil(duration * FPS)
    const dir = await mkdtemp(path.join(tmpdir(), `diagrama-${name}-`))

    for (let i = 0; i <= frames; i++) {
      await page.evaluate((t) => window.diagram.seek(t), i / FPS)
      await card.screenshot({ path: path.join(dir, `${String(i).padStart(4, '0')}.png`) })
    }

    const gif = path.join(OUT, `${name}.gif`)
    // Paleta única por diagrama + só o retângulo que muda entre quadros: GIF pequeno e nítido.
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%04d.png'),
      '-vf', 'split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle',
      '-loop', '0', gif,
    ])
    await rm(dir, { recursive: true, force: true })
    console.info(`[diagramas] ${path.relative(ROOT, gif)} · ${frames + 1} quadros · ${duration.toFixed(1)}s`)
    await page.close()
  }
} finally {
  await browser.close()
  server.close()
}
