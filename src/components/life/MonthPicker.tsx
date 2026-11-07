'use client'

import { useId, useState } from 'react'

import styles from './life.module.css'

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function MonthPicker({ initialMonth }: { initialMonth: number }) {
  const [month, setMonth] = useState(months[initialMonth] ?? months[0])
  const selectId = useId()

  return (
    <section className={styles.birthdays} aria-labelledby={`${selectId}-title`}>
      <div>
        <span className="eyebrow">Celebrar o dom da vida</span>
        <h2 id={`${selectId}-title`}>Aniversariantes do mês</h2>
        <p>Uma lembrança carinhosa para quem partilha a caminhada conosco.</p>
        <label htmlFor={selectId}>Selecione o mês</label>
        <select id={selectId} value={month} onChange={(event) => setMonth(event.target.value)}>
          {months.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.birthdayResult} role="status" aria-live="polite">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path
            d="M10 21h28v21H10zM7 15h34v8H7zM23 4h2v11h-2zM17 9l2 1-3 5-2-1zm14 0-2 1 3 5 2-1z"
            fill="currentColor"
          />
        </svg>
        <h3>{month}</h3>
        <p>Não há aniversariantes publicados para este mês.</p>
        <small>
          A paróquia não mantém uma lista pública de aniversariantes. Nomes só poderão aparecer
          mediante autorização e uma rotina específica de publicação.
        </small>
      </div>
    </section>
  )
}
