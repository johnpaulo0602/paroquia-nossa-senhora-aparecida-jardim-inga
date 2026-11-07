import { describe, expect, it } from 'vitest'

import { generateEventICS } from '@/lib/calendar'

describe('generateEventICS', () => {
  it('gera um evento com horários UTC, local e descrição escapada', () => {
    const ics = generateEventICS(
      {
        id: 1,
        slug: 'encontro-formacao',
        title: 'Encontro de formação',
        startsAt: '2026-11-15T12:00:00.000Z',
        endsAt: '2026-11-15T14:00:00.000Z',
        location: 'Matriz, Jardim Ingá',
        description: 'Formação; encontro\ncomunidade',
        url: 'https://example.com/eventos/encontro-formacao',
      },
      new Date('2026-11-01T12:00:00.000Z'),
    )

    expect(ics).toContain('DTSTART:20261115T120000Z')
    expect(ics).toContain('DTEND:20261115T140000Z')
    expect(ics).toContain('LOCATION:Matriz\\, Jardim Ingá')
    expect(ics).toContain('DESCRIPTION:Formação\\; encontro\\ncomunidade')
    expect(ics).toContain('UID:encontro-formacao@paroquia-jardim-inga')
    expect(ics.endsWith('\r\n')).toBe(true)
  })

  it('rejeita término anterior ou igual ao início', () => {
    expect(() =>
      generateEventICS({
        id: 1,
        title: 'Evento inválido',
        startsAt: '2026-11-15T12:00:00.000Z',
        endsAt: '2026-11-15T12:00:00.000Z',
      }),
    ).toThrow('término posterior')
  })
})
