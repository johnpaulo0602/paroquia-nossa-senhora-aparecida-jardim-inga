import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  labels: { singular: 'Marco histórico', plural: 'Marcos históricos' },
  admin: {
    useAsTitle: 'title',
    group: 'Institucional',
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      enforcePublishPermission,
      ({ data }) => {
        const hasExactDate = Boolean(data.exactDate)
        const hasYear = data.year !== null && data.year !== undefined
        const hasPeriodLabel = Boolean(data.periodLabel)

        switch (data.datePrecision) {
          case 'exact':
            if (!hasExactDate) {
              throw new Error('Informe a data exata para a precisão selecionada.')
            }
            if (hasYear || hasPeriodLabel) {
              throw new Error('Data exata não pode ser combinada com ano ou rótulo de período.')
            }
            break
          case 'year':
            if (!hasYear) {
              throw new Error('Informe o ano para a precisão selecionada.')
            }
            if (hasExactDate || hasPeriodLabel) {
              throw new Error('Ano não pode ser combinado com data exata ou rótulo de período.')
            }
            break
          case 'period':
            if (!hasPeriodLabel) {
              throw new Error('Informe o rótulo do período para a precisão selecionada.')
            }
            if (hasExactDate || hasYear) {
              throw new Error('Período não pode ser combinado com data exata ou ano.')
            }
            break
          case 'text':
            if (hasExactDate || hasYear || hasPeriodLabel) {
              throw new Error('Texto livre não pode ser combinado com campos de data estruturada.')
            }
            break
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'context',
      label: 'Contexto',
      type: 'select',
      options: [
        { label: 'Paróquia', value: 'parish' },
        { label: 'Padroeiro(a)', value: 'patron' },
      ],
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      label: 'Descrição',
      type: 'richText',
      required: true,
    },
    {
      name: 'datePrecision',
      label: 'Precisão da data',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Data exata', value: 'exact' },
        { label: 'Ano', value: 'year' },
        { label: 'Período', value: 'period' },
        { label: 'Texto livre', value: 'text' },
      ],
    },
    {
      name: 'exactDate',
      label: 'Data exata',
      type: 'date',
    },
    {
      name: 'year',
      label: 'Ano',
      type: 'number',
    },
    {
      name: 'periodLabel',
      label: 'Rótulo do período',
      type: 'text',
    },
    {
      name: 'displayLabel',
      label: 'Rótulo de exibição',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex.: Data a confirmar, Hoje, Séculos XVIII e XIX.',
      },
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      required: true,
    },
    {
      name: 'image',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sourceName',
      label: 'Nome da fonte',
      type: 'text',
    },
    {
      name: 'sourceUrl',
      label: 'URL da fonte',
      type: 'text',
    },
    ...editorialFields(),
  ],
}
