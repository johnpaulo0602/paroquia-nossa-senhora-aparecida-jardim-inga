import type { Field } from 'payload'

import { authenticatedField } from '@/access'

export const editorialFields = (): Field[] => [
  {
    name: 'origin',
    label: 'Origem do conteúdo',
    type: 'select',
    required: true,
    defaultValue: 'research',
    options: [
      { label: 'Informação oficial', value: 'official' },
      { label: 'Pesquisa externa', value: 'research' },
      { label: 'Acervo histórico', value: 'archive' },
      { label: 'Demonstração', value: 'demonstration' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Demonstrações ficam fora do portal institucional.',
    },
  },
  {
    name: 'verification',
    label: 'Verificação',
    type: 'select',
    required: true,
    defaultValue: 'pending',
    options: [
      { label: 'Pendente', value: 'pending' },
      { label: 'Revisado', value: 'reviewed' },
      { label: 'Aprovado pela paróquia', value: 'approved' },
    ],
    admin: { position: 'sidebar' },
  },
  {
    name: 'reviewedAt',
    label: 'Revisado em',
    type: 'date',
    admin: { position: 'sidebar' },
  },
  {
    name: 'internalNotes',
    label: 'Observações internas',
    type: 'textarea',
    access: { read: authenticatedField },
    admin: {
      position: 'sidebar',
      description: 'Não aparece no site nem na API pública.',
    },
  },
]
