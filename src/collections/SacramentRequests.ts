import type { CollectionConfig, CollectionSlug } from 'payload'

import { canManageService, isAdmin } from '@/access'

export const SacramentRequests: CollectionConfig = {
  slug: 'sacrament-requests',
  labels: { singular: 'Solicitação de sacramento', plural: 'Solicitações de sacramentos' },
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['requestType', 'applicantName', 'preferredDate', 'status', 'createdAt'],
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
      name: 'requestType',
      label: 'Tipo de sacramento',
      type: 'select',
      required: true,
      options: [
        { label: 'Batismo', value: 'baptism' },
        { label: 'Casamento', value: 'marriage' },
      ],
    },
    {
      name: 'applicantName',
      label: 'Nome do solicitante',
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
      name: 'phone',
      label: 'Telefone',
      type: 'text',
      required: true,
    },
    {
      name: 'preferredDate',
      label: 'Data de preferência',
      type: 'date',
      admin: {
        description:
          'Data informada pelo solicitante; não representa reserva ou confirmação de agenda.',
      },
    },
    {
      name: 'community',
      label: 'Comunidade',
      type: 'relationship',
      relationTo: 'communities' as CollectionSlug,
    },
    {
      name: 'payload',
      label: 'Dados complementares',
      type: 'json',
      admin: { description: 'Demais campos validados pelo endpoint customizado.' },
    },
    {
      name: 'notes',
      label: 'Observações do solicitante',
      type: 'textarea',
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
        { label: 'Aguardando documentos', value: 'awaiting_documents' },
        { label: 'Agendada', value: 'scheduled' },
        { label: 'Concluída', value: 'completed' },
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
