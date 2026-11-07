import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const Pastorals: CollectionConfig = {
  slug: 'pastorals',
  labels: { singular: 'Pastoral', plural: 'Pastorais' },
  admin: {
    useAsTitle: 'title',
    group: 'Vida cristã',
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
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'mission',
      label: 'Missão',
      type: 'richText',
    },
    {
      name: 'activities',
      label: 'Atividades',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Título',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Descrição',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'coordinators',
      label: 'Coordenadores',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
    },
    {
      name: 'meetingInfo',
      label: 'Informações de encontros',
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
        {
          name: 'time',
          label: 'Horário',
          type: 'text',
          validate: (value: string | null | undefined) =>
            !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? true : 'Use o formato HH:mm.',
          admin: { description: 'Formato HH:mm.' },
        },
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
      label: 'Requisitos',
      type: 'richText',
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'communities',
      label: 'Comunidades',
      type: 'relationship',
      relationTo: 'communities',
      hasMany: true,
    },
    {
      name: 'contactViaSecretariat',
      label: 'Contato pela secretaria',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
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
