import { APIError } from 'payload'
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
import { externalLinkField, sitePageField } from '@/fields/links'

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
    throw new APIError('Escolha para onde o botão do banner leva.', 400)
  }

  return data
}

export const Highlights: CollectionConfig = {
  slug: 'highlights',
  labels: { singular: 'Banner', plural: 'Banners do carrossel' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'placement', 'order', 'startsAt', 'endsAt', '_status'],
    group: 'Notícias e avisos',
    hidden: hiddenUnless(...contentRoles),
    description:
      'As imagens grandes que passam no topo da página inicial e da página Notícias.',
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
      label: 'Título do banner',
      type: 'text',
    },
    {
      name: 'eyebrow',
      label: 'Texto pequeno acima do título',
      type: 'text',
      admin: { placeholder: 'Ex.: Festa da padroeira' },
    },
    {
      name: 'summary',
      label: 'Frase de apoio',
      type: 'textarea',
      admin: { description: 'Uma ou duas linhas abaixo do título.' },
    },
    {
      name: 'image',
      label: 'Imagem de fundo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Prefira imagens largas (paisagem), com pelo menos 1600 pixels de largura.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          label: 'Texto do botão',
          type: 'text',
          admin: { width: '50%', placeholder: 'Ex.: Saiba mais' },
        },
        {
          name: 'destinationType',
          label: 'Para onde o botão leva?',
          type: 'select',
          required: true,
          options: [
            { label: 'Uma notícia', value: 'post' },
            { label: 'Um evento', value: 'event' },
            { label: 'Uma página do site', value: 'internal' },
            { label: 'Outro site', value: 'external' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'post',
      label: 'Qual notícia?',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (data) => data.destinationType === 'post',
      },
    },
    {
      name: 'event',
      label: 'Qual evento?',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (data) => data.destinationType === 'event',
      },
    },
    sitePageField((data) => data.destinationType === 'internal'),
    externalLinkField((data) => data.destinationType === 'external'),
    {
      name: 'placement',
      label: 'Onde o banner aparece?',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['home'],
      options: [
        { label: 'Página inicial', value: 'home' },
        { label: 'Página Notícias', value: 'communication' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startsAt',
      label: 'Mostrar a partir de',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'Deixe em branco para mostrar desde já.',
      },
    },
    {
      name: 'endsAt',
      label: 'Mostrar até',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'Deixe em branco para não ter data de saída.',
      },
    },
    {
      name: 'order',
      label: 'Posição no carrossel',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
    },
    ...editorialFields(),
  ],
}
