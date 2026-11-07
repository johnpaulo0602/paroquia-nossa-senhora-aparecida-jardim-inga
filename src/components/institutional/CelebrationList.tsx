import type { Celebration } from '@/payload-types'

import styles from './CelebrationList.module.css'
import { formatTime, sortCelebrations, weekdayLabels } from './utils'

type CelebrationListProps = {
  celebrations: Celebration[]
  emptyMessage?: string
}

export function CelebrationList({
  celebrations,
  emptyMessage = 'Nenhuma celebração ativa foi publicada para esta comunidade.',
}: CelebrationListProps) {
  if (!celebrations.length) return <p className={styles.empty}>{emptyMessage}</p>

  return (
    <ul className={styles.list}>
      {sortCelebrations(celebrations).map((celebration) => (
        <li key={celebration.id}>
          <span className={styles.weekday}>{weekdayLabels[celebration.weekday]}</span>
          <strong className={styles.time}>{formatTime(celebration.time)}</strong>
          <div>
            <h3>{celebration.title}</h3>
            {celebration.notes && <p>{celebration.notes}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
