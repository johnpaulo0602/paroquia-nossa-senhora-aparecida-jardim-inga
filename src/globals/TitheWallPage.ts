import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const TitheWallPage: GlobalConfig = {
  slug: 'tithe-wall-page',
  label: 'Página do muro do dízimo',
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
    { name: 'birthdaysTitle', label: 'Título dos aniversariantes', type: 'text' },
    { name: 'birthdaysIntro', label: 'Introdução dos aniversariantes', type: 'textarea' },
    { name: 'titheTitle', label: 'Título do dízimo', type: 'text' },
    { name: 'titheBody', label: 'Texto do dízimo', type: 'richText' },
    {
      name: 'reasons',
      label: 'Motivos',
      type: 'array',
      fields: [{ name: 'title', label: 'Título', type: 'text' }],
    },
    { name: 'interestTitle', label: 'Título de interesse', type: 'text' },
    { name: 'interestBody', label: 'Texto de interesse', type: 'textarea' },
  ],
}
