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
import { validateWebAddress } from '@/fields/links'
import { previewURL } from '@/lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Notícia', plural: 'Notícias' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'editorialAreas', 'publishedAt', '_status'],
    group: 'Notícias e avisos',
    hidden: hiddenUnless(...contentRoles),
    description:
      'Notícias, artigos, reflexões, álbuns de fotos e vídeos. Aparecem na página Notícias e, conforme a escolha abaixo, em Espiritualidade ou In Cordibus Pastorum.',
    livePreview: {
      url: ({ data }) => {
        const areas: string[] = Array.isArray(data.editorialAreas) ? data.editorialAreas : []
        const base = areas.length && !areas.includes('communication') ? '/reflexoes' : '/comunicacao'
        return previewURL(`${base}/${data.slug}`)
      },
    },
  },
  defaultSort: '-publishedAt',
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 800 } } },
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
      admin: {
        description: 'Uma ou duas frases. Aparece nos cartões da página Notícias.',
      },
    },
    {
      name: 'cover',
      label: 'Imagem principal',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      label: 'Texto',
      type: 'richText',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'format',
          label: 'Tipo de publicação',
          type: 'select',
          required: true,
          defaultValue: 'news',
          options: [
            { label: 'Notícia', value: 'news' },
            { label: 'Artigo ou reflexão', value: 'article' },
            { label: 'Álbum de fotos', value: 'photos' },
            { label: 'Vídeo', value: 'video' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'editorialAreas',
          label: 'Onde aparece no site?',
          type: 'select',
          hasMany: true,
          required: true,
          defaultValue: ['communication'],
          options: [
            { label: 'Notícias', value: 'communication' },
            { label: 'Espiritualidade', value: 'spirituality' },
            { label: 'In Cordibus Pastorum (palavra dos padres)', value: 'pastorum' },
            { label: 'Institucional', value: 'institutional' },
          ],
          admin: { width: '50%', description: 'Pode marcar mais de um lugar.' },
        },
      ],
    },
    {
      name: 'gallery',
      label: 'Fotos do álbum',
      labels: { singular: 'Foto', plural: 'Fotos' },
      type: 'array',
      admin: {
        condition: (data) => data.format === 'photos',
      },
      fields: [
        {
          name: 'image',
          label: 'Foto',
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
      label: 'Endereço do vídeo',
      type: 'text',
      validate: validateWebAddress,
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=...',
        description: 'Copie o endereço do vídeo no YouTube ou em outro site e cole aqui.',
        condition: (data) => data.format === 'video',
      },
    },
    {
      type: 'collapsible',
      label: 'Autor, fonte e relacionados (opcional)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'author',
          label: 'Quem escreveu',
          type: 'relationship',
          relationTo: 'people',
          hasMany: false,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sourceName',
              label: 'Fonte (se o texto veio de outro lugar)',
              type: 'text',
              admin: { width: '50%', placeholder: 'Ex.: CNBB, Vatican News' },
            },
            {
              name: 'sourceUrl',
              label: 'Endereço da fonte',
              type: 'text',
              validate: validateWebAddress,
              admin: { width: '50%', placeholder: 'https://' },
            },
          ],
        },
        {
          name: 'communities',
          label: 'Comunidades citadas',
          type: 'relationship',
          relationTo: 'communities',
          hasMany: true,
        },
        {
          name: 'pastorals',
          label: 'Pastorais citadas',
          type: 'relationship',
          relationTo: 'pastorals',
          hasMany: true,
        },
        {
          name: 'relatedPosts',
          label: 'Leia também',
          type: 'relationship',
          relationTo: 'posts',
          hasMany: true,
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Data da publicação',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
    {
      name: 'category',
      label: 'Assunto',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'Geral', value: 'general' },
        { label: 'Igreja no Brasil', value: 'church-brazil' },
        { label: 'Papa e Vaticano', value: 'pope-vatican' },
        { label: 'Comunidades e pastorais', value: 'communities-pastorals' },
        { label: 'Memória da comunidade', value: 'community-memory' },
      ],
      admin: { position: 'sidebar' },
    },
    ...editorialFields(),
  ],
}
