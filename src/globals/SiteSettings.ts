import type { Field, GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access'
import { validateWebAddress } from '@/fields/links'
import { timeField } from '@/fields/time'

const webAddress = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'text',
  validate: validateWebAddress,
  admin: { placeholder: 'https://', description },
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Dados da paróquia',
  admin: {
    group: 'Configurações',
    description:
      'Nome, endereço, telefones, redes sociais e horário da secretaria. Estes dados aparecem no rodapé e nas páginas Secretaria e Contato.',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identificação',
          fields: [
            {
              name: 'name',
              label: 'Nome da paróquia',
              type: 'text',
              required: true,
            },
            {
              name: 'shortName',
              label: 'Nome curto',
              type: 'text',
              admin: { description: 'Usado onde há pouco espaço, como no menu do celular.' },
            },
            {
              name: 'logo',
              label: 'Logotipo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              type: 'row',
              fields: [
                { name: 'diocese', label: 'Diocese', type: 'text', admin: { width: '50%' } },
                { name: 'forania', label: 'Forania', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Endereço e contatos',
          fields: [
            {
              name: 'address',
              label: 'Endereço',
              type: 'textarea',
            },
            {
              name: 'postalCode',
              label: 'CEP',
              type: 'text',
              admin: { placeholder: '00000-000' },
            },
            webAddress(
              'mapUrl',
              'Link do Google Maps',
              'No Google Maps, toque em Compartilhar, copie o link e cole aqui.',
            ),
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  label: 'Telefone',
                  type: 'text',
                  admin: { width: '50%', placeholder: '(61) 3000-0000' },
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp',
                  type: 'text',
                  admin: { width: '50%', placeholder: '(61) 90000-0000' },
                },
              ],
            },
            {
              name: 'email',
              label: 'E-mail',
              type: 'email',
            },
          ],
        },
        {
          label: 'Redes sociais',
          fields: [
            webAddress('instagramUrl', 'Instagram'),
            webAddress('facebookUrl', 'Facebook'),
            webAddress(
              'liturgyUrl',
              'Liturgia diária',
              'Site aberto pelo botão "Liturgia diária" da página Espiritualidade.',
            ),
          ],
        },
        {
          label: 'Horário da secretaria',
          fields: [
            {
              name: 'secretariatHours',
              label: 'Dias de atendimento',
              labels: { singular: 'Dia', plural: 'Dias' },
              type: 'array',
              admin: {
                description:
                  'Um item por dia. Se a secretaria fecha para o almoço, preencha também a volta e a saída da tarde.',
              },
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
                  type: 'row',
                  fields: [
                    timeField({ name: 'opensAt', label: 'Abre às', width: '25%' }),
                    timeField({ name: 'closesAt', label: 'Fecha às', width: '25%' }),
                    timeField({ name: 'secondOpensAt', label: 'Reabre às', width: '25%' }),
                    timeField({ name: 'secondClosesAt', label: 'Encerra às', width: '25%' }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Doações',
          fields: [
            {
              name: 'donationInfo',
              label: 'Como doar',
              type: 'richText',
              admin: {
                description:
                  'Aparece na página Dízimo e doações. Informe apenas canais confirmados pela paróquia.',
              },
            },
          ],
        },
      ],
    },
  ],
}
