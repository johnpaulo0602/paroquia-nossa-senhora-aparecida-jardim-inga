import {
  formResponse,
  handleJsonForm,
  readConsent,
  readEmail,
  readEnum,
  readRequiredString,
  retentionDate,
} from '@/lib/form-server'
import { getCMS } from '@/lib/payload'
import { featureEnabled } from '@/lib/features'

const subjects = ['sacraments', 'participation', 'partnerships', 'communication', 'other'] as const
const relations = ['parishioner', 'visitor', 'interested'] as const

export async function POST(request: Request): Promise<Response> {
  return handleJsonForm(
    request,
    {
      route: 'contato',
      enabled: featureEnabled('CONTACT_FORM_ENABLED'),
      disabledMessage: 'O formulário de contato está temporariamente desativado.',
      honeypotMessage: 'Mensagem recebida.',
    },
    async (body) => {
      const data = {
        name: readRequiredString(body, 'name', { min: 2, max: 120 }),
        email: readEmail(body),
        subject: readEnum(body, 'subject', subjects),
        relation: readEnum(body, 'relation', relations),
        message: readRequiredString(body, 'message', { min: 2, max: 5000, multiline: true }),
        consent: readConsent(body),
        status: 'new' as const,
        retentionUntil: retentionDate(180),
      }

      const payload = await getCMS()
      await payload.create({
        collection: 'contact-messages',
        data,
        overrideAccess: true,
      })

      return formResponse('Mensagem enviada com sucesso. A secretaria poderá entrar em contato.', 201)
    },
  )
}
