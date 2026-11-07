import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

export const SacramentGuides: CollectionConfig = {
  slug: 'sacrament-guides',
  labels: { singular: 'Guia de sacramento', plural: 'Guias de sacramentos' },
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
      name: 'guideType',
      label: 'Tipo de guia',
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
      label: 'Introdução',
      type: 'richText',
    },
    {
      name: 'sections',
      label: 'Seções',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Título',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          label: 'Conteúdo',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'requirements',
      label: 'Requisitos',
      type: 'array',
      fields: [
        {
          name: 'text',
          label: 'Requisito',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'contactInfo',
      label: 'Informações de contato',
      type: 'richText',
    },
    {
      name: 'formType',
      label: 'Tipo de formulário',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'Batismo', value: 'baptism' },
        { label: 'Matrimônio', value: 'marriage' },
      ],
    },
    {
      name: 'updatedAt',
      label: 'Atualizado em',
      type: 'date',
    },
    ...editorialFields(),
  ],
}
