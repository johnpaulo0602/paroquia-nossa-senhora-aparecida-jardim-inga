import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  canEditContent,
  contentRoles,
  enforcePublishPermission,
  hiddenUnless,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'
import { timeField } from '@/fields/time'

const validateException: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const exceptionType = 'exceptionType' in data ? data.exceptionType : originalDoc?.exceptionType
  const newTime = 'newTime' in data ? data.newTime : originalDoc?.newTime
  const celebration = 'celebration' in data ? data.celebration : originalDoc?.celebration

  if (exceptionType === 'change' && !newTime) {
    throw new APIError('Escolha o novo horário da celebração.', 400)
  }

  if (exceptionType === 'extra' && celebration) {
    throw new APIError('Uma celebração extra não substitui um horário fixo: deixe o campo "Qual horário fixo muda?" em branco.', 400)
  }

  return data
}

export const CelebrationExceptions: CollectionConfig = {
  slug: 'celebration-exceptions',
  labels: { singular: 'Mudança ou cancelamento', plural: 'Mudanças e cancelamentos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'exceptionType', 'community'],
    group: 'Missas e agenda',
    hidden: hiddenUnless(...contentRoles),
    description:
      'Quando, em um dia específico, uma missa é cancelada, muda de horário ou há uma celebração extra.',
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
      label: 'O que acontece?',
      type: 'text',
      required: true,
      admin: { placeholder: 'Ex.: Missa das 19h cancelada por causa da festa da padroeira' },
    },
    {
      name: 'celebration',
      label: 'Qual horário fixo muda?',
      type: 'relationship',
      relationTo: 'celebrations',
      admin: {
        description: 'Deixe em branco se for uma celebração extra.',
        condition: (data) => data.exceptionType !== 'extra',
      },
    },
    {
      name: 'community',
      label: 'Em qual igreja ou comunidade?',
      type: 'relationship',
      relationTo: 'communities',
      required: true,
    },
    {
      name: 'date',
      label: 'Em que dia?',
      type: 'date',
      required: true,
      admin: { date: { displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'exceptionType',
      label: 'Tipo de mudança',
      type: 'select',
      required: true,
      defaultValue: 'cancellation',
      options: [
        { label: 'A celebração foi cancelada', value: 'cancellation' },
        { label: 'A celebração mudou de horário', value: 'change' },
        { label: 'Celebração extra neste dia', value: 'extra' },
      ],
    },
    timeField({
      name: 'newTime',
      label: 'Novo horário',
      condition: (data) => data.exceptionType !== 'cancellation',
    }),
    {
      name: 'reason',
      label: 'Explicação para os fiéis',
      type: 'textarea',
    },
    ...editorialFields(),
  ],
}
