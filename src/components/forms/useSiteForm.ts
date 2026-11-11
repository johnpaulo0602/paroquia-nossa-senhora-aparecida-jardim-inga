'use client'

import { useCallback, useState } from 'react'

export type FormState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

type Json = Record<string, unknown>

const connectionError =
  'Não foi possível enviar agora. Confira sua conexão e tente de novo, ou fale com a secretaria.'

/**
 * Sends a form to one of the `/api/*` form routes as JSON. The routes validate
 * everything again on the server and answer `{ success, message }`.
 */
export function useSiteForm(endpoint: string, toBody: (data: FormData) => Json) {
  const [state, setState] = useState<FormState>({ status: 'idle' })

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.currentTarget
      const data = new FormData(form)
      setState({ status: 'sending' })

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...toBody(data),
            consent: data.get('consent') === 'on',
            website: String(data.get('website') ?? ''),
          }),
        })
        const result = (await response.json().catch(() => null)) as {
          success?: boolean
          message?: string
        } | null

        if (response.ok && result?.success) {
          form.reset()
          setState({ status: 'success', message: result.message || 'Recebemos o seu envio.' })
        } else {
          setState({ status: 'error', message: result?.message || connectionError })
        }
      } catch {
        setState({ status: 'error', message: connectionError })
      }
    },
    [endpoint, toBody],
  )

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, onSubmit, reset }
}

/** Trimmed text of a field, or `undefined` when it was left empty. */
export const text = (data: FormData, name: string): string | undefined => {
  const value = String(data.get(name) ?? '').trim()
  return value || undefined
}
