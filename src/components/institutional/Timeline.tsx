import { StaticPicture } from '@/components/site/StaticPicture'
import type { TimelineEntry } from '@/content/types'

import styles from './Timeline.module.css'
import { safeExternalUrl } from './utils'
import { Icon } from '@/components/site/Icon'

type TimelineProps = {
  items: TimelineEntry[]
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
                {item.label} · {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ol className={styles.timeline} aria-label={`Linha do tempo: ${label}`}>
        {items.map((item) => {
          const image = item.image
          const sourceUrl = safeExternalUrl(item.sourceUrl)

          return (
            <li className={styles.item} id={`${idPrefix}-${item.id}`} key={item.id} tabIndex={-1}>
              <span className={styles.node} aria-hidden="true" />
              <article className={styles.card}>
                {image ? (
                  <figure className={styles.media}>
                    <StaticPicture
                      image={image}
                      alt={image.alt || item.title}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                    {(image.caption || image.credit) && (
                      <figcaption>
                        {[image.caption, image.credit].filter(Boolean).join(' · ')}
                      </figcaption>
                    )}
                  </figure>
                ) : null}
                <span className={styles.date}>{item.label}</span>
                <h2>{item.title}</h2>
                <div className={styles.body}>
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {item.sourceName && !sourceUrl && (
                  <small className={styles.source}>Fonte: {item.sourceName}</small>
                )}
                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                    {item.sourceName || 'Consultar fonte'} <Icon name="external" />
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
