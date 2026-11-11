import type { Person } from '@/payload-types'

import styles from './life.module.css'

export function ClergyList({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return <p>A equipe sacerdotal será apresentada aqui após a publicação dos registros.</p>
  }

  return (
    <ul className={styles.clergyList} aria-label="Equipe sacerdotal">
      {people.map((person) => (
        <li key={person.id}>
          <strong>{person.name}</strong>
          {person.roleTitle && <span>{person.roleTitle}</span>}
        </li>
      ))}
    </ul>
  )
}
