import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const SecretariatPage: GlobalConfig = {
  slug: 'secretariat-page',
  label: 'Página da secretaria',
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
    { name: 'specialCelebrationsTitle', label: 'Título das celebrações especiais', type: 'text' },
    {
      name: 'specialCelebrationsBody',
      label: 'Texto das celebrações especiais',
      type: 'textarea',
    },
    {
      name: 'specialCelebrationsImage',
      label: 'Imagem das celebrações especiais',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
