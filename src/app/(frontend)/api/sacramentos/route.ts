import {
  FormRequestError,
  type FormBody,
  formResponse,
  handleJsonForm,
  readConsent,
  readEmail,
  readEnum,
  readISODate,
  readRequiredString,
  readString,
  retentionDate,
} from '@/lib/form-server'
import { getCMS } from '@/lib/payload'
import { featureEnabled } from '@/lib/features'

const requestTypes = ['baptism', 'marriage'] as const
const baptismTextFields = [
  'childName',
  'parentName',
  'secondParentName',
  'godfatherName',
  'godmotherName',
] as const
const marriageTextFields = ['partnerOneName', 'partnerTwoName'] as const

type RequestType = (typeof requestTypes)[number]

const readDetails = (body: FormBody, requestType: RequestType): Record<string, string> => {
  const value = body.payload
  if (value === undefined || value === null) return {}
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new FormRequestError('Campo payload inválido.')
  }

  const input = value as FormBody
  const textFields = requestType === 'baptism' ? baptismTextFields : marriageTextFields
  const allowedFields: readonly string[] =
    requestType === 'baptism' ? [...textFields, 'birthDate'] : textFields

  for (const field of Object.keys(input)) {
    if (!allowedFields.includes(field)) {
      throw new FormRequestError(`Campo complementar não permitido: ${field}.`)
    }
  }

  const details: Record<string, string> = {}
  for (const field of textFields) {
    const text = readString(input, field, { max: 120 })
    if (text) details[field] = text
  }

  if (requestType === 'baptism') {
    const birthDate = readString(input, 'birthDate', { max: 10 })
    if (birthDate) details.birthDate = readISODate(birthDate, 'payload.birthDate')
  }

  return details
}

const readPhone = (body: FormBody): string => {
  const phone = readRequiredString(body, 'phone', { min: 8, max: 30 })
  const digits = phone.replace(/\D/g, '')
  if (!/^[+()\d.\-\s]+$/.test(phone) || digits.length < 8 || digits.length > 15) {
    throw new FormRequestError('Informe um telefone válido.')
  }
  return phone
}

const resolveCommunity = async (
  payload: Awaited<ReturnType<typeof getCMS>>,
  value: unknown,
): Promise<number | undefined> => {
  if (value === undefined || value === null || value === '') return undefined

  let id: number | undefined
  let slug: string | undefined

  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
    id = value
  } else if (typeof value === 'string') {
    const normalized = value.trim()
    if (/^[1-9]\d*$/.test(normalized)) {
      const parsed = Number(normalized)
      if (Number.isSafeInteger(parsed)) id = parsed
    } else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) && normalized.length <= 100) {
      slug = normalized
    }
  }

  if (!id && !slug) throw new FormRequestError('Comunidade inválida.')

  const result = await payload.find({
    collection: 'communities',
    where: id ? { id: { equals: id } } : { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (!result.docs[0]) throw new FormRequestError('Comunidade inválida.')
  return result.docs[0].id
}

export async function POST(request: Request): Promise<Response> {
  return handleJsonForm(
    request,
    {
      route: 'sacramentos',
      enabled: featureEnabled('SACRAMENT_FORM_ENABLED'),
      disabledMessage: 'O formulário de solicitação de sacramentos está temporariamente desativado.',
      honeypotMessage: 'Solicitação recebida. Nenhuma data foi reservada.',
    },
    async (body) => {
      const requestType = readEnum(body, 'requestType', requestTypes)
      const preferredDate = readString(body, 'preferredDate', { max: 10 })
      const notes = readString(body, 'notes', { max: 3000, multiline: true })
      const data = {
        requestType,
        applicantName: readRequiredString(body, 'applicantName', { min: 2, max: 120 }),
        email: readEmail(body),
        phone: readPhone(body),
        preferredDate: preferredDate
          ? `${readISODate(preferredDate, 'preferredDate')}T12:00:00.000Z`
          : undefined,
        payload: readDetails(body, requestType),
        notes,
        consent: readConsent(body),
        status: 'new' as const,
        retentionUntil: retentionDate(180),
      }

      const payload = await getCMS()
      const community = await resolveCommunity(payload, body.community)

      await payload.create({
        collection: 'sacrament-requests',
        data: { ...data, community },
        overrideAccess: true,
      })

      return formResponse(
        'Solicitação registrada. A data é apenas uma preferência e não representa reserva; a secretaria precisa confirmar a disponibilidade.',
        201,
      )
    },
  )
}
