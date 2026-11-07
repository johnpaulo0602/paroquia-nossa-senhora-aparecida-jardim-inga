import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Patrocinador', plural: 'Patrocinadores' },
  admin: {
    useAsTitle: 'name',
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
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logotipo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
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
      name: 'project',
      label: 'Projeto',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'approved',
      label: 'Aprovado',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'O frontend deve exibir publicamente somente patrocinadores aprovados.',
      },
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
    },
    ...editorialFields(),
  ],
}
