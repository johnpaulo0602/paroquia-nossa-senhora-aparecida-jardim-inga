import Link from 'next/link'

import type { Pastoral } from '@/payload-types'
import { RichText } from '@/components/site/RichText'

import styles from './life.module.css'
import { MediaPanel } from './MediaPanel'

export function PastoralCard({ pastoral }: { pastoral: Pastoral }) {
  return (
    <article className={styles.pastoralCard}>
      <MediaPanel
        image={pastoral.cover}
        alt=""
        className={styles.pastoralImage}
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
      />
      <div className={styles.pastoralCardBody}>
        <span className="eyebrow">Pastoral</span>
        <h2>
          <Link href={`/pastorais/${pastoral.slug}`}>{pastoral.title}</Link>
        </h2>
        {pastoral.mission ? (
          <RichText content={pastoral.mission} className={styles.cardRichText} />
        ) : (
          <p>Conheça esta pastoral e as formas de participação confirmadas pela paróquia.</p>
        )}
        <Link className={styles.textLink} href={`/pastorais/${pastoral.slug}`}>
          Conheça e participe <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
