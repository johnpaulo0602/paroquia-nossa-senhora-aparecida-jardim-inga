import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Página de contato',
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
    { name: 'formIntro', label: 'Introdução do formulário', type: 'textarea' },
  ],
}
