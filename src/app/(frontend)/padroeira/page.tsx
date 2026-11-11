import type { Metadata } from 'next'

import styles from '@/components/institutional/pages.module.css'
import { Timeline } from '@/components/institutional/Timeline'
import { StaticPicture } from '@/components/site/StaticPicture'
import { PageHeader } from '@/components/site/PageHeader'
import { Icon } from '@/components/site/Icon'
import { patronPage, patronTimeline } from '@/content/patron'

export const metadata: Metadata = {
  title: 'Nossa Senhora Aparecida',
  description: 'Conheça a história e os marcos da devoção à padroeira do Brasil.',
}

export default function PatronPage() {
  const page = patronPage
  const cover = page.cover
  const { reading, facts, sources } = page

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

        <Timeline
          items={patronTimeline}
          label="história de Nossa Senhora Aparecida"
          idPrefix="padroeira"
          emptyMessage="Nenhum marco da história da padroeira foi publicado até o momento."
        />

        <section className={styles.reading} aria-labelledby="patron-reading-title">
            <div className={styles.readingMark} aria-hidden="true">
              Aparecida
            </div>
            <div className={styles.readingCopy}>
              <span className="eyebrow">Para conhecer mais</span>
              <h2 id="patron-reading-title">{reading.title}</h2>
              <p>{reading.body}</p>
              <a className="button" href={reading.url} target="_blank" rel="noopener noreferrer">
                Acessar a leitura <Icon name="external" />
              </a>
            </div>
          </section>

        {facts.length > 0 && (
          <section className={styles.section} aria-labelledby="patron-facts-title">
            <div className={styles.centeredSection}>
              <span className="eyebrow">Devoção e história</span>
              <h2 id="patron-facts-title">Para conhecer a padroeira</h2>
            </div>
            <div className={styles.facts}>
              {facts.map((fact) => (
                <article className={styles.fact} key={fact.title}>
                  <Icon className={styles.factIcon} name={fact.icon} />
                  <h3>{fact.title}</h3>
                  <p>{fact.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section className={styles.sources} aria-labelledby="patron-sources-title">
            <h2 id="patron-sources-title">Fontes</h2>
            <ul>
              {sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.label} <Icon name="external" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
