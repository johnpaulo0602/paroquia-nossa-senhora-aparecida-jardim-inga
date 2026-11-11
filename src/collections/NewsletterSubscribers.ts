import type { CollectionConfig } from 'payload'

import { hiddenUnless, isAdmin } from '@/access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Inscrito nas novidades', plural: 'Inscritos nas novidades' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
    group: 'Mensagens recebidas',
    hidden: hiddenUnless('admin'),
    description: 'E-mails de quem pediu para receber as novidades da paróquia.',
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
      label: 'Situação da inscrição',
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
      label: 'A pessoa autorizou receber e-mails',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'consentAt',
      label: 'Autorizou em',
      type: 'date',
    },
    {
      name: 'confirmedAt',
      label: 'Confirmou o e-mail em',
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
      label: 'Página onde se inscreveu',
      type: 'text',
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
