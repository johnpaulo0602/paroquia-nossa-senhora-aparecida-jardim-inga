import type { Field } from 'payload'

/** Every quarter hour from 05:00 to 23:45, stored as "HH:mm" and shown as "19h30". */
const timeOptions = Array.from({ length: (24 - 5) * 4 }, (_, index) => {
  const hours = String(5 + Math.floor(index / 4)).padStart(2, '0')
  const minutes = String((index % 4) * 15).padStart(2, '0')
  return { label: `${hours}h${minutes}`, value: `${hours}:${minutes}` }
})

type TimeFieldOptions = {
  name: string
  label: string
  required?: boolean
  description?: string
  width?: string
  condition?: (data: Record<string, unknown>) => boolean
}

/** Time of day picked from a list, so nobody has to type a format. */
export const timeField = ({
  name,
  label,
  required,
  description,
  width,
  condition,
}: TimeFieldOptions): Field => ({
  name,
  label,
  type: 'select',
  required,
  options: timeOptions,
  admin: {
    description,
    width,
    condition,
    placeholder: 'Escolha o horário',
  },
})
