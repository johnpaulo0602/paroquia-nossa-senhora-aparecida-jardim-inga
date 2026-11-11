import {
  FormRequestError,
  formResponse,
  handleJsonForm,
  readEmail,
  readString,
  retentionDate,
} from '@/lib/form-server'
import { getCMS } from '@/lib/payload'
import { featureEnabled } from '@/lib/features'

const responseMessage = 'Se os dados forem localizados, o cancelamento será registrado.'

export async function POST(request: Request): Promise<Response> {
  return handleJsonForm(
    request,
    {
      route: 'newsletter-cancelar',
      enabled: featureEnabled('NEWSLETTER_ENABLED'),
      disabledMessage: 'O cancelamento da newsletter está temporariamente desativado.',
      honeypotMessage: responseMessage,
    },
    async (body) => {
      const token = readString(body, 'token', { max: 128 })
      const email = token ? undefined : readEmail(body)
      if (!token && !email) throw new FormRequestError('Informe o token ou o e-mail.')

      const payload = await getCMS()
      const result = await payload.find({
        collection: 'newsletter-subscribers',
        where: token
          ? { unsubscribeToken: { equals: token } }
          : { email: { equals: email } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const subscriber = result.docs[0]

      if (subscriber && subscriber.status !== 'unsubscribed') {
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data: {
            status: 'unsubscribed',
            retentionUntil: retentionDate(180),
          },
          overrideAccess: true,
        })
      }

      return formResponse(responseMessage)
    },
  )
}
