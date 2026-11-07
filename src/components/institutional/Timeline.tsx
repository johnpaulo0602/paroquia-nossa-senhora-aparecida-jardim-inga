import { MediaImage } from '@/components/site/MediaImage'
import { RichText } from '@/components/site/RichText'
import type { Milestone } from '@/payload-types'

import styles from './Timeline.module.css'
import { asMedia, safeExternalUrl } from './utils'

type TimelineProps = {
  items: Milestone[]
  label: string
  idPrefix: string
  emptyMessage: string
}

export function Timeline({ items, label, idPrefix, emptyMessage }: TimelineProps) {
  if (!items.length) return <p className="notice">{emptyMessage}</p>

  return (
    <>
      <nav className={styles.jump} aria-label={`Navegar pela ${label}`}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${idPrefix}-${item.id}`}>
                {item.displayLabel} · {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ol className={styles.timeline} aria-label={`Linha do tempo: ${label}`}>
        {items.map((item) => {
          const image = asMedia(item.image)
          const sourceUrl = safeExternalUrl(item.sourceUrl)

          return (
            <li
              className={styles.item}
              id={`${idPrefix}-${item.id}`}
              key={item.id}
              tabIndex={-1}
            >
              <span className={styles.node} aria-hidden="true" />
              <article className={styles.card}>
                {image ? (
                  <figure className={styles.media}>
                    <MediaImage
                      image={image}
                      alt={image.alt || item.title}
                      className={styles.image}
                      sizes="(max-width: 650px) 100vw, 42vw"
                    />
                    {(image.caption || image.credit) && (
                      <figcaption>{[image.caption, image.credit].filter(Boolean).join(' · ')}</figcaption>
                    )}
                  </figure>
                ) : (
                  <div className={styles.mediaFallback}>
                    <span>Imagem não cadastrada</span>
                    <small>O acervo deste marco ainda não foi publicado.</small>
                  </div>
                )}
                <span className={styles.date}>{item.displayLabel}</span>
                <h2>{item.title}</h2>
                <RichText content={item.body} className={styles.body} />
                {item.sourceName && !sourceUrl && (
                  <small className={styles.source}>Fonte: {item.sourceName}</small>
                )}
                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                    {item.sourceName || 'Consultar fonte'} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </>
  )
}
