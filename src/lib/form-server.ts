const MAX_JSON_BYTES = 32 * 1024
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const MAX_RATE_LIMIT_ENTRIES = 5000

export type FormBody = Record<string, unknown>

type FormRouteOptions = {
  route: string
  enabled: boolean
  disabledMessage: string
  honeypotMessage?: string
}

type StringOptions = {
  required?: boolean
  min?: number
  max: number
  multiline?: boolean
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimits = new Map<string, RateLimitEntry>()

export class FormRequestError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'FormRequestError'
    this.status = status
  }
}

export const formResponse = (
  message: string,
  status = 200,
  headers?: HeadersInit,
): Response =>
  Response.json(
    { success: status >= 200 && status < 300, message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...Object.fromEntries(new Headers(headers)),
      },
    },
  )

const requestIP = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return (forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown').slice(0, 200)
}

const pruneRateLimits = (now: number): void => {
  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(key)
  }
}

const checkRateLimit = (request: Request, route: string): Response | null => {
  const now = Date.now()
  pruneRateLimits(now)

  if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
    return formResponse('Muitas tentativas. Tente novamente mais tarde.', 429, {
      'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
    })
  }

  const key = `${route}:${requestIP(request)}`
  const current = rateLimits.get(key)

  if (!current) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return null
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return formResponse('Muitas tentativas. Tente novamente mais tarde.', 429, {
      'Retry-After': String(retryAfter),
    })
  }

  current.count += 1
  return null
}

const checkOrigin = (request: Request): Response | null => {
  const origin = request.headers.get('origin')
  if (!origin) return null

  try {
    const expectedOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || '').origin
    if (new URL(origin).origin === expectedOrigin) return null
  } catch {
    return formResponse('Origem não autorizada.', 403)
  }

  return formResponse('Origem não autorizada.', 403)
}

const guardRequest = (request: Request, options: FormRouteOptions): Response | null => {
  if (!options.enabled) return formResponse(options.disabledMessage, 503)
  return checkOrigin(request) || checkRateLimit(request, options.route)
}

const runGuarded = async (
  request: Request,
  options: FormRouteOptions,
  handler: () => Promise<Response>,
): Promise<Response> => {
  const guarded = guardRequest(request, options)
  if (guarded) return guarded

  try {
    return await handler()
  } catch (error) {
    if (error instanceof FormRequestError) return formResponse(error.message, error.status)
    return formResponse('Não foi possível processar a solicitação. Tente novamente mais tarde.', 500)
  }
}

const readBodyText = async (request: Request): Promise<string> => {
  const contentLength = request.headers.get('content-length')
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) throw new FormRequestError('Tamanho de conteúdo inválido.')
    if (Number(contentLength) > MAX_JSON_BYTES) {
      throw new FormRequestError('O conteúdo enviado excede o limite de 32 KB.', 413)
    }
  }

  if (!request.body) throw new FormRequestError('Informe um conteúdo JSON válido.')

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue

    total += value.byteLength
    if (total > MAX_JSON_BYTES) {
      await reader.cancel().catch(() => undefined)
      throw new FormRequestError('O conteúdo enviado excede o limite de 32 KB.', 413)
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new FormRequestError('O conteúdo JSON deve usar codificação UTF-8.')
  }
}

export const readJsonBody = async (request: Request): Promise<FormBody> => {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase()
  if (contentType !== 'application/json') {
    throw new FormRequestError('Envie o conteúdo como application/json.', 415)
  }

  const text = await readBodyText(request)
  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new FormRequestError('Informe um conteúdo JSON válido.')
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new FormRequestError('O conteúdo JSON deve ser um objeto.')
  }

  return value as FormBody
}

export const handleJsonForm = (
  request: Request,
  options: FormRouteOptions,
  handler: (body: FormBody) => Promise<Response>,
): Promise<Response> =>
  runGuarded(request, options, async () => {
    const body = await readJsonBody(request)
    const website = body.website

    if (website !== undefined && website !== null && typeof website !== 'string') {
      throw new FormRequestError('Campo website inválido.')
    }
    if (typeof website === 'string' && website.trim()) {
      return formResponse(options.honeypotMessage || 'Solicitação recebida.')
    }

    return handler(body)
  })

export const handleFormAction = (
  request: Request,
  options: FormRouteOptions,
  handler: () => Promise<Response>,
): Promise<Response> => runGuarded(request, options, handler)

export const readString = (
  body: FormBody,
  field: string,
  options: StringOptions,
): string | undefined => {
  const value = body[field]
  if (value === undefined || value === null || value === '') {
    if (options.required) throw new FormRequestError(`Informe um valor válido para ${field}.`)
    return undefined
  }
  if (typeof value !== 'string') throw new FormRequestError(`Campo ${field} inválido.`)

  let normalized = value
    .normalize('NFC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()

  normalized = options.multiline
    ? normalized.replace(/\r\n?/g, '\n')
    : normalized.replace(/\s+/g, ' ')

  const min = options.min ?? (options.required ? 1 : 0)
  if (normalized.length < min || normalized.length > options.max) {
    throw new FormRequestError(`Campo ${field} inválido.`)
  }
  if (options.required && !normalized) {
    throw new FormRequestError(`Informe um valor válido para ${field}.`)
  }

  return normalized || undefined
}

export const readRequiredString = (
  body: FormBody,
  field: string,
  options: Omit<StringOptions, 'required'>,
): string => {
  const value = readString(body, field, { ...options, required: true })
  if (value === undefined) throw new FormRequestError(`Informe um valor válido para ${field}.`)
  return value
}

export const readEmail = (body: FormBody, field = 'email'): string => {
  const email = readRequiredString(body, field, { max: 254 }).toLowerCase()
  const [local, domain, ...rest] = email.split('@')

  if (
    !local ||
    !domain ||
    rest.length > 0 ||
    local.length > 64 ||
    !/^[^\s@]+$/.test(local) ||
    !/^[^\s@]+\.[^\s@]+$/.test(domain)
  ) {
    throw new FormRequestError('Informe um e-mail válido.')
  }

  return email
}

export const readConsent = (body: FormBody): true => {
  if (body.consent !== true) {
    throw new FormRequestError('O consentimento explícito é obrigatório.')
  }
  return true
}

export const readEnum = <T extends string>(
  body: FormBody,
  field: string,
  values: readonly T[],
): T => {
  const value = readRequiredString(body, field, { max: 50 })
  if (!values.includes(value as T)) throw new FormRequestError(`Campo ${field} inválido.`)
  return value as T
}

export const readISODate = (value: string, field: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new FormRequestError(`Campo ${field} inválido.`)
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new FormRequestError(`Campo ${field} inválido.`)
  }

  return value
}

export const retentionDate = (days: number, from = new Date()): string =>
  new Date(from.getTime() + days * 24 * 60 * 60 * 1000).toISOString()
