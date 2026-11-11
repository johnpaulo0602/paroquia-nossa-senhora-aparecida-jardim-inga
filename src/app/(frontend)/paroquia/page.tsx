import type { Metadata } from 'next'

import { Callout } from '@/components/institutional/Callout'
import styles from '@/components/institutional/pages.module.css'
import { Timeline } from '@/components/institutional/Timeline'
import { PageHeader } from '@/components/site/PageHeader'
import { StaticPicture } from '@/components/site/StaticPicture'
import { historyPage, historyTimeline } from '@/content/history'

export const metadata: Metadata = {
  title: 'A história da nossa paróquia',
  description: 'Memórias de fé, encontros e vida em comunidade na Paróquia Nossa Senhora Aparecida.',
}

export default function ParishHistoryPage() {
  const page = historyPage
  const cover = page.cover

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow={page.eyebrow}
            title={page.title}
            intro={page.intro}
          />
        </div>

        <figure className={styles.cover}>
          <StaticPicture
            image={cover}
            className={styles.coverImage}
            sizes="(max-width: 1200px) 100vw, 1160px"
          />
          <figcaption>{[cover.caption, cover.credit].filter(Boolean).join(' · ')}</figcaption>
        </figure>

        <section className={styles.introGrid} aria-labelledby="history-memory-title">
          <div>
            <span className="eyebrow">Uma memória construída juntos</span>
            <h2 id="history-memory-title">Cada encontro faz parte desta história.</h2>
          </div>
          <p>
            A linha do tempo reúne os marcos da nossa paróquia, com as fontes consultadas quando
            disponíveis.
          </p>
        </section>

        <Timeline
          items={historyTimeline}
          label="história da paróquia"
          idPrefix="historia"
          emptyMessage="Nenhum marco da história da paróquia foi publicado até o momento."
        />

        <Callout
          eyebrow="Preservar a nossa memória"
          title={page.contributionTitle}
          body={page.contributionBody}
          href="/secretaria"
          linkLabel="Fale com a secretaria"
        />
      </div>
    </div>
  )
}
