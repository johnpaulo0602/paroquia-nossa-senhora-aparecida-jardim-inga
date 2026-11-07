import type { Celebration, Media, Person } from '@/payload-types'

export const weekdayLabels: Record<Celebration['weekday'], string> = {
  sunday: 'Domingo',
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
}

const weekdayOrder: Celebration['weekday'][] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export function asMedia(value: number | Media | null | undefined): Media | null {
  return typeof value === 'object' && value !== null ? value : null
}

export function asPerson(value: number | Person | null | undefined): Person | null {
  return typeof value === 'object' && value !== null ? value : null
}

export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export function emailHref(value: string): string {
  return `mailto:${value.trim()}`
}

export function phoneHref(value: string): string {
  return `tel:${value.replace(/(?!^\+)[^\d]/g, '')}`
}

export function whatsappHref(value: string, message?: string): string | null {
  let digits = value.replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`

  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${query}`
}

export function formatTime(value: string): string {
  const [hours, minutes] = value.split(':')
  if (!hours || !minutes) return value
  return `${Number(hours)}h${minutes === '00' ? '' : minutes}`
}

export function sortCelebrations(items: Celebration[]): Celebration[] {
  return [...items].sort((a, b) => {
    const dayDifference = weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday)
    return dayDifference || a.time.localeCompare(b.time) || a.title.localeCompare(b.title, 'pt-BR')
  })
}
