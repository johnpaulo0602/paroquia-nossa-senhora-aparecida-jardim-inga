import type { CollectionConfig } from 'payload'

import { canManageService, isAdmin } from '@/access'

export const TitheInterests: CollectionConfig = {
  slug: 'tithe-interests',
  labels: { singular: 'Interesse no dízimo', plural: 'Interesses no dízimo' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'createdAt'],
    group: 'Atendimento privado',
  },
  access: {
    create: () => false,
    read: canManageService,
    update: canManageService,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
    },
    {
      name: 'consent',
      label: 'Consentimento para tratamento dos dados',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'status',
      label: 'Situação',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Novo', value: 'new' },
        { label: 'Em andamento', value: 'in_progress' },
        { label: 'Contatado', value: 'contacted' },
        { label: 'Arquivado', value: 'archived' },
      ],
    },
    {
      name: 'internalNotes',
      label: 'Observações internas',
      type: 'textarea',
    },
    {
      name: 'retentionUntil',
      label: 'Retenção até',
      type: 'date',
      admin: { description: 'Data limite para retenção dos dados.' },
    },
  ],
  timestamps: true,
}
