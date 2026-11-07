import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const PastorumPage: GlobalConfig = {
  slug: 'pastorum-page',
  label: 'Página Pastorum',
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
    { name: 'image', label: 'Imagem', type: 'upload', relationTo: 'media' },
    { name: 'sectionTitle', label: 'Título da seção', type: 'text' },
    { name: 'sectionBody', label: 'Texto da seção', type: 'textarea' },
  ],
}
