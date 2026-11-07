import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navegação',
  admin: {
    group: 'Configuração',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'headerGroups',
      label: 'Grupos do cabeçalho',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Rótulo',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Rótulo',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
            },
            {
              name: 'external',
              label: 'Link externo',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
    {
      name: 'headerCta',
      label: 'Chamada do cabeçalho',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Rótulo',
          type: 'text',
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
        },
      ],
    },
    {
      name: 'footerGroups',
      label: 'Grupos do rodapé',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Rótulo',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Rótulo',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
            },
            {
              name: 'external',
              label: 'Link externo',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
  ],
}
