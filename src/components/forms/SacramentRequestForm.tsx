'use client'

import { useCallback } from 'react'

import styles from './forms.module.css'
import { Consent, Field, Honeypot, Submit, Success } from './parts'
import { text, useSiteForm } from './useSiteForm'

type SacramentRequestFormProps = {
  type: 'baptism' | 'marriage'
  communities: { id: number; name: string }[]
}

const detailFields = {
  baptism: ['childName', 'birthDate', 'parentName', 'secondParentName', 'godfatherName', 'godmotherName'],
  marriage: ['partnerOneName', 'partnerTwoName'],
} as const

const today = () => new Date().toISOString().slice(0, 10)

export function SacramentRequestForm({ type, communities }: SacramentRequestFormProps) {
  const toBody = useCallback(
    (data: FormData) => {
      const details: Record<string, string> = {}
      for (const field of detailFields[type]) {
        const value = text(data, field)
        if (value) details[field] = value
      }

      return {
        requestType: type,
        applicantName: text(data, 'applicantName'),
        email: text(data, 'email'),
        phone: text(data, 'phone'),
        preferredDate: text(data, 'preferredDate'),
        community: text(data, 'community'),
        notes: text(data, 'notes'),
        payload: details,
      }
    },
    [type],
  )
  const { state, onSubmit, reset } = useSiteForm('/api/sacramentos', toBody)
  const baptism = type === 'baptism'

  if (state.status === 'success') {
    return (
      <Success
        againLabel="Fazer outro pedido"
        message="A secretaria vai entrar em contato para confirmar a preparação, os documentos e a data. O pedido não reserva a data."
        onAgain={reset}
        title="Pedido recebido."
      />
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row}>
        <Field id="sacrament-applicant" label="Seu nome">
          <input
            autoComplete="name"
            id="sacrament-applicant"
            maxLength={120}
            minLength={2}
            name="applicantName"
            required
            type="text"
          />
        </Field>
        <Field id="sacrament-phone" label="Telefone ou WhatsApp">
          <input
            autoComplete="tel"
            id="sacrament-phone"
            inputMode="tel"
            maxLength={30}
            minLength={8}
            name="phone"
            pattern="[+()\d.\-\s]{8,30}"
            placeholder="(61) 90000-0000"
            required
            title="Informe o telefone com DDD, usando apenas números, espaços, parênteses e traços."
            type="tel"
          />
        </Field>
      </div>
      <Field id="sacrament-email" label="Seu e-mail">
        <input
          autoComplete="email"
          id="sacrament-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </Field>

      {baptism ? (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Sobre a criança</legend>
          <div className={styles.row}>
            <Field id="sacrament-child" label="Nome da criança" optional>
              <input id="sacrament-child" maxLength={120} name="childName" type="text" />
            </Field>
            <Field id="sacrament-birth" label="Data de nascimento" optional>
              <input id="sacrament-birth" max={today()} name="birthDate" type="date" />
            </Field>
          </div>
          <div className={styles.row}>
            <Field id="sacrament-parent" label="Nome do pai ou da mãe" optional>
              <input id="sacrament-parent" maxLength={120} name="parentName" type="text" />
            </Field>
            <Field id="sacrament-parent-2" label="Nome do outro responsável" optional>
              <input id="sacrament-parent-2" maxLength={120} name="secondParentName" type="text" />
            </Field>
          </div>
          <div className={styles.row}>
            <Field id="sacrament-godfather" label="Nome do padrinho" optional>
              <input id="sacrament-godfather" maxLength={120} name="godfatherName" type="text" />
            </Field>
            <Field id="sacrament-godmother" label="Nome da madrinha" optional>
              <input id="sacrament-godmother" maxLength={120} name="godmotherName" type="text" />
            </Field>
          </div>
        </fieldset>
      ) : (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Sobre os noivos</legend>
          <div className={styles.row}>
            <Field id="sacrament-partner-1" label="Nome de um dos noivos" optional>
              <input id="sacrament-partner-1" maxLength={120} name="partnerOneName" type="text" />
            </Field>
            <Field id="sacrament-partner-2" label="Nome do outro noivo ou noiva" optional>
              <input id="sacrament-partner-2" maxLength={120} name="partnerTwoName" type="text" />
            </Field>
          </div>
        </fieldset>
      )}

      <div className={styles.row}>
        <Field
          hint="É só uma preferência: a secretaria confirma a disponibilidade."
          id="sacrament-date"
          label="Data que você prefere"
          optional
        >
          <input
            aria-describedby="sacrament-date-hint"
            id="sacrament-date"
            min={today()}
            name="preferredDate"
            type="date"
          />
        </Field>
        {communities.length > 0 && (
          <Field id="sacrament-community" label="Igreja ou comunidade" optional>
            <select defaultValue="" id="sacrament-community" name="community">
              <option value="">Ainda não sei</option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <Field id="sacrament-notes" label="Quer contar mais alguma coisa?" optional>
        <textarea id="sacrament-notes" maxLength={3000} name="notes" />
      </Field>
      <Honeypot />
      <Consent id="sacrament-consent">
        Autorizo a paróquia a usar estes dados para tratar do meu pedido.
      </Consent>
      <Submit label="Enviar pedido" state={state} />
    </form>
  )
}
