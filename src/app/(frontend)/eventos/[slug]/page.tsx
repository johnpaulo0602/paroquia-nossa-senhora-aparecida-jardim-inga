import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { communityForEvent, eventLocation, fullEventDate } from '@/components/events/content'
import { MediaImage } from '@/components/site/MediaImage'
import { RichText } from '@/components/site/RichText'
import { formatParishTime } from '@/lib/dates'
import { getCMS } from '@/lib/payload'
import type { Event } from '@/payload-types'

import styles from '@/components/events/events.module.css'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

const getEvent = cache(async (slug: string): Promise<Event | null> => {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: false,
    overrideAccess: false,
  })
  return result.docs[0] || null
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEvent((await params).slug)
  if (!event) return { title: 'Evento não encontrado' }
  return {
    title: event.title || 'Evento paroquial',
    description: event.summary || `Detalhes do evento em ${fullEventDate(event.startsAt)}.`,
  }
}

export default async function EventPage({ params }: PageProps) {
  const event = await getEvent((await params).slug)
  if (!event) notFound()

  const title = event.title || 'Evento paroquial'
  const community = communityForEvent(event)
  const cover = event.cover && typeof event.cover === 'object' ? event.cover : null
  const ended = new Date(event.endsAt) < new Date()
  let registrationUrl: string | null = null
  if (event.registrationUrl) {
    try {
      const url = new URL(event.registrationUrl)
      if (url.protocol === 'https:' || url.protocol === 'http:') registrationUrl = url.toString()
    } catch {
      registrationUrl = null
    }
  }

  return (
    <div className="page">
      <div className="container">
        <Link className={styles.backLink} href="/agenda">← Agenda paroquial</Link>
        <header className={styles.detailHeader}>
          <span className="eyebrow">Agenda paroquial</span>
          <h1>{title}</h1>
          {event.summary && <p>{event.summary}</p>}
        </header>

        {ended && <p className="notice">Este evento já aconteceu. As informações permanecem disponíveis no arquivo.</p>}

        {cover && (
          <figure className={styles.detailCover}>
            <MediaImage image={cover} alt={cover.alt || title} sizes="(max-width: 1200px) 100vw, 1200px" />
            {(cover.caption || cover.credit) && <figcaption>{[cover.caption, cover.credit].filter(Boolean).join(' · ')}</figcaption>}
          </figure>
        )}

        <div className={styles.detailGrid}>
          <aside className={styles.facts} aria-label="Informações do evento">
            <dl>
              <div><dt>Data</dt><dd>{fullEventDate(event.startsAt)}</dd></div>
              <div><dt>Horário</dt><dd>{formatParishTime(event.startsAt)} às {formatParishTime(event.endsAt)}</dd></div>
              {community && <div><dt>Comunidade</dt><dd>{community.name}</dd></div>}
              <div><dt>Local</dt><dd>{eventLocation(event)}</dd></div>
            </dl>
            <div className={styles.eventActions}>
              <a className="button" href={`/eventos/${encodeURIComponent(event.slug)}/ics`}>Adicionar ao calendário</a>
              {registrationUrl && <a className="button button-secondary" href={registrationUrl} target="_blank" rel="noopener noreferrer">Acessar inscrição ↗</a>}
            </div>
            <p className={styles.factsHelp}>O arquivo usa o horário de Brasília e pode ser aberto em aplicativos de calendário compatíveis.</p>
          </aside>

          <div>
            {event.body && (
              <section className={styles.detailBody} aria-labelledby="event-details-title">
                <h2 id="event-details-title">Sobre o evento</h2>
                <RichText content={event.body} />
              </section>
            )}
            <section className={styles.participation} aria-labelledby="participation-title">
              <h2 id="participation-title">Informações para participar</h2>
              {event.participationInfo ? <RichText content={event.participationInfo} /> : <p>Consulte a secretaria para confirmar as orientações de participação.</p>}
              <p><Link href="/contato">Fale com a secretaria →</Link></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
