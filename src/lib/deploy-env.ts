/**
 * Deployment environment helpers. Imported first by `payload.config.ts`, so it runs
 * before anything reads DATABASE_URL (app runtime, `payload migrate`, seed).
 *
 * Homologation: Vercel builds the `homolog` Git branch as a preview deployment with the
 * same environment variables as production. A Neon child branch shares the parent's
 * database password and storage credentials and differs only in its hostnames, so the
 * staging deployment is pointed at the `homolog` Neon branch by swapping those hostnames.
 * They are not secrets. If the Neon branch is recreated, update the ids below.
 */
const NEON = {
  production: { database: 'ep-blue-firefly-bd4vwk07', storage: 'br-autumn-math-bdry6p1z' },
  homolog: { database: 'ep-floral-thunder-bdfbz0ad', storage: 'br-purple-salad-bdimc380' },
} as const

export const isHomologDeployment = (env: NodeJS.ProcessEnv = process.env) =>
  env.VERCEL_ENV === 'preview' && env.VERCEL_GIT_COMMIT_REF === 'homolog'

export function applyDeployEnv(env: NodeJS.ProcessEnv = process.env): void {
  if (!isHomologDeployment(env)) return

  const swap = (value: string | undefined, kind: 'database' | 'storage') =>
    value?.replaceAll(NEON.production[kind], NEON.homolog[kind])

  env.DATABASE_URL = swap(env.DATABASE_URL, 'database')
  env.DATABASE_URL_UNPOOLED = swap(env.DATABASE_URL_UNPOOLED, 'database')
  env.AWS_ENDPOINT_URL_S3 = swap(env.AWS_ENDPOINT_URL_S3, 'storage')

  // Never let the staging code (and its migrations) reach the production database.
  if (!env.DATABASE_URL?.includes(NEON.homolog.database)) {
    throw new Error(
      'Deploy de homologação sem banco de homologação: DATABASE_URL não aponta para a branch "homolog" do Neon.',
    )
  }
}

const isLocalhost = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url)

/** Public origin of this deployment, without a trailing slash. */
export function getSiteURL(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  const onVercel = Boolean(env.VERCEL)

  // A localhost value copied into a hosted deployment is a mistake: ignore it there.
  if (explicit && !(onVercel && isLocalhost(explicit)) && !isHomologDeployment(env)) return explicit

  const host =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : env.VERCEL_BRANCH_URL || env.VERCEL_URL
  if (host) return `https://${host}`

  return explicit || 'http://localhost:3000'
}

/**
 * Payload `serverURL`. Hosted deployments answer on several hostnames (deployment URL,
 * branch URL, custom domain), so there the admin uses relative URLs instead of one origin.
 */
export function getServerURL(env: NodeJS.ProcessEnv = process.env): string {
  return env.VERCEL ? '' : getSiteURL(env)
}

applyDeployEnv()
