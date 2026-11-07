import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import { CelebrationList } from '@/components/institutional/CelebrationList'
import { ContactCards } from '@/components/institutional/ContactCards'
import styles from '@/components/institutional/pages.module.css'
import { asMedia, formatTime, weekdayLabels } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { getCMS } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Secretaria paroquial',
  description:
    'Atendimento, expediente, missas da matriz, contatos e localização da Paróquia Nossa Senhora Aparecida.',
}

const weekdayOrder: NonNullable<SiteSetting['secretariatHours']>[number]['weekday'][] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

function formatHoursRow(row: NonNullable<SiteSetting['secretariatHours']>[number]): string {
  const firstPeriod =
    row.opensAt && row.closesAt ? `${formatTime(row.opensAt)} às ${formatTime(row.closesAt)}` : null
  const secondPeriod =
    row.secondOpensAt && row.secondClosesAt
      ? `${formatTime(row.secondOpensAt)} às ${formatTime(row.secondClosesAt)}`
      : null

  return [firstPeriod, secondPeriod].filter(Boolean).join('\n') || 'Horário a confirmar'
}

export default async function SecretariatPage() {
  const payload = await getCMS()
  const now = new Date().toISOString()

  const [page, settings, matrixResult] = await Promise.all([
    payload.findGlobal({
      slug: 'secretariat-page',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.find({
      collection: 'communities',
      where: {
        and: [{ type: { equals: 'matrix' } }, { active: { equals: true } }],
      },
      overrideAccess: false,
      draft: false,
      depth: 1,
      sort: 'order',
      limit: 1,
    }),
  ])

  const matrix = matrixResult.docs[0] || null
  const matrixCelebrations = matrix
    ? await payload.find({
        collection: 'celebrations',
        where: {
          and: [
            { community: { equals: matrix.id } },
            { active: { equals: true } },
            {
              or: [{ validFrom: { less_than_equal: now } }, { validFrom: { exists: false } }],
            },
            {
              or: [{ validTo: { greater_than_equal: now } }, { validTo: { exists: false } }],
            },
          ],
        },
        overrideAccess: false,
        draft: false,
        depth: 1,
        limit: 100,
      })
    : { docs: [] }

  const hours = [...(settings.secretariatHours || [])].sort(
    (a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday),
  )
  const specialImage = asMedia(page.specialCelebrationsImage)

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow="Acolhimento e informações práticas"
            title={page.title || 'Secretaria paroquial'}
            intro={
              page.intro || 'Atendimento, celebrações e os canais para falar com a equipe paroquial.'
            }
          />
        </div>

        <section className={styles.secretariatGrid} aria-label="Expediente e celebrações da matriz">
          <div className={styles.hoursPanel}>
            <span className="eyebrow">Atendimento presencial</span>
            <h2>Horários da secretaria</h2>
            {hours.length > 0 ? (
              <ul className={styles.hoursList}>
                {hours.map((item, index) => (
                  <li key={item.id || `${item.weekday}-${index}`}>
                    <span>{weekdayLabels[item.weekday]}</span>
                    <strong>{formatHoursRow(item)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="notice">
                Os horários de atendimento da secretaria estão em atualização. Entre em contato pelos
                canais abaixo para confirmar o expediente.
              </p>
            )}
          </div>

          <div className={styles.massPanel}>
            <span className="eyebrow">{matrix?.name || 'Igreja matriz'}</span>
            <h2>Missas na matriz</h2>
            <CelebrationList
              celebrations={matrixCelebrations.docs}
              emptyMessage="Os horários de celebração da matriz serão publicados em breve."
            />
            <div className={styles.actions}>
              <Link className="button-secondary" href="/horarios">
                Ver todas as comunidades <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="secretariat-contacts-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Localização e canais oficiais</span>
            <h2 id="secretariat-contacts-title">Como encontrar e falar com a secretaria</h2>
            <p>
              Utilize os canais abaixo para informações sobre sacramentos, intenções, certidões e
              vida comunitária.
            </p>
          </div>
          <ContactCards settings={settings} />
        </section>

        <section className={styles.specialCelebrations} aria-labelledby="special-celebrations-title">
          <div className={styles.specialCopy}>
            <span className="eyebrow">Programação e orientações</span>
            <h2 id="special-celebrations-title">
              {page.specialCelebrationsTitle || 'Celebrações especiais'}
            </h2>
            <p>
              {page.specialCelebrationsBody ||
                'Em solenidades, festas da padroeira, Natal e Semana Santa, os horários podem sofrer alterações. Consulte a agenda paroquial e confirme sempre com a secretaria.'}
            </p>
            <div className={styles.actions}>
              <Link className="button" href="/agenda">
                Consultar agenda <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button-secondary" href="/equipe">
                Estrutura da paróquia <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          {specialImage ? (
            <MediaImage
              image={specialImage}
              alt={specialImage.alt || 'Celebrações na Paróquia Nossa Senhora Aparecida'}
              className={styles.specialImage}
              sizes="(max-width: 700px) 100vw, 520px"
            />
          ) : (
            <div className={styles.readingMark} aria-hidden="true">
              Igreja Matriz
            </div>
          )}
        </section>

        <Callout
          eyebrow="Mensagem à paróquia"
          title="Deseja enviar uma mensagem para a equipe?"
          body="Para dúvidas gerais, sugestões ou propostas de parceria, acesse também nossa página de contato."
          href="/contato"
          linkLabel="Ir para Fale conosco"
        />
      </div>
    </div>
  )
}
