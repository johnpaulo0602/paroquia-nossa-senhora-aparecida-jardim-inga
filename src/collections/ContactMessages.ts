import type { CollectionConfig } from 'payload'

import { canManageService, isAdmin } from '@/access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Mensagem de contato', plural: 'Mensagens de contato' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'status', 'createdAt'],
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
      name: 'subject',
      label: 'Assunto',
      type: 'select',
      required: true,
      options: [
        { label: 'Sacramentos', value: 'sacraments' },
        { label: 'Participação', value: 'participation' },
        { label: 'Parcerias', value: 'partnerships' },
        { label: 'Comunicação', value: 'communication' },
        { label: 'Outro', value: 'other' },
      ],
    },
    {
      name: 'relation',
      label: 'Relação com a paróquia',
      type: 'select',
      required: true,
      options: [
        { label: 'Paroquiano', value: 'parishioner' },
        { label: 'Visitante', value: 'visitor' },
        { label: 'Interessado', value: 'interested' },
      ],
    },
    {
      name: 'message',
      label: 'Mensagem',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      label: 'Situação',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Nova', value: 'new' },
        { label: 'Em andamento', value: 'in_progress' },
        { label: 'Respondida', value: 'answered' },
        { label: 'Arquivada', value: 'archived' },
      ],
    },
    {
      name: 'consent',
      label: 'Consentimento para tratamento dos dados',
      type: 'checkbox',
      required: true,
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
