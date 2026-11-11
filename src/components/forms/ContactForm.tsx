'use client'

import styles from './forms.module.css'
import { Consent, Field, Honeypot, Submit, Success } from './parts'
import { text, useSiteForm } from './useSiteForm'

const toBody = (data: FormData) => ({
  name: text(data, 'name'),
  email: text(data, 'email'),
  subject: text(data, 'subject'),
  relation: text(data, 'relation'),
  message: text(data, 'message'),
})

export function ContactForm() {
  const { state, onSubmit, reset } = useSiteForm('/api/contato', toBody)

  if (state.status === 'success') {
    return (
      <Success
        againLabel="Enviar outra mensagem"
        message="A secretaria vai ler e responder pelo e-mail informado."
        onAgain={reset}
        title="Mensagem enviada."
      />
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row}>
        <Field id="contact-name" label="Seu nome">
          <input
            autoComplete="name"
            id="contact-name"
            maxLength={120}
            minLength={2}
            name="name"
            required
            type="text"
          />
        </Field>
        <Field id="contact-email" label="Seu e-mail">
          <input
            autoComplete="email"
            id="contact-email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </Field>
      </div>
      <div className={styles.row}>
        <Field id="contact-subject" label="Assunto">
          <select defaultValue="" id="contact-subject" name="subject" required>
            <option disabled value="">
              Escolha um assunto
            </option>
            <option value="sacraments">Sacramentos (batismo, casamento, catequese)</option>
            <option value="participation">Participar de uma pastoral ou comunidade</option>
            <option value="partnerships">Projetos e parcerias</option>
            <option value="communication">Comunicação e notícias</option>
            <option value="other">Outro assunto</option>
          </select>
        </Field>
        <Field id="contact-relation" label="Você é">
          <select defaultValue="" id="contact-relation" name="relation" required>
            <option disabled value="">
              Escolha uma opção
            </option>
            <option value="parishioner">Paroquiano(a)</option>
            <option value="visitor">Visitante</option>
            <option value="interested">Quero conhecer a paróquia</option>
          </select>
        </Field>
      </div>
      <Field id="contact-message" label="Mensagem">
        <textarea id="contact-message" maxLength={5000} minLength={2} name="message" required />
      </Field>
      <Honeypot />
      <Consent id="contact-consent">
        Autorizo a paróquia a usar meu nome e e-mail para responder a esta mensagem.
      </Consent>
      <Submit label="Enviar mensagem" state={state} />
    </form>
  )
}
