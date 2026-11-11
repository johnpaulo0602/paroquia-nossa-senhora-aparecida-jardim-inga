import { randomUUID } from 'node:crypto'

import {
  formResponse,
  handleJsonForm,
  readConsent,
  readEmail,
  retentionDate,
} from '@/lib/form-server'
import { getCMS } from '@/lib/payload'
import { featureEnabled } from '@/lib/features'

const responseMessage =
  'Solicitação recebida. A inscrição só será ativada após confirmação pelo fluxo de double opt-in.'

export async function POST(request: Request): Promise<Response> {
  return handleJsonForm(
    request,
    {
      route: 'newsletter',
      enabled: featureEnabled('NEWSLETTER_ENABLED'),
      disabledMessage: 'A inscrição na newsletter está temporariamente desativada.',
      honeypotMessage: responseMessage,
    },
    async (body) => {
      const email = readEmail(body)
      const consent = readConsent(body)
      const now = new Date()
      const payload = await getCMS()
      const existing = await payload.find({
        collection: 'newsletter-subscribers',
        where: { email: { equals: email } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const subscriber = existing.docs[0]

      if (subscriber?.status === 'confirmed') return formResponse(responseMessage, 202)

      const data = {
        email,
        consent,
        consentAt: now.toISOString(),
        confirmedAt: null,
        status: 'pending' as const,
        unsubscribeToken: randomUUID(),
        retentionUntil: retentionDate(30, now),
      }

      if (subscriber) {
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data,
          overrideAccess: true,
        })
      } else {
        await payload.create({
          collection: 'newsletter-subscribers',
          data,
          overrideAccess: true,
        })
      }

      return formResponse(responseMessage, 202)
    },
  )
}
