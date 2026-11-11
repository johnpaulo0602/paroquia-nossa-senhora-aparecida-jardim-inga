'use client'

import styles from './forms.module.css'
import { Consent, Field, Honeypot, Submit, Success } from './parts'
import { text, useSiteForm } from './useSiteForm'

const toBody = (data: FormData) => ({
  name: text(data, 'name'),
  email: text(data, 'email'),
})

export function TitheInterestForm() {
  const { state, onSubmit, reset } = useSiteForm('/api/dizimo', toBody)

  if (state.status === 'success') {
    return (
      <Success
        againLabel="Registrar outra pessoa"
        message="A pastoral do dízimo vai entrar em contato pelo e-mail informado. Nenhum pagamento foi feito."
        onAgain={reset}
        title="Recebemos o seu interesse."
      />
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Field id="tithe-name" label="Seu nome">
        <input
          autoComplete="name"
          id="tithe-name"
          maxLength={120}
          minLength={2}
          name="name"
          required
          type="text"
        />
      </Field>
      <Field id="tithe-email" label="Seu e-mail">
        <input
          autoComplete="email"
          id="tithe-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </Field>
      <Honeypot />
      <Consent id="tithe-consent">
        Autorizo a paróquia a entrar em contato comigo sobre o dízimo.
      </Consent>
      <Submit label="Quero ser dizimista" state={state} />
    </form>
  )
}
