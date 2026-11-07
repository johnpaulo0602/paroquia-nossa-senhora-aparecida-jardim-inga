import type { Metadata } from 'next'

import styles from '@/components/institutional/pages.module.css'
import { Timeline } from '@/components/institutional/Timeline'
import { asMedia, safeExternalUrl } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'

import { getCMS } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Nossa Senhora Aparecida',
  description: 'Conheça a história e os marcos da devoção à padroeira do Brasil.',
}

export default async function PatronPage() {
  const payload = await getCMS()
  const [page, milestones] = await Promise.all([
    payload.findGlobal({
      slug: 'patron-page',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.find({
      collection: 'milestones',
      where: { context: { equals: 'patron' } },
      overrideAccess: false,
      draft: false,
      depth: 2,
      sort: 'order',
      limit: 100,
    }),
  ])
  const cover = asMedia(page.cover)
  const readingUrl = safeExternalUrl(page.readingUrl)
  const hasReading = Boolean(page.readingTitle || page.readingBody || readingUrl)
  const facts = (page.facts || []).filter((fact) => fact.title || fact.body)
  const sources = (page.sources || []).flatMap((source) => {
    const url = safeExternalUrl(source.url)
    return source.label && url ? [{ id: source.id, label: source.label, url }] : []
  })

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow={page.eyebrow || 'Nossa padroeira'}
            title={page.title || 'Nossa Senhora Aparecida'}
            intro={page.intro || 'A história de uma devoção que une gerações.'}
          />
        </div>

        {cover ? (
          <figure className={styles.cover}>
            <MediaImage
              image={cover}
              alt={cover.alt || 'Representação de Nossa Senhora Aparecida'}
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
          <div className={styles.coverFallback}>
            A imagem de apresentação da padroeira ainda não foi publicada.
          </div>
        )}

        <Timeline
          items={milestones.docs}
          label="história de Nossa Senhora Aparecida"
          idPrefix="padroeira"
          emptyMessage="Nenhum marco da história da padroeira foi publicado até o momento."
        />

        {hasReading && (
          <section className={styles.reading} aria-labelledby="patron-reading-title">
            <div className={styles.readingMark} aria-hidden="true">Aparecida</div>
            <div className={styles.readingCopy}>
              <span className="eyebrow">Para conhecer mais</span>
              <h2 id="patron-reading-title">{page.readingTitle || 'Leitura complementar'}</h2>
              {page.readingBody && <p>{page.readingBody}</p>}
              {readingUrl && (
                <a className="button" href={readingUrl} target="_blank" rel="noopener noreferrer">
                  Acessar a leitura <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </section>
        )}

        {facts.length > 0 && (
          <section className={styles.section} aria-labelledby="patron-facts-title">
            <div className={styles.centeredSection}>
              <span className="eyebrow">Devoção e história</span>
              <h2 id="patron-facts-title">Para conhecer a padroeira</h2>
            </div>
            <div className={styles.facts}>
              {facts.map((fact, index) => (
                <article className={styles.fact} key={fact.id || index}>
                  {fact.icon && <span className={styles.factIcon} aria-hidden="true">{fact.icon}</span>}
                  {fact.title && <h3>{fact.title}</h3>}
                  {fact.body && <p>{fact.body}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section className={styles.sources} aria-labelledby="patron-sources-title">
            <h2 id="patron-sources-title">Fontes</h2>
            <ul>
              {sources.map((source, index) => (
                <li key={source.id || index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.label} <span aria-hidden="true">↗</span>
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
