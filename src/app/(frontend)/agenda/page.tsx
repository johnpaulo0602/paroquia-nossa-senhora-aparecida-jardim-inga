import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'

import { EventCalendar } from '@/components/events/EventCalendar'
import { EventCard } from '@/components/events/EventCard'
import { currentMonth, monthLabel, shiftMonth } from '@/components/events/content'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { activeDuring, getCMS } from '@/lib/payload'

import styles from '@/components/events/events.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agenda paroquial',
  description: 'Próximos encontros, eventos e arquivo da agenda da Paróquia Nossa Senhora Aparecida.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function AgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const now = new Date()
  const requestedMonth = first(query.mes)
  const month = requestedMonth && /^\d{4}-(?:0[1-9]|1[0-2])$/.test(requestedMonth) ? requestedMonth : currentMonth(now)
  const requestedPeriod = first(query.periodo)
  const period = requestedPeriod === 'proximos' || requestedPeriod === 'arquivo' ? requestedPeriod : 'mes'
  const community = first(query.comunidade) || ''
  const requestedView = first(query.visualizacao)
  const view = period === 'mes' && requestedView === 'calendario' ? 'calendario' : 'lista'
  const requestedPage = Number(first(query.pagina))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const payload = await getCMS()
  const active = activeDuring(now)
  const conditions: Where[] = []
  if (community) conditions.push({ 'community.slug': { equals: community } })
  if (period === 'proximos') {
    conditions.push({ startsAt: { greater_than_equal: now.toISOString() } }, { archived: { not_equals: true } })
  } else if (period === 'arquivo') {
    conditions.push({ startsAt: { less_than: now.toISOString() } })
  } else {
    conditions.push(
      { startsAt: { greater_than_equal: `${month}-01T00:00:00.000-03:00` } },
      { startsAt: { less_than: `${shiftMonth(month, 1)}-01T00:00:00.000-03:00` } },
    )
  }

  const [communities, events, notices] = await Promise.all([
    payload.find({
      collection: 'communities',
      where: { active: { not_equals: false } },
      sort: 'order',
      limit: 100,
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'events',
      where: { and: conditions },
      sort: period === 'arquivo' ? '-startsAt' : 'startsAt',
      limit: period === 'mes' ? 500 : 30,
      page: period === 'mes' ? 1 : page,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'notices',
      where: { and: [{ contexts: { contains: 'agenda' } }, ...active.and] },
      sort: 'order',
      limit: 5,
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
  ])

  const hrefFor = (changes: Record<string, string | number | null>) => {
    const state: Record<string, string | number | null> = {
      mes: period === 'mes' ? month : null,
      comunidade: community || null,
      visualizacao: period === 'mes' ? view : null,
      periodo: period === 'mes' ? null : period,
      pagina: period !== 'mes' && page > 1 ? page : null,
      ...changes,
    }
    const params = new URLSearchParams()
    Object.entries(state).forEach(([key, value]) => {
      if (value !== null && value !== '') params.set(key, String(value))
    })
    const serialized = params.toString()
    return serialized ? `/agenda?${serialized}` : '/agenda'
  }

  return (
    <div className="page">
      <div className="container">
        <PageHeader eyebrow="Encontros e participação" title="Agenda paroquial" intro="Programação por data e comunidade." />

        {notices.docs.length > 0 && (
          <div className={styles.notices}>
            {notices.docs.map((notice) => (
              <aside className="notice" key={notice.id}>
                {notice.title && <p className={styles.noticeTitle}>{notice.title}</p>}
                {notice.body && <RichText content={notice.body} />}
              </aside>
            ))}
          </div>
        )}

        <nav className={styles.archiveNav} aria-label="Períodos da agenda">
          <Link href={hrefFor({ periodo: null, pagina: null, mes: currentMonth(now) })} aria-current={period === 'mes' ? 'page' : undefined}>
            Calendário mensal
          </Link>
          <Link href={hrefFor({ periodo: 'proximos', pagina: null, mes: null, visualizacao: null })} aria-current={period === 'proximos' ? 'page' : undefined}>
            Próximos eventos
          </Link>
          <Link href={hrefFor({ periodo: 'arquivo', pagina: null, mes: null, visualizacao: null })} aria-current={period === 'arquivo' ? 'page' : undefined}>
            Arquivo
          </Link>
        </nav>

        <div className={styles.toolbar}>
          <form className={styles.filterForm} action="/agenda" method="get">
            {period === 'mes' ? <input type="hidden" name="mes" value={month} /> : <input type="hidden" name="periodo" value={period} />}
            {period === 'mes' && <input type="hidden" name="visualizacao" value={view} />}
            <div>
              <label htmlFor="event-community">Comunidade</label>
              <select id="event-community" name="comunidade" defaultValue={community}>
                <option value="">Todas as comunidades</option>
                {communities.docs.map((item) => (
                  <option key={item.id} value={item.slug}>{item.name}</option>
                ))}
              </select>
            </div>
            <button className="button button-secondary" type="submit">Filtrar</button>
          </form>

          {period === 'mes' && (
            <nav className={styles.viewSwitch} aria-label="Visualização da agenda">
              <Link href={hrefFor({ visualizacao: 'lista' })} aria-current={view === 'lista' ? 'page' : undefined}>Lista</Link>
              <Link href={hrefFor({ visualizacao: 'calendario' })} aria-current={view === 'calendario' ? 'page' : undefined}>Calendário</Link>
            </nav>
          )}
        </div>

        {period === 'mes' && (
          <nav className={styles.monthNavigation} aria-label="Navegar entre meses">
            <Link className="button button-secondary" href={hrefFor({ mes: shiftMonth(month, -1), pagina: null })} aria-label="Mês anterior">←</Link>
            <h2>{monthLabel(month)}</h2>
            <Link className="button button-secondary" href={hrefFor({ mes: shiftMonth(month, 1), pagina: null })} aria-label="Próximo mês">→</Link>
          </nav>
        )}

        {period !== 'mes' && (
          <h2>{period === 'proximos' ? 'Próximos eventos' : 'Eventos anteriores'}</h2>
        )}

        {events.docs.length > 0 ? (
          view === 'calendario' && period === 'mes' ? (
            <EventCalendar events={events.docs} month={month} />
          ) : (
            <div className={styles.eventList}>
              {events.docs.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )
        ) : (
          <div className={styles.empty}>
            <h3>Nenhum evento encontrado</h3>
            <p>Escolha outra comunidade ou período para continuar consultando a agenda.</p>
          </div>
        )}

        {period !== 'mes' && events.totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Paginação da agenda">
            {events.hasPrevPage ? <Link className="button button-secondary" href={hrefFor({ pagina: page - 1 })}>← Página anterior</Link> : <span />}
            <span>Página {events.page} de {events.totalPages}</span>
            {events.hasNextPage ? <Link className="button button-secondary" href={hrefFor({ pagina: page + 1 })}>Próxima página →</Link> : <span />}
          </nav>
        )}
      </div>
    </div>
  )
}
