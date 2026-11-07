import { FormRequestError, formResponse, handleFormAction } from '@/lib/form-server'
import { getCMS } from '@/lib/payload'

const responseMessage = 'Se o link for válido, a confirmação da inscrição será registrada.'

export async function GET(request: Request): Promise<Response> {
  return handleFormAction(
    request,
    {
      route: 'newsletter-confirmar',
      enabled: process.env.NEWSLETTER_ENABLED === 'true',
      disabledMessage: 'A confirmação da newsletter está temporariamente desativada.',
    },
    async () => {
      const token = new URL(request.url).searchParams.get('token')?.trim()
      if (!token) throw new FormRequestError('Informe o token de confirmação.')
      if (token.length > 128) throw new FormRequestError('Token de confirmação inválido.')

      const payload = await getCMS()
      const result = await payload.find({
        collection: 'newsletter-subscribers',
        where: { unsubscribeToken: { equals: token } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const subscriber = result.docs[0]

      if (subscriber?.status === 'pending') {
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data: {
            status: 'confirmed',
            confirmedAt: new Date().toISOString(),
            retentionUntil: null,
          },
          overrideAccess: true,
        })
      }

      return formResponse(responseMessage)
    },
  )
}
