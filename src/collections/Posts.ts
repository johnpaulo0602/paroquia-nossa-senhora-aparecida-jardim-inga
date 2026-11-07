import { slugField } from 'payload'
import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

import {
  canEditContent,
  enforcePublishPermission,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const validateVideoUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true

  try {
    new URL(value)
    return true
  } catch {
    return 'Informe uma URL de vídeo válida.'
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Publicação', plural: 'Publicações' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'format', 'editorialAreas', 'publishedAt'],
    group: 'Conteúdo',
  },
  defaultSort: '-publishedAt',
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: { beforeChange: [enforcePublishPermission] },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'summary',
      label: 'Resumo',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      label: 'Conteúdo',
      type: 'richText',
      required: true,
    },
    {
      name: 'format',
      label: 'Formato',
      type: 'select',
      required: true,
      options: [
        { label: 'Notícia', value: 'news' },
        { label: 'Artigo', value: 'article' },
        { label: 'Fotos', value: 'photos' },
        { label: 'Vídeo', value: 'video' },
      ],
    },
    {
      name: 'editorialAreas',
      label: 'Áreas editoriais',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Comunicação', value: 'communication' },
        { label: 'Espiritualidade', value: 'spirituality' },
        { label: 'In Cordibus Pastorum', value: 'pastorum' },
        { label: 'Institucional', value: 'institutional' },
      ],
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'Geral', value: 'general' },
        { label: 'Igreja no Brasil', value: 'church-brazil' },
        { label: 'Papa e Vaticano', value: 'pope-vatican' },
        { label: 'Comunidades e pastorais', value: 'communities-pastorals' },
        { label: 'Memória da comunidade', value: 'community-memory' },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Publicado em',
      type: 'date',
    },
    {
      name: 'cover',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      label: 'Galeria de fotos',
      type: 'array',
      admin: {
        description: 'Fotografias exibidas em publicações no formato Fotos.',
        condition: (data) => data.format === 'photos',
      },
      fields: [
        {
          name: 'image',
          label: 'Imagem',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Legenda',
          type: 'text',
        },
      ],
    },
    {
      name: 'videoUrl',
      label: 'URL do vídeo',
      type: 'text',
      validate: validateVideoUrl,
      admin: {
        description: 'Endereço do vídeo para publicações no formato Vídeo.',
        condition: (data) => data.format === 'video',
      },
    },
    {
      name: 'author',
      label: 'Autor',
      type: 'relationship',
      relationTo: 'people',
      hasMany: false,
    },
    {
      name: 'sourceName',
      label: 'Nome da fonte',
      type: 'text',
    },
    {
      name: 'sourceUrl',
      label: 'URL da fonte',
      type: 'text',
    },
    {
      name: 'communities',
      label: 'Comunidades relacionadas',
      type: 'relationship',
      relationTo: 'communities',
      hasMany: true,
    },
    {
      name: 'pastorals',
      label: 'Pastorais relacionadas',
      type: 'relationship',
      relationTo: 'pastorals',
      hasMany: true,
    },
    {
      name: 'relatedPosts',
      label: 'Publicações relacionadas',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
    ...editorialFields(),
  ],
}
