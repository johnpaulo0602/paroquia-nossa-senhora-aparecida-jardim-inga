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

const validatePeriod: CollectionBeforeChangeHook = ({ data }) => {
  if (
    data.startsAt &&
    data.endsAt &&
    new Date(data.endsAt).getTime() < new Date(data.startsAt).getTime()
  ) {
    throw new APIError('A data "Mostrar até" precisa ser depois de "Mostrar a partir de".', 400)
  }

  return data
}

export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: { singular: 'Aviso', plural: 'Avisos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contexts', 'startsAt', 'endsAt', '_status'],
    group: 'Notícias e avisos',
    hidden: hiddenUnless(...contentRoles),
    description: 'Recados curtos mostrados em uma faixa no topo das páginas escolhidas.',
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
      label: 'Nome do aviso (só para o painel)',
      type: 'text',
      admin: {
        placeholder: 'Ex.: Mudança de horário na Semana Santa',
        description: 'Serve para você encontrar o aviso depois. Não aparece no site.',
      },
    },
    {
      name: 'body',
      label: 'Texto do aviso',
      type: 'richText',
      admin: { description: 'Curto e direto: aparece em uma faixa no topo da página.' },
    },
    {
      name: 'contexts',
      label: 'Em quais páginas o aviso aparece?',
      type: 'select',
      hasMany: true,
      defaultValue: ['home'],
      options: [
        { label: 'Página inicial', value: 'home' },
        { label: 'Notícias', value: 'communication' },
        { label: 'Agenda', value: 'agenda' },
        { label: 'Missas e horários', value: 'schedules' },
        { label: 'Secretaria', value: 'secretariat' },
        { label: 'Contato', value: 'contact' },
      ],
    },
    {
      name: 'destinationType',
      label: 'O aviso leva para algum lugar?',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Não, é só o texto', value: 'none' },
        { label: 'Sim, para uma página do site', value: 'internal' },
        { label: 'Sim, para outro site', value: 'external' },
      ],
    },
    sitePageField((data) => data.destinationType === 'internal'),
    externalLinkField((data) => data.destinationType === 'external'),
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
        description: 'Depois desta data o aviso sai do site sozinho.',
      },
    },
    {
      name: 'order',
      label: 'Prioridade',
      type: 'number',
      admin: { position: 'sidebar', description: 'Número menor aparece primeiro.' },
    },
    ...editorialFields(),
  ],
}
