import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { POST as postContato } from '@/app/(frontend)/api/contato/route'
import { POST as postDizimo } from '@/app/(frontend)/api/dizimo/route'
import { POST as postCancelar } from '@/app/(frontend)/api/newsletter/cancelar/route'
import { GET as getConfirmar } from '@/app/(frontend)/api/newsletter/confirmar/route'
import { POST as postNewsletter } from '@/app/(frontend)/api/newsletter/route'
import { POST as postSacramentos } from '@/app/(frontend)/api/sacramentos/route'
import { getCMS } from '@/lib/payload'

const TEST_EMAIL = 'teste-endpoints@paroquia.local'

function jsonRequest(
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): Request {
  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

async function cleanupTestRecords() {
  const payload = await getCMS()
  await payload.delete({
    collection: 'contact-messages',
    where: { email: { equals: TEST_EMAIL } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'sacrament-requests',
    where: { email: { equals: TEST_EMAIL } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'tithe-interests',
    where: { email: { equals: TEST_EMAIL } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'newsletter-subscribers',
    where: { email: { equals: TEST_EMAIL } },
    overrideAccess: true,
  })
}

describe('endpoints públicos de atendimento', () => {
  beforeAll(async () => {
    await cleanupTestRecords()
  })

  afterAll(async () => {
    delete process.env.CONTACT_FORM_ENABLED
    delete process.env.SACRAMENT_FORM_ENABLED
    delete process.env.TITHE_FORM_ENABLED
    delete process.env.NEWSLETTER_ENABLED
    await cleanupTestRecords()
  })

  it('retorna 503 por padrão quando os canais estão desativados', async () => {
    delete process.env.CONTACT_FORM_ENABLED
    delete process.env.SACRAMENT_FORM_ENABLED
    delete process.env.TITHE_FORM_ENABLED
    delete process.env.NEWSLETTER_ENABLED

    const resContato = await postContato(
      jsonRequest('http://localhost:3000/api/contato', {
        name: 'Maria',
        email: TEST_EMAIL,
        subject: 'other',
        relation: 'visitor',
        message: 'Olá',
        consent: true,
      }),
    )
    expect(resContato.status).toBe(503)

    const resSacramentos = await postSacramentos(
      jsonRequest('http://localhost:3000/api/sacramentos', {
        requestType: 'baptism',
        applicantName: 'Maria',
        phone: '(61) 99999-0000',
        email: TEST_EMAIL,
        consent: true,
      }),
    )
    expect(resSacramentos.status).toBe(503)

    const resDizimo = await postDizimo(
      jsonRequest('http://localhost:3000/api/dizimo', {
        name: 'Maria',
        email: TEST_EMAIL,
        consent: true,
      }),
    )
    expect(resDizimo.status).toBe(503)

    const resNewsletter = await postNewsletter(
      jsonRequest('http://localhost:3000/api/newsletter', {
        email: TEST_EMAIL,
        consent: true,
      }),
    )
    expect(resNewsletter.status).toBe(503)
  })

  it('valida origem, honeypot, consentimento e persistência quando habilitado', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
    process.env.CONTACT_FORM_ENABLED = 'true'
    process.env.SACRAMENT_FORM_ENABLED = 'true'
    process.env.TITHE_FORM_ENABLED = 'true'
    process.env.NEWSLETTER_ENABLED = 'true'

    const badOrigin = await postContato(
      jsonRequest(
        'http://localhost:3000/api/contato',
        {
          name: 'Maria',
          email: TEST_EMAIL,
          subject: 'other',
          relation: 'visitor',
          message: 'Olá',
          consent: true,
        },
        { origin: 'https://malicioso.example.com', 'x-forwarded-for': '10.0.0.1' },
      ),
    )
    expect(badOrigin.status).toBe(403)

    const honeypot = await postContato(
      jsonRequest(
        'http://localhost:3000/api/contato',
        {
          name: 'Bot',
          email: TEST_EMAIL,
          subject: 'other',
          relation: 'visitor',
          message: 'Spam',
          consent: true,
          website: 'https://spam.example',
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.2' },
      ),
    )
    expect(honeypot.status).toBe(200)

    const payload = await getCMS()
    const afterHoneypot = await payload.find({
      collection: 'contact-messages',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    })
    expect(afterHoneypot.totalDocs).toBe(0)

    const noConsent = await postContato(
      jsonRequest(
        'http://localhost:3000/api/contato',
        {
          name: 'Maria',
          email: TEST_EMAIL,
          subject: 'other',
          relation: 'visitor',
          message: 'Mensagem sem consentimento',
          consent: false,
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.3' },
      ),
    )
    expect(noConsent.status).toBe(400)

    const okContato = await postContato(
      jsonRequest(
        'http://localhost:3000/api/contato',
        {
          name: 'Maria Aparecida',
          email: TEST_EMAIL,
          subject: 'sacraments',
          relation: 'parishioner',
          message: 'Gostaria de informações sobre batismo.',
          consent: true,
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.4' },
      ),
    )
    expect(okContato.status).toBe(201)

    const okSacramentos = await postSacramentos(
      jsonRequest(
        'http://localhost:3000/api/sacramentos',
        {
          requestType: 'baptism',
          applicantName: 'Maria Aparecida',
          phone: '(61) 99999-1234',
          email: TEST_EMAIL,
          preferredDate: '2026-12-15',
          notes: 'Preferência pelo domingo pela manhã.',
          payload: {
            childName: 'João Pedro',
            parentName: 'Maria Aparecida',
            birthDate: '2026-05-10',
          },
          consent: true,
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.5' },
      ),
    )
    expect(okSacramentos.status).toBe(201)

    const okDizimo = await postDizimo(
      jsonRequest(
        'http://localhost:3000/api/dizimo',
        {
          name: 'Maria Aparecida',
          email: TEST_EMAIL,
          consent: true,
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.6' },
      ),
    )
    expect(okDizimo.status).toBe(201)

    const okNewsletter = await postNewsletter(
      jsonRequest(
        'http://localhost:3000/api/newsletter',
        {
          email: TEST_EMAIL,
          consent: true,
        },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.7' },
      ),
    )
    expect(okNewsletter.status).toBe(202)

    const subscribers = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    })
    expect(subscribers.totalDocs).toBe(1)
    expect(subscribers.docs[0]?.status).toBe('pending')
    const token = subscribers.docs[0]?.unsubscribeToken
    expect(token).toBeTruthy()

    const confirmRes = await getConfirmar(
      new Request(`http://localhost:3000/api/newsletter/confirmar?token=${token}`, {
        headers: { 'x-forwarded-for': '10.0.0.8' },
      }),
    )
    expect(confirmRes.status).toBe(200)

    const confirmedSub = await payload.findByID({
      collection: 'newsletter-subscribers',
      id: subscribers.docs[0].id,
      overrideAccess: true,
    })
    expect(confirmedSub.status).toBe('confirmed')

    const cancelRes = await postCancelar(
      jsonRequest(
        'http://localhost:3000/api/newsletter/cancelar',
        { token },
        { origin: 'http://localhost:3000', 'x-forwarded-for': '10.0.0.9' },
      ),
    )
    expect(cancelRes.status).toBe(200)

    const cancelledSub = await payload.findByID({
      collection: 'newsletter-subscribers',
      id: subscribers.docs[0].id,
      overrideAccess: true,
    })
    expect(cancelledSub.status).toBe('unsubscribed')
  }, 30000)

  it('aplica limite de tentativas por IP (rate limiting)', async () => {
    process.env.TITHE_FORM_ENABLED = 'true'
    const ip = '10.99.99.99'

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const res = await postDizimo(
        jsonRequest(
          'http://localhost:3000/api/dizimo',
          { name: 'A', email: 'invalido', consent: false },
          { 'x-forwarded-for': ip },
        ),
      )
      expect(res.status).toBe(400)
    }

    const sixth = await postDizimo(
      jsonRequest(
        'http://localhost:3000/api/dizimo',
        { name: 'A', email: 'invalido', consent: false },
        { 'x-forwarded-for': ip },
      ),
    )
    expect(sixth.status).toBe(429)
  })
})
