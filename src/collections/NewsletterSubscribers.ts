import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Assinante da newsletter', plural: 'Assinantes da newsletter' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
    group: 'Atendimento privado',
  },
  access: {
    create: () => false,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      unique: true,
      required: true,
    },
    {
      name: 'status',
      label: 'Situação',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Confirmado', value: 'confirmed' },
        { label: 'Descadastrado', value: 'unsubscribed' },
      ],
    },
    {
      name: 'consent',
      label: 'Consentimento para tratamento dos dados',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'consentAt',
      label: 'Data do consentimento',
      type: 'date',
    },
    {
      name: 'confirmedAt',
      label: 'Data da confirmação',
      type: 'date',
    },
    {
      name: 'unsubscribeToken',
      label: 'Token de cancelamento',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
    {
      name: 'source',
      label: 'Origem',
      type: 'text',
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
