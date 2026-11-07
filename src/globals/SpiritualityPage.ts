import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const SpiritualityPage: GlobalConfig = {
  slug: 'spirituality-page',
  label: 'Página de espiritualidade',
  admin: {
    group: 'Páginas',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text' },
    { name: 'intro', label: 'Introdução', type: 'textarea' },
    { name: 'heroImage', label: 'Imagem de destaque', type: 'upload', relationTo: 'media' },
    { name: 'heroTitle', label: 'Título de destaque', type: 'text' },
    { name: 'heroBody', label: 'Texto de destaque', type: 'textarea' },
    {
      name: 'practices',
      label: 'Práticas',
      type: 'array',
      fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'body', label: 'Texto', type: 'textarea' },
        { name: 'icon', label: 'Ícone', type: 'text' },
      ],
    },
  ],
}
