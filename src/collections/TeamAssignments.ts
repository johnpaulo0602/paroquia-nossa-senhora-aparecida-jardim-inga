import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const TeamAssignments: CollectionConfig = {
  slug: 'team-assignments',
  labels: { singular: 'Atribuição de equipe', plural: 'Atribuições de equipe' },
  admin: {
    useAsTitle: 'roleTitle',
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
      name: 'person',
      label: 'Pessoa',
      type: 'relationship',
      relationTo: 'people',
      required: true,
    },
    {
      name: 'roleTitle',
      label: 'Função',
      type: 'text',
      required: true,
    },
    {
      name: 'roleType',
      label: 'Tipo de função',
      type: 'select',
      options: [
        { label: 'Clero', value: 'clergy' },
        { label: 'Administração', value: 'administration' },
        { label: 'Pastoral', value: 'pastoral' },
        { label: 'Serviço', value: 'service' },
      ],
    },
    {
      name: 'area',
      label: 'Área',
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
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'current',
      label: 'Atual',
      type: 'checkbox',
      defaultValue: true,
    },
    ...editorialFields(),
  ],
}
