import styles from './life.module.css'

type EmptyStateProps = {
  title: string
  children: React.ReactNode
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}
