import { describe, expect, it } from 'vitest'

import { formatParishDate, formatParishTime, getParishDateParts, isValidTime } from '@/lib/dates'

describe('datas da paróquia', () => {
  it('apresenta instantes no fuso de São Paulo', () => {
    const value = '2026-11-15T12:00:00.000Z'

    expect(formatParishTime(value)).toBe('09:00')
    expect(formatParishDate(value, { year: 'numeric', month: '2-digit', day: '2-digit' })).toBe(
      '15/11/2026',
    )
    expect(getParishDateParts(value)).toMatchObject({
      year: 2026,
      month: 11,
      day: 15,
      hour: 9,
      minute: 0,
      weekday: 'sun',
    })
  })

  it('valida somente horários de 24 horas', () => {
    expect(isValidTime('19:30')).toBe(true)
    expect(isValidTime('24:00')).toBe(false)
    expect(isValidTime('19h30')).toBe(false)
  })
})
