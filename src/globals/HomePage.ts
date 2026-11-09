import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Página inicial',
  admin: {
    group: 'Páginas',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'serviceLinks',
      label: 'Links de serviços',
      type: 'array',
      fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'description', label: 'Descrição', type: 'textarea' },
        { name: 'url', label: 'URL', type: 'text' },
        {
          name: 'icon',
          label: 'Ícone',
          type: 'text',
          admin: {
            description:
              'Nome de um ícone Lucide: clock, cross, church, book-open, droplet, flame, heart-handshake, users, phone, map-pin, waves, crown, calendar-days. Nomes desconhecidos usam o ícone padrão.',
          },
        },
      ],
    },
    { name: 'communicationTitle', label: 'Título de comunicação', type: 'text' },
    { name: 'communicationIntro', label: 'Introdução de comunicação', type: 'textarea' },
    { name: 'participationTitle', label: 'Título de participação', type: 'text' },
    { name: 'participationBody', label: 'Texto de participação', type: 'textarea' },
    {
      name: 'participationImage',
      label: 'Imagem de participação',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'sacramentsTitle', label: 'Título de sacramentos', type: 'text' },
    { name: 'sacramentsIntro', label: 'Introdução de sacramentos', type: 'textarea' },
    { name: 'communitiesTitle', label: 'Título de comunidades', type: 'text' },
    { name: 'communitiesIntro', label: 'Introdução de comunidades', type: 'textarea' },
    { name: 'projectsTitle', label: 'Título de projetos', type: 'text' },
    { name: 'projectsIntro', label: 'Introdução de projetos', type: 'textarea' },
    { name: 'sponsorsTitle', label: 'Título de patrocinadores', type: 'text' },
    { name: 'sponsorsIntro', label: 'Introdução de patrocinadores', type: 'textarea' },
    { name: 'faithTitle', label: 'Título de fé', type: 'text' },
    { name: 'faithIntro', label: 'Introdução de fé', type: 'textarea' },
    {
      name: 'faithLinks',
      label: 'Links de fé',
      type: 'array',
      fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'description', label: 'Descrição', type: 'textarea' },
        { name: 'url', label: 'URL', type: 'text' },
      ],
    },
    {
      name: 'showCommunication',
      label: 'Exibir comunicação',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showAgenda',
      label: 'Exibir agenda',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSacraments',
      label: 'Exibir sacramentos',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showCommunities',
      label: 'Exibir comunidades',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showProjects',
      label: 'Exibir projetos',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSponsors',
      label: 'Exibir patrocinadores',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showFaith',
      label: 'Exibir fé',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
