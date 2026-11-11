import Link from 'next/link'

import { MediaImage } from '@/components/site/MediaImage'
import { formatParishDate } from '@/lib/dates'
import type { Post } from '@/payload-types'

import { isMedia, postCategoryLabels, postFormatLabels } from './content'
import styles from './communication.module.css'

export function PostCard({ post }: { post: Post }) {
  const href = `/comunicacao/${encodeURIComponent(post.slug)}`

  return (
    <article className={styles.card}>
      <Link className={styles.cardMedia} href={href} tabIndex={-1} aria-hidden="true">
        {isMedia(post.cover) ? (
          <MediaImage
            image={post.cover}
            alt=""
            className={styles.cardImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <span className={styles.cardPlaceholder}>{postFormatLabels[post.format]}</span>
        )}
        <span className={styles.formatBadge}>{postFormatLabels[post.format]}</span>
      </Link>
      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>
          {post.category ? postCategoryLabels[post.category] : 'Comunicação'}
        </span>
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        <p>{post.summary}</p>
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>{formatParishDate(post.publishedAt)}</time>
        )}
      </div>
    </article>
  )
}
