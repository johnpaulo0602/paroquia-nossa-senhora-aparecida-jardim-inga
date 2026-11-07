import { slugField } from 'payload'
import type { CollectionConfig, FieldAccess } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const canReadPublicContact: FieldAccess = ({ req, siblingData }) =>
  Boolean(req.user || siblingData?.publicContactAuthorized)

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Pessoa', plural: 'Pessoas' },
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
    beforeChange: [enforcePublishPermission],
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'biography',
      label: 'Biografia',
      type: 'richText',
    },
    {
      name: 'photo',
      label: 'Foto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publicEmail',
      label: 'E-mail público',
      type: 'text',
      access: { read: canReadPublicContact },
    },
    {
      name: 'publicPhone',
      label: 'Telefone público',
      type: 'text',
      access: { read: canReadPublicContact },
    },
    {
      name: 'publicContactAuthorized',
      label: 'Contato público autorizado',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Autoriza a divulgação do e-mail e do telefone públicos. Sem esta autorização, os contatos ficam disponíveis apenas para usuários autenticados.',
      },
    },
    ...editorialFields(),
  ],
}
