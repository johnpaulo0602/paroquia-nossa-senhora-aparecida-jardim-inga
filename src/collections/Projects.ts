import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  contentRoles,
  enforcePublishPermission,
  hiddenUnless,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projeto', plural: 'Projetos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', '_status'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description: 'Projetos sociais e parcerias mostrados na página Projetos e parcerias.',
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
      label: 'Nome do projeto',
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
      label: 'Descrição completa',
      type: 'richText',
    },
    {
      name: 'startsAt',
      label: 'Começa em',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
      type: 'date',
    },
    {
      name: 'endsAt',
      label: 'Termina em',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
      type: 'date',
    },
    {
      name: 'cover',
      label: 'Imagem do projeto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'institutionalContacts',
      label: 'Com quem falar sobre o projeto',
      type: 'richText',
    },
    {
      name: 'ctaLabel',
      label: 'Texto do botão',
      admin: { placeholder: 'Ex.: Quero apoiar' },
      type: 'text',
    },
    {
      name: 'order',
      label: 'Posição na lista',
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
      type: 'number',
    },
    {
      name: 'active',
      label: 'Mostrar no site',
      admin: { position: 'sidebar' },
      type: 'checkbox',
      defaultValue: true,
    },
    ...editorialFields(),
  ],
}
