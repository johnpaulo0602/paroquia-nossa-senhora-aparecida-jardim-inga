import { afterEach, describe, expect, it, vi } from 'vitest'

import { enforcePublishPermission, readPublicContent } from '@/access'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('acesso ao conteúdo', () => {
  it('esconde demonstrações do público em produção', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DEMO_CONTENT', 'false')

    const result = readPublicContent({ req: { user: null } } as never)

    expect(result).toEqual({
      and: [
        { _status: { equals: 'published' } },
        { origin: { not_equals: 'demonstration' } },
      ],
    })
  })

  it('permite demonstrações no desenvolvimento', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(readPublicContent({ req: { user: null } } as never)).toEqual({
      _status: { equals: 'published' },
    })
  })

  it('impede colaborador de publicar, mas permite operação local confiável', () => {
    expect(() =>
      enforcePublishPermission({
        data: { _status: 'published' },
        req: { user: { role: 'contributor' } },
      } as never),
    ).toThrow('Somente editores')

    expect(
      enforcePublishPermission({
        data: { _status: 'published', title: 'Teste' },
        req: { user: null },
      } as never),
    ).toMatchObject({ title: 'Teste' })
  })
})
