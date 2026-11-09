import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'

import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { formatParishDate, getParishDateParts } from '@/lib/dates'
import { activeDuring, getCMS } from '@/lib/payload'
import { resolveCelebrationsForDate } from '@/lib/schedule'

import styles from '@/components/schedule/schedule.module.css'
import { Icon } from '@/components/site/Icon'
import { OriginBadge } from '@/components/site/OriginBadge'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Missas e celebrações',
  description: 'Horários de missas, confissões, adoração e celebrações nas comunidades da paróquia.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>
type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

const weekdays: { value: Weekday; label: string }[] = [
  { value: 'sunday', label: 'Domingo' },
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
]

const weekdayShort: Record<Weekday, string> = {
  sunday: 'Dom',
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
}

const weekdayLabels = Object.fromEntries(weekdays.map((day) => [day.value, day.label])) as Record<Weekday, string>
const celebrationLabels = { mass: 'Santa Missa', confession: 'Confissão', adoration: 'Adoração', other: 'Celebração' }
const exceptionLabels = { cancellation: 'Cancelamento', change: 'Horário alterado', extra: 'Celebração extra' }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const dateKey = (date: Date) => date.toISOString().slice(0, 10)
const dateAtNoon = (value: string) => new Date(`${value}T12:00:00.000Z`)
const relationName = (relation: number | string | { name?: string | null }) =>
  typeof relation === 'object' ? relation.name : null

export default async function SchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const community = first(query.comunidade) || ''
  const requestedDay = first(query.dia)
  const day = weekdays.some((item) => item.value === requestedDay) ? (requestedDay as Weekday) : ''
  // The list shows two weeks by default; ?periodo=6 extends it to the six-week horizon.
  const extended = first(query.periodo) === '6'
  const now = new Date()
  const parts = getParishDateParts(now)
  const today = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
  const lastDate = dateAtNoon(today)
  lastDate.setUTCDate(lastDate.getUTCDate() + 42)
  const horizon = dateKey(lastDate)

  const payload = await getCMS()
  const active = activeDuring(now)
  const ruleConditions: Where[] = [
    { active: { not_equals: false } },
    { or: [{ validTo: { greater_than_equal: today } }, { validTo: { exists: false } }] },
  ]
  const exceptionConditions: Where[] = [
    { date: { greater_than_equal: today } },
    { date: { less_than_equal: horizon } },
  ]
  if (community) {
    ruleConditions.push({ 'community.slug': { equals: community } })
    exceptionConditions.push({ 'community.slug': { equals: community } })
  }
  if (day) ruleConditions.push({ weekday: { equals: day } })

  const [communities, celebrationRules, exceptionsResult, settings, notices] = await Promise.all([
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
      collection: 'celebrations',
      where: { and: ruleConditions },
      sort: 'time',
      limit: 500,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'celebration-exceptions',
      where: { and: exceptionConditions },
      sort: 'date',
      limit: 200,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, draft: false, overrideAccess: false }),
    payload.find({
      collection: 'notices',
      where: { and: [{ contexts: { contains: 'schedules' } }, ...active.and] },
      sort: 'order',
      limit: 5,
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
  ])

  const rules = celebrationRules.docs.map((rule) => ({
    ...rule,
    celebrationType: rule.celebrationType || 'other',
  }))
  const exceptions = exceptionsResult.docs.flatMap((exception) =>
    exception.exceptionType ? [{ ...exception, exceptionType: exception.exceptionType }] : [],
  )
  const dates = Array.from({ length: 43 }, (_, index) => {
    const date = dateAtNoon(today)
    date.setUTCDate(date.getUTCDate() + index)
    return dateKey(date)
  })
  const occurrences = dates
    .flatMap((date) => resolveCelebrationsForDate(rules, exceptions, date).map((item) => ({ ...item, date })))
    .filter((item) => !day || weekdays[dateAtNoon(item.date).getUTCDay()].value === day)
  const nowTime = `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`
  const next = occurrences.find((item) => item.date > today || item.time > nowTime)
  const tomorrow = dates[1]
  const relativeDay = (date: string) =>
    date === today ? 'Hoje' : date === tomorrow ? 'Amanhã' : weekdayLabels[weekdays[dateAtNoon(date).getUTCDay()].value]
  const listUntil = dates[extended ? 42 : 13]
  const grouped = occurrences
    .filter((item) => item.date <= listUntil && (item.date > today || item.time > nowTime))
    .reduce<{ date: string; items: typeof occurrences }[]>((groups, item) => {
      const last = groups.at(-1)
      if (last?.date === item.date) last.items.push(item)
      else groups.push({ date: item.date, items: [item] })
      return groups
    }, [])
  const filterHref = (changes: { comunidade?: string; dia?: string }) => {
    const params = new URLSearchParams()
    const nextCommunity = changes.comunidade ?? community
    const nextDay = changes.dia ?? day
    if (nextCommunity) params.set('comunidade', nextCommunity)
    if (nextDay) params.set('dia', nextDay)
    if (extended) params.set('periodo', '6')
    const search = params.toString()
    return search ? `/horarios?${search}` : '/horarios'
  }
  const periodHref = (() => {
    const params = new URLSearchParams()
    if (community) params.set('comunidade', community)
    if (day) params.set('dia', day)
    if (!extended) params.set('periodo', '6')
    const search = params.toString()
    return `/horarios${search ? `?${search}` : ''}#upcoming-title`
  })()
  const visibleExceptions = exceptions.filter(
    (exception) => !day || weekdays[dateAtNoon(exception.date.slice(0, 10)).getUTCDay()].value === day,
  )
  const whatsapp = settings.whatsapp?.replace(/\D/g, '')
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de confirmar os horários de confissão e adoração.')

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Encontre sua celebração"
          title="Missas e horários"
          intro="Horários da matriz e das comunidades, no horário de Brasília."
        />

        {next ? (
          <section aria-labelledby="next-title" className={styles.nextCard}>
            <div>
              <p className={styles.nextLabel} id="next-title">
                Próxima celebração · {relativeDay(next.date)}
                {next.date !== today &&
                  `, ${formatParishDate(dateAtNoon(next.date), { day: 'numeric', month: 'long' })}`}
              </p>
              <p className={styles.nextTitle}>
                {next.title} · {relationName(next.community) || 'Comunidade'}
              </p>
            </div>
            <time className={styles.nextTime} dateTime={`${next.date}T${next.time}:00-03:00`}>
              {next.time.replace(':', 'h')}
            </time>
          </section>
        ) : null}

        <nav aria-label="Filtrar horários" className={styles.filters}>
          <div>
            <p className={styles.filterLabel} id="filter-community">
              Onde
            </p>
            <ul aria-labelledby="filter-community" className="chips">
              <li>
                <Link aria-current={!community ? 'true' : undefined} href={filterHref({ comunidade: '' })}>
                  Todas
                </Link>
              </li>
              {communities.docs.map((item) => (
                <li key={item.id}>
                  <Link
                    aria-current={community === item.slug ? 'true' : undefined}
                    href={filterHref({ comunidade: item.slug || '' })}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={styles.filterLabel} id="filter-day">
              Quando
            </p>
            <ul aria-labelledby="filter-day" className="chips">
              <li>
                <Link aria-current={!day ? 'true' : undefined} href={filterHref({ dia: '' })}>
                  Todos os dias
                </Link>
              </li>
              {weekdays.map((item) => (
                <li key={item.value}>
                  <Link
                    aria-current={day === item.value ? 'true' : undefined}
                    aria-label={item.label}
                    href={filterHref({ dia: item.value })}
                  >
                    {weekdayShort[item.value]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

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

        <section className={styles.section} aria-labelledby="upcoming-title">
          <div className={styles.sectionHeading}>
            <h2 id="upcoming-title">Próximas celebrações</h2>
            <p>{extended ? 'Próximas 6 semanas' : 'Próximas 2 semanas'}</p>
          </div>
          {grouped.length ? (
            <div className={styles.dayGroups}>
              {grouped.map((group) => (
                <section aria-labelledby={`dia-${group.date}`} className={styles.dayGroup} key={group.date}>
                  <h3 className={styles.dayHeading} id={`dia-${group.date}`}>
                    {relativeDay(group.date)}
                    <span>
                      {formatParishDate(dateAtNoon(group.date), { day: 'numeric', month: 'long' })}
                    </span>
                  </h3>
                  <ul className={styles.occurrenceList}>
                    {group.items.map((item) => {
                      const exceptionType = item.exception?.exceptionType
                      return (
                        <li className={styles.occurrence} key={`${item.id}-${item.date}`}>
                          <time className={styles.time} dateTime={`${item.date}T${item.time}:00-03:00`}>
                            {item.time.replace(':', 'h')}
                          </time>
                          <div className={styles.occurrenceBody}>
                            <strong>{item.title}</strong>
                            <span>
                              {item.title === celebrationLabels[item.celebrationType]
                                ? ''
                                : `${celebrationLabels[item.celebrationType]} · `}
                              {relationName(item.community) || 'Comunidade'}
                            </span>
                            {(exceptionType || item.origin) && (
                              <span className={styles.tags}>
                                {exceptionType && (
                                  <span className={styles.badge}>{exceptionLabels[exceptionType]}</span>
                                )}
                                <OriginBadge origin={item.origin} />
                              </span>
                            )}
                            {item.exception?.reason && <p className={styles.reason}>{item.exception.reason}</p>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              Nenhuma celebração para esta seleção no período. Escolha outro dia ou outra comunidade, ou fale
              com a secretaria.
            </p>
          )}
          <Link className={`button-secondary ${styles.periodLink}`} href={periodHref}>
            {extended ? 'Mostrar só as próximas 2 semanas' : 'Ver as próximas 6 semanas'}
            {!extended && <Icon name="arrow" />}
          </Link>
        </section>

        {visibleExceptions.length > 0 && (
          <section className={styles.section} aria-labelledby="exceptions-title">
            <div className={styles.sectionHeading}>
              <h2 id="exceptions-title">Alterações e datas especiais</h2>
              <p>Estas exceções prevalecem sobre a programação semanal</p>
            </div>
            <ul className={styles.exceptionList}>
              {visibleExceptions.map((exception) => (
                <li className={styles.exception} key={exception.id}>
                  <div className={styles.exceptionHeader}>
                    <strong>{exception.title}</strong>
                    <time dateTime={exception.date}>{formatParishDate(exception.date)}</time>
                  </div>
                  <p>
                    {exceptionLabels[exception.exceptionType]}
                    {exception.newTime ? ` · ${exception.newTime.replace(':', 'h')}` : ''}
                    {` · ${relationName(exception.community) || 'Comunidade'}`}
                  </p>
                  {exception.reason && <p>{exception.reason}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section} aria-labelledby="weekly-title">
          <div className={styles.sectionHeading}>
            <h2 id="weekly-title">Programação semanal</h2>
            <p>Regras recorrentes cadastradas</p>
          </div>
          {rules.length ? (
            <ul className={styles.ruleList}>
              {rules
                .slice()
                .sort((a, b) => weekdays.findIndex((item) => item.value === a.weekday) - weekdays.findIndex((item) => item.value === b.weekday) || a.time.localeCompare(b.time))
                .map((rule) => (
                  <li className={styles.rule} key={rule.id}>
                    <span className={styles.ruleDay}>{weekdayLabels[rule.weekday]}</span>
                    <span className={styles.time}>{rule.time.replace(':', 'h')}</span>
                    <div className={styles.ruleBody}>
                      <strong>{rule.title}</strong>
                      <span>{celebrationLabels[rule.celebrationType]} · {relationName(rule.community) || 'Comunidade'}</span>
                      {(rule.validFrom || rule.validTo) && (
                        <p className={styles.validity}>
                          Validade: {rule.validFrom ? formatParishDate(rule.validFrom) : 'sem início definido'} a {rule.validTo ? formatParishDate(rule.validTo) : 'sem data final'}
                        </p>
                      )}
                      {rule.notes && <p className={styles.notes}>{rule.notes}</p>}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className={styles.empty}>Nenhuma regra semanal cadastrada para esta seleção.</p>
          )}
        </section>

        <section className={styles.guidance} aria-label="Orientações sobre confissão e adoração">
          <article>
            <span className="eyebrow">Atendimento e oração</span>
            <h3>Confissão</h3>
            <p>Consulte as celebrações de confissão na programação acima. Para atendimento em outro momento, fale com a secretaria e receba as orientações atualizadas.</p>
          </article>
          <article>
            <span className="eyebrow">Oração em comunidade</span>
            <h3>Adoração</h3>
            <p>Os momentos de adoração cadastrados aparecem na programação. Confirme datas especiais e orientações com a secretaria antes de se deslocar.</p>
          </article>
        </section>

        <section className={styles.contact} aria-labelledby="schedule-contact-title">
          <div>
            <h2 id="schedule-contact-title">Precisa confirmar um horário?</h2>
            <p>Use os canais públicos da secretaria para receber informações sobre celebrações e atendimento.</p>
          </div>
          <div className={styles.contactLinks}>
            {whatsapp && <a className="button" href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">WhatsApp <Icon name="external" /></a>}
            {settings.phone && <a className="button button-secondary" href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>Ligar</a>}
            {settings.email && <a className="button button-secondary" href={`mailto:${settings.email}`}>E-mail</a>}
            <Link className="button button-secondary" href="/contato">Todos os contatos</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
