import { formatParishDate, getParishDateParts, parishTimeZone } from '@/lib/dates'
import type { Event } from '@/payload-types'

export const communityForEvent = (event: Event) =>
  event.community && typeof event.community === 'object' ? event.community : null

export const eventLocation = (event: Event) =>
  [event.locationText, communityForEvent(event)?.name].filter(Boolean).join(' · ') ||
  'Local a confirmar'

export const eventDateKey = (event: Event) => {
  const parts = getParishDateParts(event.startsAt)
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
}

export const monthLabel = (month: string) => {
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month}-01T12:00:00.000Z`))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const shiftMonth = (month: string, amount: number) => {
  const [year, monthNumber] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, monthNumber - 1 + amount, 1, 12))
  return date.toISOString().slice(0, 7)
}

export const currentMonth = (now = new Date()) => {
  const parts = getParishDateParts(now)
  return `${parts.year}-${String(parts.month).padStart(2, '0')}`
}

export const dateKeyInParish = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: parishTimeZone,
  }).format(date)
  return parts
}

export const fullEventDate = (value: string) =>
  formatParishDate(value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
