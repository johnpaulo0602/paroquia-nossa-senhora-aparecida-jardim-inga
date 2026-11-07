import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'

import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { formatParishDate, getParishDateParts } from '@/lib/dates'
import { activeDuring, getCMS } from '@/lib/payload'
import { resolveCelebrationsForDate } from '@/lib/schedule'

import styles from '@/components/schedule/schedule.module.css'

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
          title="Missas e celebrações"
          intro="Consulte os horários da matriz e das comunidades. Em datas especiais, a programação pode mudar."
        />

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

        <form className={styles.filters} action="/horarios" method="get">
          <div>
            <label htmlFor="schedule-community">Onde você quer participar?</label>
            <select id="schedule-community" name="comunidade" defaultValue={community}>
              <option value="">Todas as comunidades</option>
              {communities.docs.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="schedule-day">Dia da semana</label>
            <select id="schedule-day" name="dia" defaultValue={day}>
              <option value="">Todos os dias</option>
              {weekdays.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <button className="button button-secondary" type="submit">Filtrar horários</button>
        </form>

        <section className={styles.section} aria-labelledby="upcoming-title">
          <div className={styles.sectionHeading}>
            <h2 id="upcoming-title">Próximas celebrações</h2>
            <p>Próximos 42 dias · horário de Brasília</p>
          </div>
          {occurrences.length ? (
            <ul className={styles.occurrenceList}>
              {occurrences.map((item) => {
                const weekday = weekdays[dateAtNoon(item.date).getUTCDay()].value
                const exceptionType = item.exception?.exceptionType
                return (
                  <li className={styles.occurrence} key={`${item.id}-${item.date}`}>
                    <time className={styles.occurrenceDate} dateTime={`${item.date}T${item.time}:00-03:00`}>
                      <strong>{weekdayLabels[weekday]}</strong>
                      {formatParishDate(dateAtNoon(item.date), { day: '2-digit', month: 'short', year: 'numeric' })}
                    </time>
                    <span className={styles.time}>{item.time.replace(':', 'h')}</span>
                    <div className={styles.occurrenceBody}>
                      <strong>{item.title}</strong>
                      <span>{celebrationLabels[item.celebrationType]} · {relationName(item.community) || 'Comunidade'}</span>
                      {exceptionType && <span className={styles.badge}>{exceptionLabels[exceptionType]}</span>}
                      {item.exception?.reason && <p className={styles.reason}>{item.exception.reason}</p>}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.empty}>Nenhuma celebração cadastrada para esta seleção nos próximos 42 dias. Escolha outro dia ou consulte a secretaria.</p>
          )}
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
            {whatsapp && <a className="button" href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}
            {settings.phone && <a className="button button-secondary" href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}>Ligar</a>}
            {settings.email && <a className="button button-secondary" href={`mailto:${settings.email}`}>E-mail</a>}
            <Link className="button button-secondary" href="/contato">Todos os contatos</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
