import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

const emails = {
  contributor: 'colaborador.teste@example.com',
  editor: 'editor.teste@example.com',
}

const richText = {
  root: {
    children: [
      {
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Conteúdo de teste', type: 'text', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'root',
    version: 1,
  },
}

let payload: Payload
let postID: number

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  await payload.delete({
    collection: 'users',
    where: { email: { in: Object.values(emails) } },
  })
  await payload.delete({
    collection: 'posts',
    where: { slug: { equals: 'teste-permissao-editorial' } },
  })
})

afterAll(async () => {
  await payload.delete({
    collection: 'posts',
    where: { slug: { equals: 'teste-permissao-editorial' } },
  })
  await payload.delete({
    collection: 'users',
    where: { email: { in: Object.values(emails) } },
  })
})

describe('fluxo editorial e privacidade', () => {
  it('permite rascunho do colaborador, restringe publicação ao editor e protege atendimento', async () => {
    const contributor = await payload.create({
      collection: 'users',
      data: { email: emails.contributor, password: 'teste-seguro', role: 'contributor' },
    })
    const editor = await payload.create({
      collection: 'users',
      data: { email: emails.editor, password: 'teste-seguro', role: 'editor' },
    })

    const post = await payload.create({
      collection: 'posts',
      user: contributor,
      overrideAccess: false,
      draft: true,
      data: {
        title: 'Teste permissão editorial',
        slug: 'teste-permissao-editorial',
        summary: 'Resumo de teste',
        body: richText,
        format: 'article',
        editorialAreas: ['communication'],
        category: 'general',
        origin: 'official',
        verification: 'approved',
        _status: 'draft',
      },
    })
    postID = post.id

    await expect(
      payload.update({
        collection: 'posts',
        id: postID,
        user: contributor,
        overrideAccess: false,
        data: { _status: 'published' },
      }),
    ).rejects.toThrow('Somente editores')

    const anonymousDraft = await payload.find({
      collection: 'posts',
      where: { slug: { equals: 'teste-permissao-editorial' } },
      overrideAccess: false,
      draft: false,
    })
    expect(anonymousDraft.totalDocs).toBe(0)

    await payload.update({
      collection: 'posts',
      id: postID,
      user: editor,
      overrideAccess: false,
      data: { _status: 'published' },
    })

    const anonymousPublished = await payload.find({
      collection: 'posts',
      where: { slug: { equals: 'teste-permissao-editorial' } },
      overrideAccess: false,
      draft: false,
    })
    expect(anonymousPublished.totalDocs).toBe(1)

    await expect(
      payload.create({
        collection: 'contact-messages',
        overrideAccess: false,
        data: {
          name: 'Anônimo',
          email: 'anonimo@example.com',
          subject: 'other',
          relation: 'visitor',
          message: 'Não deve ser criado',
          status: 'new',
          consent: true,
        },
      }),
    ).rejects.toThrow()
  }, 30000)
})
