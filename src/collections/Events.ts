import { APIError, slugField } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

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

const validateDateRange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const startsAt = 'startsAt' in data ? data.startsAt : originalDoc?.startsAt
  const endsAt = 'endsAt' in data ? data.endsAt : originalDoc?.endsAt

  if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw new APIError('A data de término deve ser posterior à data de início.', 400)
  }

  return data
}

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Evento', plural: 'Eventos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startsAt', 'community', '_status'],
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
    beforeChange: [enforcePublishPermission, validateDateRange],
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'summary',
      label: 'Resumo',
      type: 'textarea',
    },
    {
      name: 'body',
      label: 'Conteúdo',
      type: 'richText',
    },
    {
      name: 'startsAt',
      label: 'Início',
      type: 'date',
      required: true,
    },
    {
      name: 'endsAt',
      label: 'Término',
      type: 'date',
      required: true,
    },
    {
      name: 'community',
      label: 'Comunidade',
      type: 'relationship',
      relationTo: 'communities',
    },
    {
      name: 'locationText',
      label: 'Local',
      type: 'text',
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'participationInfo',
      label: 'Informações de participação',
      type: 'richText',
    },
    {
      name: 'registrationUrl',
      label: 'URL de inscrição',
      type: 'text',
      validate: validateURL,
    },
    {
      name: 'archived',
      label: 'Arquivado',
      type: 'checkbox',
      defaultValue: false,
    },
    ...editorialFields(),
  ],
}
