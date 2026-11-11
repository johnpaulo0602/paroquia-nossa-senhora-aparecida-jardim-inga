import {
  formResponse,
  handleJsonForm,
  readConsent,
  readEmail,
  readRequiredString,
  retentionDate,
} from '@/lib/form-server'
import { getCMS } from '@/lib/payload'
import { featureEnabled } from '@/lib/features'

export async function POST(request: Request): Promise<Response> {
  return handleJsonForm(
    request,
    {
      route: 'dizimo',
      enabled: featureEnabled('TITHE_FORM_ENABLED'),
      disabledMessage: 'O formulário de interesse no dízimo está temporariamente desativado.',
      honeypotMessage: 'Solicitação recebida.',
    },
    async (body) => {
      const data = {
        name: readRequiredString(body, 'name', { min: 2, max: 120 }),
        email: readEmail(body),
        consent: readConsent(body),
        status: 'new' as const,
        retentionUntil: retentionDate(180),
      }

      const payload = await getCMS()
      await payload.create({
        collection: 'tithe-interests',
        data,
        overrideAccess: true,
      })

      return formResponse(
        'Interesse registrado com sucesso. Nenhuma doação ou pagamento foi realizado.',
        201,
      )
    },
  )
}
