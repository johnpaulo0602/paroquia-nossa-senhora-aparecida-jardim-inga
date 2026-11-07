export const parishTimeZone = 'America/Sao_Paulo'

export const formatParishDate = (
  value: Date | string,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' },
) =>
  new Intl.DateTimeFormat('pt-BR', { ...options, timeZone: parishTimeZone }).format(new Date(value))

export const formatParishTime = (value: Date | string) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: parishTimeZone,
  }).format(new Date(value))

export const getParishDateParts = (value: Date | string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: parishTimeZone,
  }).formatToParts(new Date(value))

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || ''

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    weekday: get('weekday').toLowerCase(),
  }
}

export const isValidTime = (value: unknown): value is string =>
  typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
