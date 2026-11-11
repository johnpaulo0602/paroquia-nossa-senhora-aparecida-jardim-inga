import type { Condition, Field } from 'payload'

import { authenticatedField } from '@/access'

/** Review metadata from the prototype phase. Only technical administrators see it. */
const adminOnly: Condition = (_data, _siblingData, { user }) => user?.role === 'admin'

export const editorialFields = (): Field[] => [
  {
    name: 'origin',
    label: 'Origem do conteúdo',
    type: 'select',
    required: true,
    defaultValue: 'official',
    options: [
      { label: 'Informação oficial', value: 'official' },
      { label: 'Pesquisa externa', value: 'research' },
      { label: 'Acervo histórico', value: 'archive' },
      { label: 'Demonstração', value: 'demonstration' },
    ],
    admin: {
      position: 'sidebar',
      condition: adminOnly,
      description:
        'O conteúdo de demonstração some do site quando SHOW_DEMO_CONTENT é "false".',
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
    admin: { position: 'sidebar', condition: adminOnly },
  },
  {
    name: 'reviewedAt',
    label: 'Revisado em',
    type: 'date',
    admin: { position: 'sidebar', condition: adminOnly },
  },
  {
    name: 'internalNotes',
    label: 'Anotações internas',
    type: 'textarea',
    access: { read: authenticatedField },
    admin: {
      position: 'sidebar',
      condition: adminOnly,
      description: 'Não aparece no site.',
    },
  },
]
