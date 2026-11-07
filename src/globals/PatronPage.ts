import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const PatronPage: GlobalConfig = {
  slug: 'patron-page',
  label: 'Página da padroeira',
  admin: {
    group: 'Páginas',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'eyebrow', label: 'Antetítulo', type: 'text' },
    { name: 'title', label: 'Título', type: 'text' },
    { name: 'intro', label: 'Introdução', type: 'textarea' },
    { name: 'cover', label: 'Capa', type: 'upload', relationTo: 'media' },
    { name: 'coverCaption', label: 'Legenda da capa', type: 'text' },
    { name: 'readingTitle', label: 'Título da leitura', type: 'text' },
    { name: 'readingBody', label: 'Texto da leitura', type: 'textarea' },
    { name: 'readingUrl', label: 'URL da leitura', type: 'text' },
    {
      name: 'facts',
      label: 'Fatos',
      type: 'array',
      fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'body', label: 'Texto', type: 'textarea' },
        { name: 'icon', label: 'Ícone', type: 'text' },
      ],
    },
    {
      name: 'sources',
      label: 'Fontes',
      type: 'array',
      fields: [
        { name: 'label', label: 'Rótulo', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
      ],
    },
  ],
}
