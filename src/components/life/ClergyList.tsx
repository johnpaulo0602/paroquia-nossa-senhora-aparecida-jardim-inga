import type { Person, TeamAssignment } from '@/payload-types'

import styles from './life.module.css'

export function ClergyList({ assignments }: { assignments: TeamAssignment[] }) {
  const clergy = assignments.filter(
    (assignment): assignment is TeamAssignment & { person: Person } =>
      typeof assignment.person === 'object' && assignment.person !== null,
  )

  if (clergy.length === 0) {
    return <p>A equipe sacerdotal será apresentada aqui após a publicação dos registros.</p>
  }

  return (
    <ul className={styles.clergyList} aria-label="Equipe sacerdotal">
      {clergy.map((assignment) => (
        <li key={assignment.id}>
          <strong>{assignment.person.name}</strong>
          <span>{assignment.roleTitle}</span>
        </li>
      ))}
    </ul>
  )
}
