import Link from 'next/link'

import styles from './Callout.module.css'

type CalloutProps = {
  eyebrow?: string
  title: string
  body: string
  href: string
  linkLabel: string
}

export function Callout({ eyebrow, title, body, href, linkLabel }: CalloutProps) {
  return (
    <section className={styles.callout}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Link className="button" href={href}>
        {linkLabel} <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}
