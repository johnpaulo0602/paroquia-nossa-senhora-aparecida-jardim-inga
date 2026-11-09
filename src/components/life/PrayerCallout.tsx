import Link from 'next/link'

import styles from './life.module.css'
import { Icon } from '@/components/site/Icon'

export function PrayerCallout() {
  return (
    <section className={styles.callout} aria-labelledby="prayer-callout-title">
      <div>
        <span className="eyebrow">Reze conosco</span>
        <h2 id="prayer-callout-title">Um lugar para a fé crescer em comunidade.</h2>
        <p>
          Consulte os horários das celebrações e converse com a secretaria sobre os momentos de
          oração.
        </p>
      </div>
      <Link className="button" href="/horarios">
        Missas e celebrações <Icon name="arrow" />
      </Link>
    </section>
  )
}
