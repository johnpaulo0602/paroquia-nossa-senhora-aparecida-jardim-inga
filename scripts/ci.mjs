/**
 * Build entry point for hosted deployments (`npm run ci`, used by vercel.json).
 *
 * Migrations run for production and for the `homolog` branch, which has its own database
 * (see src/lib/deploy-env.ts). Any other preview deployment shares the production
 * environment variables, so it must never run migrations: it only builds.
 */
import { spawnSync } from 'node:child_process'

const { VERCEL_ENV, VERCEL_GIT_COMMIT_REF } = process.env
const isOtherPreview = VERCEL_ENV === 'preview' && VERCEL_GIT_COMMIT_REF !== 'homolog'

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: ['ignore', 'inherit', 'inherit'] })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (isOtherPreview) {
  console.log(
    `[ci] Preview da branch "${VERCEL_GIT_COMMIT_REF}": migrações não são aplicadas (banco de produção).`,
  )
} else {
  run('npx', ['payload', 'migrate'])
}

run('npm', ['run', 'build'])
