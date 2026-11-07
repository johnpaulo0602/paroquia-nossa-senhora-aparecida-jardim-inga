import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validateDateRange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const validFrom = 'validFrom' in data ? data.validFrom : originalDoc?.validFrom
  const validTo = 'validTo' in data ? data.validTo : originalDoc?.validTo

  if (validFrom && validTo && new Date(validTo).getTime() < new Date(validFrom).getTime()) {
    throw new APIError('A data final não pode ser anterior à data inicial.', 400)
  }

  return data
}

export const Celebrations: CollectionConfig = {
  slug: 'celebrations',
  labels: { singular: 'Celebração', plural: 'Celebrações' },
  admin: {
    useAsTitle: 'title',
    group: 'Agenda e comunidades',
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [enforcePublishPermission, validateDateRange],
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'celebrationType',
      label: 'Tipo de celebração',
      type: 'select',
      options: [
        { label: 'Santa Missa', value: 'mass' },
        { label: 'Confissão', value: 'confession' },
        { label: 'Adoração', value: 'adoration' },
        { label: 'Outra', value: 'other' },
      ],
    },
    {
      name: 'community',
      label: 'Comunidade',
      type: 'relationship',
      relationTo: 'communities',
      required: true,
    },
    {
      name: 'weekday',
      label: 'Dia da semana',
      type: 'select',
      required: true,
      options: [
        { label: 'Domingo', value: 'sunday' },
        { label: 'Segunda-feira', value: 'monday' },
        { label: 'Terça-feira', value: 'tuesday' },
        { label: 'Quarta-feira', value: 'wednesday' },
        { label: 'Quinta-feira', value: 'thursday' },
        { label: 'Sexta-feira', value: 'friday' },
        { label: 'Sábado', value: 'saturday' },
      ],
    },
    {
      name: 'time',
      label: 'Horário',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return (
          /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) ||
          'Informe o horário no formato HH:mm (24 horas).'
        )
      },
    },
    {
      name: 'validFrom',
      label: 'Início da validade',
      type: 'date',
    },
    {
      name: 'validTo',
      label: 'Fim da validade',
      type: 'date',
    },
    {
      name: 'notes',
      label: 'Observações',
      type: 'textarea',
    },
    {
      name: 'active',
      label: 'Ativa',
      type: 'checkbox',
      defaultValue: true,
    },
    ...editorialFields(),
  ],
}
