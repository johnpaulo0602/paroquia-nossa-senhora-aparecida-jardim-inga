import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'
import { previewURL } from '@/lib/preview'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Página Contato',
  admin: {
    group: 'Páginas do site',
    description: 'Textos da página Contato. Telefones e endereço vêm de Dados da paróquia.',
    livePreview: { url: () => previewURL('/contato') },
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'title', label: 'Título da página', type: 'text' },
    { name: 'intro', label: 'Texto de abertura', type: 'textarea' },
    { name: 'formIntro', label: 'Texto acima dos canais de atendimento', type: 'textarea' },
  ],
}
