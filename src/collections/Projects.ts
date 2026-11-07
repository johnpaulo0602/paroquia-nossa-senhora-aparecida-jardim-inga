import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projeto', plural: 'Projetos' },
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
        if (
          data.startsAt &&
          data.endsAt &&
          new Date(data.endsAt).getTime() < new Date(data.startsAt).getTime()
        ) {
          throw new Error('A data de término deve ser igual ou posterior à data de início.')
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'summary',
      label: 'Resumo',
      type: 'textarea',
    },
    {
      name: 'body',
      label: 'Descrição',
      type: 'richText',
    },
    {
      name: 'startsAt',
      label: 'Início',
      type: 'date',
    },
    {
      name: 'endsAt',
      label: 'Término',
      type: 'date',
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'institutionalContacts',
      label: 'Contatos institucionais',
      type: 'richText',
    },
    {
      name: 'ctaLabel',
      label: 'Texto do botão de ação',
      type: 'text',
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
    },
    {
      name: 'active',
      label: 'Ativo',
      type: 'checkbox',
      defaultValue: true,
    },
    ...editorialFields(),
  ],
}
