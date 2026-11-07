import Link from 'next/link'

import { formatParishTime } from '@/lib/dates'
import type { Event } from '@/payload-types'

import { eventDateKey, monthLabel } from './content'
import styles from './events.module.css'

const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function EventCalendar({ events, month }: { events: Event[]; month: string }) {
  const [year, monthNumber] = month.split('-').map(Number)
  const firstWeekday = new Date(`${month}-01T12:00:00.000Z`).getUTCDay()
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const eventsByDay = new Map<number, Event[]>()

  events.forEach((event) => {
    const day = Number(eventDateKey(event).slice(8))
    eventsByDay.set(day, [...(eventsByDay.get(day) || []), event])
  })

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ]
  while (cells.length % 7) cells.push(null)

  return (
    <div className={styles.calendarScroll} tabIndex={0} role="region" aria-label={`Calendário de ${monthLabel(month)}`}>
      <table className={styles.calendar}>
        <caption>{monthLabel(month)}</caption>
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th key={weekday} scope="col" abbr={weekday}>
                {weekday.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((day, index) => (
                <td key={`${week}-${index}`} className={day ? undefined : styles.blankDay}>
                  {day && (
                    <>
                      <span className={styles.dayNumber}>{day}</span>
                      {(eventsByDay.get(day) || []).map((event) => (
                        <Link key={event.id} href={`/eventos/${encodeURIComponent(event.slug)}`}>
                          <small>{formatParishTime(event.startsAt)}</small>
                          {event.title || 'Evento paroquial'}
                        </Link>
                      ))}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
