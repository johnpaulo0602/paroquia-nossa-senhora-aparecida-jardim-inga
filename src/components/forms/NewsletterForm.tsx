'use client'

import styles from './forms.module.css'
import { Field, Honeypot, Submit, Success } from './parts'
import { text, useSiteForm } from './useSiteForm'

const toBody = (data: FormData) => ({ email: text(data, 'email') })

/** Compact sign-up used on the dark band above the footer. */
export function NewsletterForm() {
  const { state, onSubmit, reset } = useSiteForm('/api/newsletter', toBody)

  if (state.status === 'success') {
    return (
      <div className={styles.inline}>
        <Success
          againLabel="Inscrever outro e-mail"
          message={state.message}
          onAgain={reset}
          title="Inscrição recebida."
        />
      </div>
    )
  }

  return (
    <form className={`${styles.form} ${styles.inline} ${styles.onDark}`} onSubmit={onSubmit}>
      <div className={styles.inlineRow}>
        <Field id="newsletter-email" label="Receba as novidades por e-mail">
          <input
            autoComplete="email"
            id="newsletter-email"
            maxLength={254}
            name="email"
            placeholder="seu@email.com"
            required
            type="email"
          />
        </Field>
      </div>
      <Honeypot />
      <label className={styles.consent} htmlFor="newsletter-consent">
        <input id="newsletter-consent" name="consent" required type="checkbox" />
        <span>Autorizo a paróquia a me enviar notícias e avisos por e-mail.</span>
      </label>
      <Submit label="Quero receber" state={state} />
    </form>
  )
}
