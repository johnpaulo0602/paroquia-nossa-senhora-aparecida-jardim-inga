import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const HistoryPage: GlobalConfig = {
  slug: 'history-page',
  label: 'Página de história',
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
    { name: 'contributionTitle', label: 'Título da contribuição', type: 'text' },
    { name: 'contributionBody', label: 'Texto da contribuição', type: 'textarea' },
  ],
}
