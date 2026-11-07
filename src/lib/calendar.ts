type CalendarEvent = {
  id: number | string
  slug?: string | null
  title: string
  startsAt: Date | string
  endsAt: Date | string
  location?: string | null
  description?: string | null
  url?: string | null
}

const escapeICS = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')

const formatUTC = (value: Date | string) =>
  new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const foldLine = (line: string) => {
  const chunks: string[] = []
  let current = ''

  for (const character of line) {
    if (Buffer.byteLength(current + character, 'utf8') > 73) {
      chunks.push(current)
      current = ` ${character}`
    } else {
      current += character
    }
  }

  if (current) chunks.push(current)
  return chunks.join('\r\n')
}

export const generateEventICS = (event: CalendarEvent, now = new Date()) => {
  const startsAt = new Date(event.startsAt)
  const endsAt = new Date(event.endsAt)

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
    throw new Error('O evento precisa de datas válidas e término posterior ao início.')
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Paroquia Nossa Senhora Aparecida//Agenda//PT-BR',
    'BEGIN:VEVENT',
    `UID:${escapeICS(String(event.slug || event.id))}@paroquia-jardim-inga`,
    `DTSTAMP:${formatUTC(now)}`,
    `DTSTART:${formatUTC(startsAt)}`,
    `DTEND:${formatUTC(endsAt)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location || '')}`,
    `DESCRIPTION:${escapeICS(event.description || '')}`,
  ]

  if (event.url) lines.push(`URL:${escapeICS(event.url)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')

  return `${lines.map(foldLine).join('\r\n')}\r\n`
}
