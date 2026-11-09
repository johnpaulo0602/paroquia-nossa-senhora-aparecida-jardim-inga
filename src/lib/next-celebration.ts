import type { Payload } from 'payload'

import { getParishDateParts } from './dates'
import { resolveCelebrationsForDate } from './schedule'

export type NextCelebration = {
  date: string
  time: string
  title: string
  communityName: string | null
  /** 'today' | 'tomorrow' | weekday name in Portuguese */
  relativeDay: string
}

const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const dateAtNoon = (value: string) => new Date(`${value}T12:00:00.000Z`)
const dateKey = (date: Date) => date.toISOString().slice(0, 10)

/**
 * The next public celebration from now (parish time zone), looking a week ahead.
 * Uses the same resolver as /horarios, so weekly rules and exceptions agree.
 */
export async function getNextCelebration(
  payload: Payload,
  now = new Date(),
): Promise<NextCelebration | null> {
  const parts = getParishDateParts(now)
  const pad = (value: number) => String(value).padStart(2, '0')
  const today = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
  const nowTime = `${pad(parts.hour)}:${pad(parts.minute)}`
  const dates = Array.from({ length: 8 }, (_, index) => {
    const date = dateAtNoon(today)
    date.setUTCDate(date.getUTCDate() + index)
    return dateKey(date)
  })

  const [rules, exceptions] = await Promise.all([
    payload.find({
      collection: 'celebrations',
      where: {
        and: [
          { active: { not_equals: false } },
          { or: [{ validTo: { greater_than_equal: today } }, { validTo: { exists: false } }] },
        ],
      },
      sort: 'time',
      limit: 500,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'celebration-exceptions',
      where: {
        and: [{ date: { greater_than_equal: today } }, { date: { less_than_equal: dates.at(-1) } }],
      },
      limit: 200,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
  ])

  const ruleList = rules.docs.map((rule) => ({
    ...rule,
    celebrationType: rule.celebrationType || 'other',
  }))
  const exceptionList = exceptions.docs.flatMap((exception) =>
    exception.exceptionType ? [{ ...exception, exceptionType: exception.exceptionType }] : [],
  )

  for (const date of dates) {
    const next = resolveCelebrationsForDate(ruleList, exceptionList, date).find(
      (item) => date > today || item.time > nowTime,
    )
    if (!next) continue

    const community = typeof next.community === 'object' ? next.community.name : null
    return {
      date,
      time: next.time,
      title: next.title,
      communityName: community ?? null,
      relativeDay:
        date === dates[0]
          ? 'Hoje'
          : date === dates[1]
            ? 'Amanhã'
            : weekdayNames[dateAtNoon(date).getUTCDay()],
    }
  }

  return null
}
