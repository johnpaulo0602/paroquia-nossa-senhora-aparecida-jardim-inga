import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'
import { previewURL } from '@/lib/preview'

export const SecretariatPage: GlobalConfig = {
  slug: 'secretariat-page',
  label: 'Página Secretaria',
  admin: {
    group: 'Páginas do site',
    description: 'Textos da página Secretaria paroquial. O horário e os contatos vêm de Dados da paróquia.',
    livePreview: { url: () => previewURL('/secretaria') },
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'title', label: 'Título da página', type: 'text' },
    { name: 'intro', label: 'Texto de abertura', type: 'textarea' },
    { name: 'specialCelebrationsTitle', label: 'Celebrações especiais: título', type: 'text' },
    {
      name: 'specialCelebrationsBody',
      label: 'Celebrações especiais: texto',
      type: 'textarea',
    },
    {
      name: 'specialCelebrationsImage',
      label: 'Celebrações especiais: imagem',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
