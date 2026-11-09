import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import styles from '@/components/institutional/pages.module.css'
import { asMedia, asPerson, emailHref, phoneHref } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { getCMS } from '@/lib/payload'
import type { Person } from '@/payload-types'
import { Icon } from '@/components/site/Icon'

export const metadata: Metadata = {
  title: 'Estrutura da paróquia',
  description: 'Conheça os sacerdotes e a equipe a serviço da comunidade.',
}

function PersonContactLinks({ person }: { person: Person }) {
  const authorized = person.publicContactAuthorized === true

  return (
    <div className={styles.personLinks}>
      {authorized && person.publicEmail && (
        <a href={emailHref(person.publicEmail)}>
          E-mail público <Icon name="arrow" />
        </a>
      )}
      {authorized && person.publicPhone && (
        <a href={phoneHref(person.publicPhone)}>
          Telefone público <Icon name="arrow" />
        </a>
      )}
      <Link href="/secretaria">
        Contato pela secretaria <Icon name="arrow" />
      </Link>
    </div>
  )
}

export default async function TeamPage() {
  const payload = await getCMS()
  const assignments = await payload.find({
    collection: 'team-assignments',
    where: { current: { equals: true } },
    overrideAccess: false,
    draft: false,
    depth: 2,
    sort: 'order',
    limit: 100,
  })
  const clergy = assignments.docs.filter((assignment) => assignment.roleType === 'clergy')
  const staff = assignments.docs.filter((assignment) => assignment.roleType !== 'clergy')

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.header}>
          <PageHeader
            eyebrow="Pessoas a serviço da comunidade"
            title="Estrutura da paróquia"
            intro="Conheça os sacerdotes e a equipe que caminha com a comunidade."
          />
        </div>

        <section className={styles.teamSection} aria-label="Clero">
          {clergy.length ? (
            <div className={styles.teamList}>
              {clergy.map((assignment) => {
                const person = asPerson(assignment.person)
                if (!person) return null
                const photo = asMedia(person.photo)

                return (
                  <article className={styles.teamLead} key={assignment.id}>
                    {photo ? (
                      <MediaImage
                        image={photo}
                        alt={photo.alt || `Fotografia de ${person.name}`}
                        className={styles.teamPhoto}
                        sizes="(max-width: 700px) 100vw, 340px"
                      />
                    ) : (
                      <div className={styles.photoFallback}>Fotografia não publicada.</div>
                    )}
                    <div className={styles.teamLeadCopy}>
                      <span className="eyebrow">{assignment.roleTitle}</span>
                      <h2>{person.name}</h2>
                      {assignment.area && <span className={styles.area}>{assignment.area}</span>}
                      {person.biography ? (
                        <RichText content={person.biography} className={styles.biography} />
                      ) : (
                        <p className={styles.muted}>Biografia ainda não publicada.</p>
                      )}
                      <PersonContactLinks person={person} />
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="notice">Nenhuma atribuição atual do clero foi publicada.</p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="staff-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Serviço e participação</span>
            <h2 id="staff-title">Equipe pastoral e administrativa</h2>
          </div>
          {staff.length ? (
            <div className={styles.teamGrid}>
              {staff.map((assignment) => {
                const person = asPerson(assignment.person)
                if (!person) return null
                const photo = asMedia(person.photo)

                return (
                  <article className={styles.teamCard} key={assignment.id}>
                    {photo ? (
                      <MediaImage
                        image={photo}
                        alt={photo.alt || `Fotografia de ${person.name}`}
                        className={styles.teamCardPhoto}
                        sizes="(max-width: 700px) 100vw, (max-width: 950px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.photoFallback}>Fotografia não publicada.</div>
                    )}
                    <div className={styles.teamCardCopy}>
                      <span className="eyebrow">{assignment.roleTitle}</span>
                      <h3>{person.name}</h3>
                      {assignment.area && <span className={styles.area}>{assignment.area}</span>}
                      {person.biography ? (
                        <RichText content={person.biography} className={styles.biography} />
                      ) : (
                        <p className={styles.muted}>Apresentação ainda não publicada.</p>
                      )}
                      <PersonContactLinks person={person} />
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="notice">Nenhuma atribuição atual da equipe foi publicada nesta área.</p>
          )}
        </section>

        <Callout
          eyebrow="Informação e acolhimento"
          title="Quer falar com a equipe?"
          body="A secretaria pode orientar você sobre atendimento, pastorais e participação na comunidade."
          href="/secretaria"
          linkLabel="Secretaria paroquial"
        />
      </div>
    </div>
  )
}
