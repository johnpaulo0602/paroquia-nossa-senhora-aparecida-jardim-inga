import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do site',
  admin: {
    group: 'Configuração',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'shortName',
      label: 'Nome curto',
      type: 'text',
    },
    {
      name: 'logo',
      label: 'Logotipo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'diocese',
      label: 'Diocese',
      type: 'text',
    },
    {
      name: 'forania',
      label: 'Forania',
      type: 'text',
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea',
    },
    {
      name: 'postalCode',
      label: 'CEP',
      type: 'text',
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      type: 'text',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
    },
    {
      name: 'mapUrl',
      label: 'URL do mapa',
      type: 'text',
    },
    {
      name: 'instagramUrl',
      label: 'URL do Instagram',
      type: 'text',
    },
    {
      name: 'facebookUrl',
      label: 'URL do Facebook',
      type: 'text',
    },
    {
      name: 'liturgyUrl',
      label: 'URL da liturgia',
      type: 'text',
    },
    {
      name: 'secretariatHours',
      label: 'Horários da secretaria',
      type: 'array',
      fields: [
        {
          name: 'weekday',
          label: 'Dia da semana',
          type: 'select',
          required: true,
          options: [
            { label: 'Segunda-feira', value: 'monday' },
            { label: 'Terça-feira', value: 'tuesday' },
            { label: 'Quarta-feira', value: 'wednesday' },
            { label: 'Quinta-feira', value: 'thursday' },
            { label: 'Sexta-feira', value: 'friday' },
            { label: 'Sábado', value: 'saturday' },
            { label: 'Domingo', value: 'sunday' },
          ],
        },
        {
          name: 'opensAt',
          label: 'Abertura',
          type: 'text',
          admin: { description: 'Formato HH:mm.' },
        },
        {
          name: 'closesAt',
          label: 'Fechamento',
          type: 'text',
          admin: { description: 'Formato HH:mm.' },
        },
        {
          name: 'secondOpensAt',
          label: 'Segunda abertura',
          type: 'text',
          admin: { description: 'Formato HH:mm.' },
        },
        {
          name: 'secondClosesAt',
          label: 'Segundo fechamento',
          type: 'text',
          admin: { description: 'Formato HH:mm.' },
        },
      ],
    },
    {
      name: 'donationInfo',
      label: 'Informações para doação',
      type: 'richText',
    },
  ],
}
