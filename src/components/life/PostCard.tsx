import Link from 'next/link'

import type { Post } from '@/payload-types'

import styles from './life.module.css'
import { MediaPanel } from './MediaPanel'
import { Icon } from '@/components/site/Icon'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className={styles.editorialCard}>
      <MediaPanel
        image={post.cover}
        alt=""
        className={styles.editorialImage}
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
      />
      <div className={styles.editorialCardBody}>
        <span className="eyebrow">Reflexão</span>
        <h3>
          <Link href={`/reflexoes/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.summary}</p>
        <Link className={styles.textLink} href={`/reflexoes/${post.slug}`}>
          Ler reflexão <Icon name="arrow" />
        </Link>
      </div>
    </article>
  )
}
