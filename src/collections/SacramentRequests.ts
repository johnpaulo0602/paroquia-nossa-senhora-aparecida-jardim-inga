import type { CollectionConfig, CollectionSlug } from 'payload'

import { canManageService, hiddenUnless, isAdmin, serviceRoles } from '@/access'

export const SacramentRequests: CollectionConfig = {
  slug: 'sacrament-requests',
  labels: { singular: 'Pedido de sacramento', plural: 'Pedidos de sacramentos' },
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['requestType', 'applicantName', 'preferredDate', 'status', 'createdAt'],
    group: 'Mensagens recebidas',
    hidden: hiddenUnless(...serviceRoles),
    description:
      'Pedidos de batismo e casamento enviados pelo site. O pedido não reserva data: a secretaria confirma com a família.',
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
      label: 'Sacramento pedido',
      type: 'select',
      required: true,
      options: [
        { label: 'Batismo', value: 'baptism' },
        { label: 'Casamento', value: 'marriage' },
      ],
    },
    {
      name: 'applicantName',
      label: 'Nome de quem pediu',
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
      label: 'Data que a família prefere',
      type: 'date',
      admin: {
        description:
          'Data informada pelo solicitante; não representa reserva ou confirmação de agenda.',
      },
    },
    {
      name: 'community',
      label: 'Igreja ou comunidade',
      type: 'relationship',
      relationTo: 'communities' as CollectionSlug,
    },
    {
      name: 'payload',
      label: 'Outras respostas do formulário',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Respostas extras do formulário, guardadas como o visitante enviou.',
      },
    },
    {
      name: 'notes',
      label: 'Recado de quem pediu',
      type: 'textarea',
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
        { label: 'Aguardando documentos', value: 'awaiting_documents' },
        { label: 'Agendada', value: 'scheduled' },
        { label: 'Concluída', value: 'completed' },
        { label: 'Arquivada', value: 'archived' },
      ],
    },
    {
      name: 'consent',
      label: 'A pessoa autorizou o uso dos dados para o atendimento',
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
