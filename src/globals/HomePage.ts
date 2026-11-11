import type { Field, GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'
import { previewURL } from '@/lib/preview'

const iconOptions = [
  { label: 'Cruz', value: 'cross' },
  { label: 'Relógio', value: 'clock' },
  { label: 'Igreja', value: 'church' },
  { label: 'Livro aberto', value: 'book-open' },
  { label: 'Gota de água', value: 'droplet' },
  { label: 'Chama', value: 'flame' },
  { label: 'Coração', value: 'heart' },
  { label: 'Aperto de mãos', value: 'heart-handshake' },
  { label: 'Pessoas', value: 'users' },
  { label: 'Telefone', value: 'phone' },
  { label: 'Envelope', value: 'mail' },
  { label: 'Balão de conversa', value: 'message-circle' },
  { label: 'Localização no mapa', value: 'map-pin' },
  { label: 'Calendário', value: 'calendar-days' },
]

const linkField: Field = {
  name: 'url',
  label: 'Para onde leva',
  type: 'text',
  admin: {
    placeholder: '/horarios ou https://...',
    description:
      'Para uma página deste site, use o final do endereço (ex.: /horarios). Para outro site, cole o endereço completo.',
  },
}

/** Title, intro and on/off switch shared by most sections of the home page. */
const section = (
  key: string,
  options: { title: string; intro: string; show: string },
): Field[] => [
  {
    name: options.show,
    label: 'Mostrar esta seção na página inicial',
    type: 'checkbox',
    defaultValue: true,
  },
  { name: `${key}Title`, label: options.title, type: 'text' },
  { name: `${key}Intro`, label: options.intro, type: 'textarea' },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Página inicial',
  admin: {
    group: 'Páginas do site',
    description:
      'Os títulos e textos de cada parte da página inicial. As notícias, os eventos e os banners que aparecem nela são cadastrados nos seus próprios menus.',
    livePreview: { url: () => previewURL('/') },
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Atalhos do topo',
          description: 'Os botões logo abaixo do carrossel de banners.',
          fields: [
            {
              name: 'serviceLinks',
              label: 'Atalhos',
              labels: { singular: 'Atalho', plural: 'Atalhos' },
              type: 'array',
              fields: [
                { name: 'title', label: 'Título', type: 'text' },
                { name: 'description', label: 'Frase curta', type: 'textarea' },
                linkField,
                { name: 'icon', label: 'Ícone', type: 'select', options: iconOptions },
              ],
            },
          ],
        },
        {
          label: 'Notícias',
          fields: section('communication', {
            title: 'Título da seção',
            intro: 'Texto de apoio',
            show: 'showCommunication',
          }),
        },
        {
          label: 'Conheça a paróquia',
          description: 'O bloco com a foto da matriz.',
          fields: [
            { name: 'participationTitle', label: 'Título', type: 'text' },
            { name: 'participationBody', label: 'Texto', type: 'textarea' },
            {
              name: 'participationImage',
              label: 'Foto',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Agenda',
          fields: [
            {
              name: 'showAgenda',
              label: 'Mostrar os próximos eventos na página inicial',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Sacramentos',
          fields: section('sacraments', {
            title: 'Título da seção',
            intro: 'Texto de apoio',
            show: 'showSacraments',
          }),
        },
        {
          label: 'Comunidades',
          fields: section('communities', {
            title: 'Título da seção',
            intro: 'Texto de apoio',
            show: 'showCommunities',
          }),
        },
        {
          label: 'Projetos e parcerias',
          fields: section('projects', {
            title: 'Título da seção',
            intro: 'Texto de apoio',
            show: 'showProjects',
          }),
        },
        {
          label: 'Nossos patrocinadores',
          fields: section('sponsors', {
            title: 'Título da seção',
            intro: 'Texto de apoio',
            show: 'showSponsors',
          }),
        },
        {
          label: 'Vida de fé',
          description: 'A última seção da página, com links para oração e formação.',
          fields: [
            ...section('faith', {
              title: 'Título da seção',
              intro: 'Texto de apoio',
              show: 'showFaith',
            }),
            {
              name: 'faithLinks',
              label: 'Links',
              labels: { singular: 'Link', plural: 'Links' },
              type: 'array',
              fields: [
                { name: 'title', label: 'Título', type: 'text' },
                { name: 'description', label: 'Frase curta', type: 'textarea' },
                linkField,
              ],
            },
          ],
        },
      ],
    },
  ],
}
