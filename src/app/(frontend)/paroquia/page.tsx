import type { Metadata } from 'next'
import Image from 'next/image'

import { Callout } from '@/components/institutional/Callout'
import styles from '@/components/institutional/pages.module.css'
import { Timeline } from '@/components/institutional/Timeline'
import { asMedia } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { getCMS } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'A história da nossa paróquia',
  description: 'Memórias de fé, encontros e vida em comunidade na Paróquia Nossa Senhora Aparecida.',
}

export default async function ParishHistoryPage() {
  const payload = await getCMS()
  const [page, milestones] = await Promise.all([
    payload.findGlobal({
      slug: 'history-page',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.find({
      collection: 'milestones',
      where: { context: { equals: 'parish' } },
      overrideAccess: false,
      draft: false,
      depth: 2,
      sort: 'order',
      limit: 100,
    }),
  ])
  const cover = asMedia(page.cover)

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow={page.eyebrow || 'Nossa Senhora Aparecida · Jardim Ingá'}
            title={page.title || 'A história da nossa paróquia.'}
            intro={page.intro || 'Memórias de fé, encontros e vida em comunidade.'}
          />
        </div>

        {cover ? (
          <figure className={styles.cover}>
            <MediaImage
              image={cover}
              alt={cover.alt || 'Igreja matriz Nossa Senhora Aparecida'}
              className={styles.coverImage}
              sizes="(max-width: 1200px) 100vw, 1160px"
            />
            {(page.coverCaption || cover.caption || cover.credit) && (
              <figcaption>
                {page.coverCaption || [cover.caption, cover.credit].filter(Boolean).join(' · ')}
              </figcaption>
            )}
          </figure>
        ) : (
          <figure className={styles.cover}>
            <Image
              alt="Fachada da igreja matriz Nossa Senhora Aparecida"
              className={styles.coverImage}
              height={688}
              sizes="(max-width: 1200px) 100vw, 1160px"
              src="/images/matriz-atual.jpg"
              width={688}
            />
          </figure>
        )}

        <section className={styles.introGrid} aria-labelledby="history-memory-title">
          <div>
            <span className="eyebrow">Uma memória construída juntos</span>
            <h2 id="history-memory-title">Cada encontro faz parte desta história.</h2>
          </div>
          <p>
            A linha do tempo apresenta os marcos publicados pela equipe paroquial, com suas datas
            de exibição e fontes quando disponíveis.
          </p>
        </section>

        <Timeline
          items={milestones.docs}
          label="história da paróquia"
          idPrefix="historia"
          emptyMessage="Nenhum marco da história da paróquia foi publicado até o momento."
        />

        <Callout
          eyebrow="Preservar a nossa memória"
          title={page.contributionTitle || 'Você tem uma história para compartilhar?'}
          body={
            page.contributionBody ||
            'Converse com a secretaria sobre registros, fotografias e memórias da comunidade.'
          }
          href="/secretaria"
          linkLabel="Fale com a secretaria"
        />
      </div>
    </div>
  )
}
