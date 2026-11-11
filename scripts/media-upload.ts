/**
 * Sends the files referenced by the `media` collection (original + image sizes)
 * from the local `media/` folder to the S3 bucket in MEDIA_BUCKET.
 * Idempotent: files already in the bucket with the same size are skipped.
 */
import 'dotenv/config'

import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'media')
const bucket = process.env.MEDIA_BUCKET

if (!bucket) {
  console.error('[media-upload] Defina MEDIA_BUCKET no .env.')
  process.exit(1)
}

const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || 'us-east-2',
  forcePathStyle: true,
})

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'media', limit: 0, depth: 0, pagination: false })

const wanted = new Map<string, string>()
for (const doc of docs) {
  if (doc.filename) wanted.set(doc.filename, doc.mimeType || 'application/octet-stream')
  for (const size of Object.values(doc.sizes ?? {})) {
    if (size?.filename) wanted.set(size.filename, size.mimeType || 'application/octet-stream')
  }
}

let sent = 0
let skipped = 0
const missing: string[] = []

for (const [filename, contentType] of wanted) {
  const file = path.join(MEDIA_DIR, filename)
  const info = await stat(file).catch(() => null)
  if (!info) {
    missing.push(filename)
    continue
  }
  const remote = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: filename })).catch(() => null)
  if (remote?.ContentLength === info.size) {
    skipped++
    continue
  }
  await s3.send(
    new PutObjectCommand({ Bucket: bucket, Key: filename, Body: await readFile(file), ContentType: contentType }),
  )
  sent++
}

console.log(
  `[media-upload] ${docs.length} mídias, ${wanted.size} arquivos: ${sent} enviados, ${skipped} já estavam no bucket, ${missing.length} ausentes em media/.`,
)
if (missing.length) console.log('[media-upload] Ausentes:\n  ' + missing.join('\n  '))
process.exit(missing.length ? 1 : 0)
