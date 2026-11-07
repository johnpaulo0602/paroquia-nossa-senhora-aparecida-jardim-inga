import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const ContributionPage: GlobalConfig = {
  slug: 'contribution-page',
  label: 'Página de contribuição',
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
    { name: 'body', label: 'Texto', type: 'richText' },
    { name: 'donationNotice', label: 'Aviso sobre doação', type: 'textarea' },
  ],
}
