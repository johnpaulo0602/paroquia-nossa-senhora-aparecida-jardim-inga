import { APIError } from 'payload'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validatePeriod: CollectionBeforeChangeHook = ({ data }) => {
  if (
    data.startsAt &&
    data.endsAt &&
    new Date(data.endsAt).getTime() < new Date(data.startsAt).getTime()
  ) {
    throw new APIError('O fim da exibição deve ser igual ou posterior ao início.', 400)
  }

  return data
}

export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: { singular: 'Aviso', plural: 'Avisos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contexts', 'startsAt', 'endsAt', 'order'],
    group: 'Conteúdo',
  },
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: { beforeChange: [enforcePublishPermission, validatePeriod] },
  fields: [
    {
      name: 'title',
      label: 'Título para uso interno',
      type: 'text',
      admin: {
        description: 'Identifica o aviso no painel administrativo.',
      },
    },
    {
      name: 'body',
      label: 'Texto do aviso',
      type: 'richText',
    },
    {
      name: 'destinationType',
      label: 'Tipo de destino',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'Página interna', value: 'internal' },
        { label: 'Endereço externo', value: 'external' },
      ],
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
      admin: {
        condition: (data) => data.destinationType === 'external',
      },
    },
    {
      name: 'contexts',
      label: 'Contextos de exibição',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Página inicial', value: 'home' },
        { label: 'Comunicação', value: 'communication' },
        { label: 'Agenda', value: 'agenda' },
        { label: 'Horários', value: 'schedules' },
        { label: 'Secretaria', value: 'secretariat' },
        { label: 'Contato', value: 'contact' },
      ],
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
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
    },
    ...editorialFields(),
  ],
}
