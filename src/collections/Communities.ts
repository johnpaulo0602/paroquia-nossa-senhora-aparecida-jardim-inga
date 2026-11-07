import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validateURL = (value: string | null | undefined): true | string => {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    return 'Informe uma URL válida.'
  }

  return 'Informe uma URL HTTP ou HTTPS válida.'
}

export const Communities: CollectionConfig = {
  slug: 'communities',
  labels: { singular: 'Comunidade', plural: 'Comunidades' },
  admin: {
    useAsTitle: 'name',
    group: 'Agenda e comunidades',
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
      name: 'type',
      label: 'Tipo',
      type: 'select',
      options: [
        { label: 'Matriz', value: 'matrix' },
        { label: 'Capela', value: 'chapel' },
      ],
    },
    {
      name: 'region',
      label: 'Região',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'richText',
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea',
    },
    {
      name: 'mapUrl',
      label: 'URL do mapa',
      type: 'text',
      validate: validateURL,
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publicPhone',
      label: 'Telefone público',
      type: 'text',
    },
    {
      name: 'publicEmail',
      label: 'E-mail público',
      type: 'text',
    },
    {
      name: 'publicWhatsapp',
      label: 'WhatsApp público',
      type: 'text',
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'active',
      label: 'Ativa',
      type: 'checkbox',
      defaultValue: true,
    },
    ...editorialFields(),
  ],
}
