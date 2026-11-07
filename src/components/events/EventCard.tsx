import Link from 'next/link'

import { formatParishTime, getParishDateParts } from '@/lib/dates'
import type { Event } from '@/payload-types'

import { communityForEvent } from './content'
import styles from './events.module.css'

export function EventCard({ event }: { event: Event }) {
  const date = getParishDateParts(event.startsAt)
  const month = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    timeZone: 'UTC',
  })
    .format(new Date(Date.UTC(date.year, date.month - 1, 1)))
    .replace('.', '')
  const community = communityForEvent(event)

  return (
    <article className={styles.eventCard}>
      <time className={styles.eventDate} dateTime={event.startsAt}>
        <strong>{String(date.day).padStart(2, '0')}</strong>
        <span>{month}</span>
        <small>{date.year}</small>
      </time>
      <div className={styles.eventCopy}>
        <h3>
          <Link href={`/eventos/${encodeURIComponent(event.slug)}`}>
            {event.title || 'Evento paroquial'}
          </Link>
        </h3>
        <p>
          {formatParishTime(event.startsAt)} · {community?.name || event.locationText || 'Local a confirmar'}
        </p>
        {event.summary && <p className={styles.eventSummary}>{event.summary}</p>}
      </div>
      <Link
        className={styles.eventArrow}
        href={`/eventos/${encodeURIComponent(event.slug)}`}
        aria-label={`Ver detalhes de ${event.title || 'evento paroquial'}`}
      >
        →
      </Link>
    </article>
  )
}
