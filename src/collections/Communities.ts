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
import { previewURL } from '@/lib/preview'

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
    defaultColumns: ['name', 'type', 'region', 'active'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description: 'A matriz e as capelas. Cada uma tem a sua página no site.',
    livePreview: { url: ({ data }) => previewURL(`/comunidades/${data.slug}`) },
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    beforeChange: [enforcePublishPermission],
  },
  fields: [
    {
      name: 'name',
      label: 'Nome da comunidade',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'type',
      label: 'É a matriz ou uma capela?',
      type: 'select',
      options: [
        { label: 'Matriz', value: 'matrix' },
        { label: 'Capela', value: 'chapel' },
      ],
    },
    {
      name: 'region',
      label: 'Bairro ou região',
      admin: { placeholder: 'Ex.: Jardim Ingá' },
      type: 'text',
    },
    {
      name: 'description',
      label: 'Sobre a comunidade',
      type: 'richText',
    },
    {
      name: 'address',
      label: 'Endereço completo',
      type: 'textarea',
    },
    {
      name: 'mapUrl',
      label: 'Link do Google Maps',
      admin: {
        placeholder: 'https://maps.app.goo.gl/...',
        description: 'No Google Maps, toque em Compartilhar, copie o link e cole aqui.',
      },
      type: 'text',
      validate: validateURL,
    },
    {
      name: 'cover',
      label: 'Foto da igreja',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publicPhone',
      label: 'Telefone',
      admin: { placeholder: '(61) 3000-0000' },
      type: 'text',
    },
    {
      name: 'publicEmail',
      label: 'E-mail',
      type: 'text',
    },
    {
      name: 'publicWhatsapp',
      label: 'WhatsApp',
      admin: { placeholder: '(61) 90000-0000' },
      type: 'text',
    },
    {
      name: 'order',
      label: 'Posição na lista',
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
      type: 'number',
      defaultValue: 0,
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
