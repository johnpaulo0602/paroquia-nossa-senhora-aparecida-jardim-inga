import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

/** sm · md · lg · xl — the only widths allowed in media queries (see tokens.css). */
const allowed = new Set([480, 768, 1024, 1280])

const srcDir = path.resolve(process.cwd(), 'src')

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return cssFiles(full)
    return entry.name.endsWith('.css') ? [full] : []
  })

describe('breakpoints', () => {
  it('usa só os quatro breakpoints do sistema, sempre com max-width', () => {
    const offenders: string[] = []

    for (const file of cssFiles(srcDir)) {
      const css = readFileSync(file, 'utf8')
      for (const match of css.matchAll(/@media[^{]*?\((min|max)-width:\s*(\d+)px\)/g)) {
        const [, kind, value] = match
        if (kind !== 'max' || !allowed.has(Number(value))) {
          offenders.push(`${path.relative(srcDir, file)}: ${kind}-width ${value}px`)
        }
      }
    }

    expect(offenders).toEqual([])
  })
})
