import type { CollectionConfig } from 'payload'

import { canManageService, hiddenUnless, isAdmin, serviceRoles } from '@/access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Mensagem do Fale conosco', plural: 'Fale conosco' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'status', 'createdAt'],
    group: 'Mensagens recebidas',
    hidden: hiddenUnless(...serviceRoles),
    description: 'Mensagens enviadas pelos visitantes na página Contato.',
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
      label: 'Nome de quem escreveu',
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
      label: 'Quem é a pessoa?',
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
      label: 'Andamento',
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
      label: 'A pessoa autorizou o uso dos dados para a resposta',
      type: 'checkbox',
      required: true,
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
