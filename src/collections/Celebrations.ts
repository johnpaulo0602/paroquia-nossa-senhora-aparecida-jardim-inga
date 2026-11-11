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

const validateDateRange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const validFrom = 'validFrom' in data ? data.validFrom : originalDoc?.validFrom
  const validTo = 'validTo' in data ? data.validTo : originalDoc?.validTo

  if (validFrom && validTo && new Date(validTo).getTime() < new Date(validFrom).getTime()) {
    throw new APIError('A data "Vale até" precisa ser depois de "Vale a partir de".', 400)
  }

  return data
}

export const Celebrations: CollectionConfig = {
  slug: 'celebrations',
  labels: { singular: 'Horário de missa', plural: 'Missas e horários' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'community', 'weekday', 'time', 'active'],
    group: 'Missas e agenda',
    hidden: hiddenUnless(...contentRoles),
    description:
      'Os horários fixos de cada semana: missas, confissões e adoração. Para uma mudança em um dia específico, use "Mudanças e cancelamentos".',
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
      label: 'Nome da celebração',
      type: 'text',
      required: true,
      admin: { placeholder: 'Ex.: Missa dominical, Confissões, Adoração ao Santíssimo' },
    },
    {
      name: 'celebrationType',
      label: 'Tipo',
      type: 'select',
      defaultValue: 'mass',
      options: [
        { label: 'Santa Missa', value: 'mass' },
        { label: 'Confissão', value: 'confession' },
        { label: 'Adoração', value: 'adoration' },
        { label: 'Outra', value: 'other' },
      ],
    },
    {
      name: 'community',
      label: 'Em qual igreja ou comunidade?',
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
    timeField({ name: 'time', label: 'Horário', required: true }),
    {
      name: 'validFrom',
      label: 'Vale a partir de',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
        description: 'Deixe em branco se o horário já está valendo.',
      },
    },
    {
      name: 'validTo',
      label: 'Vale até',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
        description: 'Deixe em branco se não tem data para acabar.',
      },
    },
    {
      name: 'notes',
      label: 'Observação para os fiéis',
      type: 'textarea',
      admin: { placeholder: 'Ex.: Com bênção das crianças no primeiro domingo do mês' },
    },
    {
      name: 'active',
      label: 'Mostrar no site',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    ...editorialFields(),
  ],
}
