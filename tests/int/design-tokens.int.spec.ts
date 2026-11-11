import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const srcDir = path.resolve(process.cwd(), 'src')

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return cssFiles(full)
    return entry.name.endsWith('.css') ? [full] : []
  })

/** Hex, rgb()/hsl() and named white/black values — anything that should be a token. */
const literalColor = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(|:\s*(?:white|black)\b/i

describe('tokens de design', () => {
  it('cores vêm só do tokens.css', () => {
    const offenders: string[] = []

    for (const file of cssFiles(srcDir)) {
      if (path.basename(file) === 'tokens.css') continue
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
          // Masks use black only as an alpha channel, not as a color.
          if (/^\s*(-webkit-)?mask/.test(line)) return
          if (literalColor.test(line)) {
            offenders.push(`${path.relative(srcDir, file)}:${index + 1}: ${line.trim()}`)
          }
        })
    }

    expect(offenders).toEqual([])
  })
})
