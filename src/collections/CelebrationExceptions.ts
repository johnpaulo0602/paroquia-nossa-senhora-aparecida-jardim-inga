import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validateException: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const exceptionType = 'exceptionType' in data ? data.exceptionType : originalDoc?.exceptionType
  const newTime = 'newTime' in data ? data.newTime : originalDoc?.newTime
  const celebration = 'celebration' in data ? data.celebration : originalDoc?.celebration

  if (exceptionType === 'change' && !newTime) {
    throw new APIError('Informe o novo horário para uma alteração de celebração.', 400)
  }

  if (exceptionType === 'extra' && celebration) {
    throw new APIError('Uma celebração extra não pode apontar para uma celebração existente.', 400)
  }

  return data
}

export const CelebrationExceptions: CollectionConfig = {
  slug: 'celebration-exceptions',
  labels: { singular: 'Exceção de celebração', plural: 'Exceções de celebrações' },
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
    beforeChange: [enforcePublishPermission, validateException],
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'celebration',
      label: 'Celebração',
      type: 'relationship',
      relationTo: 'celebrations',
    },
    {
      name: 'community',
      label: 'Comunidade',
      type: 'relationship',
      relationTo: 'communities',
      required: true,
    },
    {
      name: 'date',
      label: 'Data',
      type: 'date',
      required: true,
    },
    {
      name: 'exceptionType',
      label: 'Tipo de exceção',
      type: 'select',
      options: [
        { label: 'Cancelamento', value: 'cancellation' },
        { label: 'Alteração', value: 'change' },
        { label: 'Extra', value: 'extra' },
      ],
    },
    {
      name: 'newTime',
      label: 'Novo horário',
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return (
          /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) ||
          'Informe o horário no formato HH:mm (24 horas).'
        )
      },
    },
    {
      name: 'reason',
      label: 'Motivo',
      type: 'textarea',
    },
    ...editorialFields(),
  ],
}
