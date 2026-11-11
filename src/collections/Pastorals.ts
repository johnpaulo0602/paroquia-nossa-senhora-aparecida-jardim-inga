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
import { timeField } from '@/fields/time'
import { previewURL } from '@/lib/preview'

export const Pastorals: CollectionConfig = {
  slug: 'pastorals',
  labels: { singular: 'Pastoral ou movimento', plural: 'Pastorais e movimentos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', '_status'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description: 'Cada pastoral, movimento ou grupo tem a sua página no site.',
    livePreview: { url: ({ data }) => previewURL(`/pastorais/${data.slug}`) },
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
      name: 'title',
      label: 'Nome da pastoral ou movimento',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'mission',
      label: 'Missão',
      admin: { description: 'O que a pastoral faz e por quê.' },
      type: 'richText',
    },
    {
      name: 'activities',
      label: 'O que a pastoral faz',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Atividade',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Explicação',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'coordinators',
      label: 'Quem coordena',
      admin: { description: 'Escolha entre as pessoas cadastradas em Clero e equipe.' },
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
    },
    {
      name: 'meetingInfo',
      label: 'Dias e horários dos encontros',
      type: 'array',
      fields: [
        {
          name: 'weekday',
          label: 'Dia da semana',
          type: 'select',
          options: [
            { label: 'Domingo', value: 'sunday' },
            { label: 'Segunda-feira', value: 'monday' },
            { label: 'Terça-feira', value: 'tuesday' },
            { label: 'Quarta-feira', value: 'wednesday' },
            { label: 'Quinta-feira', value: 'thursday' },
            { label: 'Sexta-feira', value: 'friday' },
            { label: 'Sábado', value: 'saturday' },
          ],
        },
        timeField({ name: 'time', label: 'Horário' }),
        {
          name: 'location',
          label: 'Local',
          type: 'text',
        },
      ],
    },
    {
      name: 'participationInfo',
      label: 'Como participar',
      type: 'richText',
    },
    {
      name: 'requirements',
      label: 'O que é preciso para participar',
      type: 'richText',
    },
    {
      name: 'cover',
      label: 'Imagem da pastoral',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'communities',
      label: 'Em quais comunidades atua',
      type: 'relationship',
      relationTo: 'communities',
      hasMany: true,
    },
    {
      name: 'contactViaSecretariat',
      label: 'O contato é feito pela secretaria',
      admin: { position: 'sidebar' },
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      label: 'Posição na lista',
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
      type: 'number',
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
