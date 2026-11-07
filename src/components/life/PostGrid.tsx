import type { Post } from '@/payload-types'

import { EmptyState } from './EmptyState'
import styles from './life.module.css'
import { PostCard } from './PostCard'

type PostGridProps = {
  posts: Post[]
  emptyTitle?: string
  emptyText?: string
}

export function PostGrid({
  posts,
  emptyTitle = 'Nenhuma reflexão publicada',
  emptyText = 'Novos textos serão apresentados aqui após a publicação pela equipe paroquial.',
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState title={emptyTitle}>
        <p>{emptyText}</p>
      </EmptyState>
    )
  }

  return (
    <div className={styles.editorialGrid}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
