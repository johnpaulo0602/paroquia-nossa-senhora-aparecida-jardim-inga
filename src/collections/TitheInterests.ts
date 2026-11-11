import type { CollectionConfig } from 'payload'

import { canManageService, hiddenUnless, isAdmin, serviceRoles } from '@/access'

export const TitheInterests: CollectionConfig = {
  slug: 'tithe-interests',
  labels: { singular: 'Interessado no dízimo', plural: 'Interessados no dízimo' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'createdAt'],
    group: 'Mensagens recebidas',
    hidden: hiddenUnless(...serviceRoles),
    description: 'Pessoas que pediram contato para se tornarem dizimistas.',
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
      label: 'A pessoa autorizou o uso dos dados para o contato',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'status',
      label: 'Andamento',
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
      label: 'Anotações da secretaria',
      type: 'textarea',
    },
    {
      name: 'retentionUntil',
      label: 'Guardar até',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
        description: 'Até quando estes dados pessoais podem ficar guardados (LGPD).',
      },
    },
  ],
  timestamps: true,
}
