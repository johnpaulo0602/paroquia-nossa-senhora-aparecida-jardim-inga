import Link from 'next/link'

import type { Community, Pastoral, Person } from '@/payload-types'
import { RichText } from '@/components/site/RichText'

import styles from './life.module.css'
import { MediaPanel } from './MediaPanel'
import { PrayerCallout } from './PrayerCallout'
import { Icon } from '@/components/site/Icon'

const weekdays: Record<string, string> = {
  sunday: 'Domingo',
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
}

const isPerson = (person: number | Person): person is Person => typeof person === 'object'
const isCommunity = (community: number | Community): community is Community =>
  typeof community === 'object'

export function PastoralDetail({ pastoral }: { pastoral: Pastoral }) {
  const coordinators = pastoral.coordinators?.filter(isPerson) ?? []
  const communities = pastoral.communities?.filter(isCommunity) ?? []
  const meetings = pastoral.meetingInfo ?? []
  const activities = pastoral.activities ?? []

  return (
    <>
      <Link className={styles.backLink} href="/vida/pastorais">
        <Icon name="arrowLeft" /> Todas as pastorais
      </Link>
      <div className={styles.detailHero}>
        <figure>
          <MediaPanel
            image={pastoral.cover}
            alt={pastoral.title}
            className={styles.detailImage}
            sizes="(max-width: 650px) 100vw, 50vw"
          />
          {typeof pastoral.cover === 'object' && pastoral.cover?.caption ? (
            <figcaption>{pastoral.cover.caption}</figcaption>
          ) : null}
        </figure>
        <div>
          <span className="eyebrow">Pastoral · Vida cristã</span>
          <h1>{pastoral.title}</h1>
          {pastoral.mission ? (
            <RichText content={pastoral.mission} className={styles.lead} />
          ) : (
            <p className={styles.lead}>
              Conheça a missão desta pastoral e converse com a secretaria sobre como participar.
            </p>
          )}
          <Link className="button" href="/secretaria">
            Quero participar <Icon name="arrow" />
          </Link>
        </div>
      </div>

      <div className={styles.detailBody}>
        <div>
          <section aria-labelledby="pastoral-atividades">
            <h2 id="pastoral-atividades">Atividades principais</h2>
            {activities.length > 0 ? (
              <ul className={styles.activityList}>
                {activities.map((activity, index) => (
                  <li key={activity.id ?? index}>
                    <Icon name="check" />
                    <div>
                      <strong>{activity.title}</strong>
                      {activity.description ? <p>{activity.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>As atividades serão apresentadas após a confirmação da equipe paroquial.</p>
            )}
          </section>

          <section aria-labelledby="pastoral-participacao">
            <h2 id="pastoral-participacao">Como participar</h2>
            {pastoral.participationInfo ? (
              <RichText content={pastoral.participationInfo} />
            ) : (
              <p>
                Procure a secretaria para conhecer os encontros, conversar com a coordenação e
                receber as orientações de participação.
              </p>
            )}
          </section>

          {communities.length > 0 ? (
            <section aria-labelledby="pastoral-comunidades">
              <h2 id="pastoral-comunidades">Comunidades</h2>
              <ul className={styles.communityList}>
                {communities.map((community) => (
                  <li key={community.id}>
                    <strong>{community.name}</strong>
                    {community.region ? <span>{community.region}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className={styles.infoPanel} aria-label="Informações da pastoral">
          <h2>Encontros e orientações</h2>
          <section>
            <h3>Coordenação</h3>
            {coordinators.length > 0 ? (
              <ul>
                {coordinators.map((person) => (
                  <li key={person.id}>{person.name}</li>
                ))}
              </ul>
            ) : (
              <p>Consulte a secretaria para falar com a coordenação.</p>
            )}
          </section>
          <section>
            <h3>Encontros</h3>
            {meetings.length > 0 ? (
              <ul className={styles.meetingList}>
                {meetings.map((meeting, index) => (
                  <li key={meeting.id ?? index}>
                    <strong>
                      {[meeting.weekday ? weekdays[meeting.weekday] : null, meeting.time]
                        .filter(Boolean)
                        .join(' · ') || 'Encontro'}
                    </strong>
                    {meeting.location ? <span>{meeting.location}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Dias, horários e locais a confirmar com a secretaria.</p>
            )}
          </section>
          {pastoral.requirements ? (
            <section>
              <h3>Requisitos</h3>
              <RichText content={pastoral.requirements} />
            </section>
          ) : null}
          <Link className="button" href="/secretaria">
            Fale com a secretaria <Icon name="arrow" />
          </Link>
        </aside>
      </div>
      <PrayerCallout />
    </>
  )
}
