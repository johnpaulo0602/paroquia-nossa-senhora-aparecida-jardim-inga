'use client'

import Link from 'next/link'
import { useState } from 'react'

import { MediaImage } from '@/components/site/MediaImage'
import type { Event, Highlight, Media, Post } from '@/payload-types'

import styles from './communication.module.css'
import { Icon } from '@/components/site/Icon'

const relation = <T extends Post | Event>(value: number | T | null | undefined) =>
  value && typeof value === 'object' ? value : null

const internalHref = (value: string | null | undefined) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : null

const highlightHref = (highlight: Highlight) => {
  if (highlight.destinationType === 'post') {
    const post = relation(highlight.post)
    return post ? `/comunicacao/${encodeURIComponent(post.slug)}` : null
  }
  if (highlight.destinationType === 'event') {
    const event = relation(highlight.event)
    return event ? `/eventos/${encodeURIComponent(event.slug)}` : null
  }
  if (highlight.destinationType === 'internal') return internalHref(highlight.internalPath)
  return highlight.externalUrl || null
}

export function HighlightsCarousel({ highlights }: { highlights: Highlight[] }) {
  const [index, setIndex] = useState(0)

  // No highlights: the feed below already lists every post, so render nothing.
  if (!highlights.length) return null

  const highlight = highlights[index]
  const post = relation(highlight.post)
  const event = relation(highlight.event)
  const title = highlight.title || post?.title || event?.title || 'Destaque da paróquia'
  const summary = highlight.summary || post?.summary || event?.summary
  const image = (highlight.image || post?.cover || event?.cover || null) as Media | number | null
  const href = highlightHref(highlight)
  const external = highlight.destinationType === 'external'
  const show = (next: number) => setIndex((next + highlights.length) % highlights.length)

  return (
    <section
      className={styles.highlight}
      aria-label="Conteúdos em destaque"
      aria-roledescription="carrossel"
    >
      <article className={styles.highlightCard}>
        <div className={styles.highlightMedia}>
          {image && typeof image === 'object' ? (
            <MediaImage
              image={image}
              alt={image.alt || title}
              className={styles.highlightImage}
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          ) : (
            <span className={styles.highlightPlaceholder} aria-hidden="true">
              Nossa Senhora Aparecida
            </span>
          )}
        </div>
        <div className={styles.highlightCopy}>
          <span className="eyebrow">{highlight.eyebrow || 'Em destaque'}</span>
          <h2>{title}</h2>
          {summary && <p>{summary}</p>}
          {href &&
            (external ? (
              <a className="button" href={href} target="_blank" rel="noopener noreferrer">
                {highlight.ctaLabel || 'Saiba mais'} <Icon name="external" />
              </a>
            ) : (
              <Link className="button" href={href}>
                {highlight.ctaLabel || 'Saiba mais'} <Icon name="arrow" />
              </Link>
            ))}
        </div>
      </article>
      {highlights.length > 1 && (
        <div className={styles.highlightControls}>
          <div className={styles.highlightDots} aria-label="Escolher destaque">
            {highlights.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ver destaque ${itemIndex + 1}`}
                aria-pressed={itemIndex === index}
                onClick={() => show(itemIndex)}
              />
            ))}
          </div>
          <p className={styles.srOnly} role="status">
            Destaque {index + 1} de {highlights.length}: {title}
          </p>
          <div>
            <button type="button" onClick={() => show(index - 1)} aria-label="Destaque anterior">
              <Icon name="arrowLeft" />
            </button>
            <button type="button" onClick={() => show(index + 1)} aria-label="Próximo destaque">
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
