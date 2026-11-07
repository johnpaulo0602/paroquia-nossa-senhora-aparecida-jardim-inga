import { APIError } from 'payload'
import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  TextFieldSingleValidation,
} from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validateExternalUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    return 'Informe uma URL externa válida com http ou https.'
  }

  return 'Informe uma URL externa válida com http ou https.'
}

const validateDestination: CollectionBeforeChangeHook = ({ data }) => {
  let destination: unknown

  switch (data.destinationType) {
    case 'post':
      destination = data.post
      break
    case 'event':
      destination = data.event
      break
    case 'internal':
      destination = data.internalPath
      break
    case 'external':
      destination = data.externalUrl
      break
  }

  if (
    destination === undefined ||
    destination === null ||
    (typeof destination === 'string' && destination.trim() === '')
  ) {
    throw new APIError('Preencha o destino correspondente ao tipo selecionado.', 400)
  }

  return data
}

export const Highlights: CollectionConfig = {
  slug: 'highlights',
  labels: { singular: 'Destaque', plural: 'Destaques' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destinationType', 'placement', 'order', 'startsAt', 'endsAt'],
    group: 'Conteúdo',
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: { beforeChange: [enforcePublishPermission, validateDestination] },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
    },
    {
      name: 'eyebrow',
      label: 'Chamada superior',
      type: 'text',
    },
    {
      name: 'summary',
      label: 'Resumo',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaLabel',
      label: 'Texto do botão',
      type: 'text',
    },
    {
      name: 'destinationType',
      label: 'Tipo de destino',
      type: 'select',
      required: true,
      options: [
        { label: 'Publicação', value: 'post' },
        { label: 'Evento', value: 'event' },
        { label: 'Página interna', value: 'internal' },
        { label: 'Endereço externo', value: 'external' },
      ],
    },
    {
      name: 'post',
      label: 'Publicação de destino',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (data) => data.destinationType === 'post',
      },
    },
    {
      name: 'event',
      label: 'Evento de destino',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (data) => data.destinationType === 'event',
      },
    },
    {
      name: 'internalPath',
      label: 'Caminho interno',
      type: 'text',
      admin: {
        description: 'Caminho da página interna, por exemplo: /agenda.',
        condition: (data) => data.destinationType === 'internal',
      },
    },
    {
      name: 'externalUrl',
      label: 'URL externa',
      type: 'text',
      validate: validateExternalUrl,
      admin: {
        condition: (data) => data.destinationType === 'external',
      },
    },
    {
      name: 'placement',
      label: 'Locais de exibição',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Página inicial', value: 'home' },
        { label: 'Comunicação', value: 'communication' },
      ],
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'startsAt',
      label: 'Início da exibição',
      type: 'date',
    },
    {
      name: 'endsAt',
      label: 'Fim da exibição',
      type: 'date',
    },
    ...editorialFields(),
  ],
}
