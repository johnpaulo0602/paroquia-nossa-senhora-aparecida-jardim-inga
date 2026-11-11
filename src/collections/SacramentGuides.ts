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

export const SacramentGuides: CollectionConfig = {
  slug: 'sacrament-guides',
  labels: { singular: 'Sacramento', plural: 'Sacramentos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'guideType', '_status'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description:
      'As orientações das páginas Batismo, Catequese e crisma e Matrimônio: o que é, o que é preciso e com quem falar.',
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
      label: 'Nome da página',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'guideType',
      label: 'Qual sacramento?',
      type: 'select',
      options: [
        { label: 'Batismo', value: 'baptism' },
        { label: 'Matrimônio', value: 'marriage' },
        { label: 'Catequese', value: 'catechesis' },
        { label: 'Geral', value: 'general' },
      ],
    },
    {
      name: 'intro',
      label: 'Apresentação',
      type: 'richText',
    },
    {
      name: 'sections',
      label: 'Blocos de texto da página',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Título do bloco',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          label: 'Texto',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'requirements',
      label: 'O que é preciso',
      admin: { description: 'Um item por linha: documentos, idade, cursos, prazos.' },
      type: 'array',
      fields: [
        {
          name: 'text',
          label: 'Item',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'contactInfo',
      label: 'Com quem falar',
      type: 'richText',
    },
    {
      name: 'formType',
      label: 'Formulário de pedido na página',
      admin: { position: 'sidebar', description: 'Qual formulário o visitante pode preencher nesta página.' },
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Nenhum formulário', value: 'none' },
        { label: 'Batismo', value: 'baptism' },
        { label: 'Matrimônio', value: 'marriage' },
      ],
    },
    {
      name: 'updatedAt',
      label: 'Atualizado em',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
      type: 'date',
    },
    ...editorialFields(),
  ],
}
