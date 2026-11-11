import 'dotenv/config'

import path from 'node:path'

import { getPayload } from 'payload'

import { makeBlurDataURL } from '../src/lib/blur'
import config from '../src/payload.config'

/**
 * Backfills `blurData` for media uploaded before the field existed. New uploads get it from
 * the collection hook. Safe to run again: only documents without a preview are touched.
 */
async function main() {
  const payload = await getPayload({ config })
  const staticDir = path.resolve(process.cwd(), 'media')
  let done = 0
  let skipped = 0

  try {
    const { docs } = await payload.find({
      collection: 'media',
      where: { blurData: { exists: false } },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    for (const doc of docs) {
      const blurData = doc.filename ? await makeBlurDataURL(path.join(staticDir, doc.filename)) : null
      if (!blurData) {
        skipped += 1
        continue
      }
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { blurData },
        depth: 0,
        overrideAccess: true,
      })
      done += 1
    }

    console.info(`[media:blur] ${done} prévias geradas, ${skipped} sem arquivo legível.`)
  } finally {
    await payload.db.destroy?.()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('[media:blur] Falha ao gerar as prévias.', error)
    process.exit(1)
  })
