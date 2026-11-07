import { describe, expect, it } from 'vitest'

import { resolveCelebrationsForDate } from '@/lib/schedule'

const rules = [
  {
    id: 1,
    title: 'Santa Missa',
    celebrationType: 'mass' as const,
    community: { id: 10, name: 'Matriz' },
    weekday: 'sunday',
    time: '19:00',
    active: true,
  },
  {
    id: 2,
    title: 'Santa Missa',
    celebrationType: 'mass' as const,
    community: { id: 11, name: 'São Pedro e São Paulo' },
    weekday: 'sunday',
    time: '09:00',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    active: true,
  },
]

describe('resolveCelebrationsForDate', () => {
  it('ordena as regras recorrentes e respeita a validade', () => {
    expect(resolveCelebrationsForDate(rules, [], '2026-11-15').map((item) => item.time)).toEqual([
      '09:00',
      '19:00',
    ])
    expect(resolveCelebrationsForDate(rules, [], '2027-01-03').map((item) => item.id)).toEqual([
      '1',
    ])
  })

  it('aplica alteração, cancelamento e celebração extra', () => {
    const result = resolveCelebrationsForDate(
      rules,
      [
        {
          id: 20,
          title: 'Missa alterada',
          celebration: 1,
          community: 10,
          date: '2026-11-15',
          exceptionType: 'change',
          newTime: '20:00',
        },
        {
          id: 21,
          title: 'Missa cancelada',
          celebration: 2,
          community: 11,
          date: '2026-11-15',
          exceptionType: 'cancellation',
        },
        {
          id: 22,
          title: 'Adoração extraordinária',
          community: 10,
          date: '2026-11-15',
          exceptionType: 'extra',
          newTime: '18:00',
        },
      ],
      '2026-11-15',
    )

    expect(result.map((item) => item.time)).toEqual(['18:00', '20:00'])
    expect(result[0].title).toBe('Adoração extraordinária')
  })
})
