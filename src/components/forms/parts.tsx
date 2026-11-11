'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import styles from './forms.module.css'
import type { FormState } from './useSiteForm'

type FieldProps = {
  id: string
  label: string
  optional?: boolean
  hint?: string
  children: ReactNode
}

export function Field({ id, label, optional, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} {optional && <span className={styles.optional}>(opcional)</span>}
      </label>
      {children}
      {hint && (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  )
}

/** Hidden field that only bots fill in; the server silently drops those submissions. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className={styles.trap}>
      <label>
        Não preencha este campo
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>
    </div>
  )
}

export function Consent({ id, children }: { id: string; children: ReactNode }) {
  return (
    <label className={styles.consent} htmlFor={id}>
      <input id={id} name="consent" required type="checkbox" />
      <span>
        {children} Os dados são usados só para este atendimento.{' '}
        <Link href="/secretaria">Dúvidas? Fale com a secretaria.</Link>
      </span>
    </label>
  )
}

type SubmitProps = {
  state: FormState
  label: string
  sendingLabel?: string
}

export function Submit({ state, label, sendingLabel = 'Enviando…' }: SubmitProps) {
  const sending = state.status === 'sending'

  return (
    <>
      {state.status === 'error' && (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      )}
      <div className={styles.actions}>
        <button className="button" disabled={sending} type="submit">
          {sending ? sendingLabel : label}
        </button>
      </div>
    </>
  )
}

type SuccessProps = {
  title: string
  message: string
  againLabel: string
  onAgain: () => void
}

export function Success({ title, message, againLabel, onAgain }: SuccessProps) {
  return (
    <div className={styles.success} role="status">
      <strong>{title}</strong>
      {message}
      <div>
        <button onClick={onAgain} type="button">
          {againLabel}
        </button>
      </div>
    </div>
  )
}
