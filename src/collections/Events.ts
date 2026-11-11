import { APIError, slugField } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

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
    group: 'Missas e agenda',
    hidden: hiddenUnless(...contentRoles),
    description: 'Festas, encontros, retiros e reuniões. Aparecem na página Agenda.',
    livePreview: { url: ({ data }) => previewURL(`/eventos/${data.slug}`) },
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  hooks: {
    beforeChange: [enforcePublishPermission, validateDateRange],
  },
  fields: [
    {
      name: 'title',
      label: 'Nome do evento',
      type: 'text',
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'summary',
      label: 'Resumo',
      admin: { description: 'Uma ou duas frases. Aparece nos cartões da Agenda.' },
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
      admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
      type: 'date',
      required: true,
    },
    {
      name: 'endsAt',
      label: 'Termina em',
      admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
      type: 'date',
      required: true,
    },
    {
      name: 'community',
      label: 'Em qual igreja ou comunidade?',
      type: 'relationship',
      relationTo: 'communities',
    },
    {
      name: 'locationText',
      label: 'Local (se for em outro lugar)',
      admin: { placeholder: 'Ex.: Salão paroquial' },
      type: 'text',
    },
    {
      name: 'cover',
      label: 'Imagem do evento',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'participationInfo',
      label: 'Como participar',
      type: 'richText',
    },
    {
      name: 'registrationUrl',
      label: 'Link de inscrição',
      admin: { placeholder: 'https://' },
      type: 'text',
      validate: validateURL,
    },
    {
      name: 'archived',
      label: 'Esconder da Agenda',
      admin: { position: 'sidebar', description: 'Marque para tirar o evento do site sem apagar.' },
      type: 'checkbox',
      defaultValue: false,
    },
    ...editorialFields(),
  ],
}
