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

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Patrocinador', plural: 'Patrocinadores' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'approved', 'project', '_status'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description: 'Empresas e pessoas que apoiam a paróquia. Só aparecem no site depois de aprovadas.',
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
      label: 'Nome do patrocinador',
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
      label: 'Site do patrocinador',
      admin: { placeholder: 'https://' },
      type: 'text',
    },
    {
      name: 'startsAt',
      label: 'Apoia desde',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
      type: 'date',
    },
    {
      name: 'endsAt',
      label: 'Apoia até',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
      type: 'date',
    },
    {
      name: 'project',
      label: 'Apoia qual projeto?',
      admin: { description: 'Deixe em branco se apoia a paróquia em geral.' },
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'approved',
      label: 'Aprovado pela paróquia',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Só patrocinadores aprovados aparecem no site.',
      },
    },
    {
      name: 'order',
      label: 'Posição na lista',
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
      type: 'number',
      defaultValue: 0,
    },
    ...editorialFields(),
  ],
}
