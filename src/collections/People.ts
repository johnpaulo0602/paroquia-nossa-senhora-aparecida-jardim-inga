import { slugField } from 'payload'
import type { CollectionConfig, FieldAccess } from 'payload'

import {
  canEditContent,
  contentRoles,
  enforcePublishPermission,
  hiddenUnless,
  isAdminOrEditor,
  readPublicContent,
} from '@/access'
import { editorialFields } from '@/fields/editorial'

const canReadPublicContact: FieldAccess = ({ req, siblingData }) =>
  Boolean(req.user || siblingData?.publicContactAuthorized)

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Pessoa', plural: 'Clero e equipe' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'roleTitle', 'roleType', 'current'],
    group: 'A paróquia',
    hidden: hiddenUnless(...contentRoles),
    description:
      'Padres, diáconos e pessoas da equipe. Quem estiver marcado como "Mostrar no site" aparece na página Clero e equipe.',
  },
  defaultSort: 'order',
  access: {
    read: readPublicContent,
    create: canEditContent,
    update: canEditContent,
    delete: isAdminOrEditor,
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [enforcePublishPermission],
  },
  fields: [
    {
      name: 'name',
      label: 'Nome completo',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'row',
      fields: [
        {
          name: 'roleTitle',
          label: 'Função na paróquia',
          type: 'text',
          admin: {
            width: '50%',
            placeholder: 'Ex.: Pároco, Vigário, Secretária paroquial',
          },
        },
        {
          name: 'roleType',
          label: 'Grupo',
          type: 'select',
          defaultValue: 'service',
          options: [
            { label: 'Clero (padres e diáconos)', value: 'clergy' },
            { label: 'Administração', value: 'administration' },
            { label: 'Pastoral', value: 'pastoral' },
            { label: 'Serviço e atendimento', value: 'service' },
          ],
          admin: {
            width: '50%',
            description: 'O clero aparece em destaque no topo da página.',
          },
        },
      ],
    },
    {
      name: 'photo',
      label: 'Foto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'biography',
      label: 'Sobre a pessoa',
      type: 'richText',
      admin: { description: 'Opcional. Um texto curto de apresentação.' },
    },
    {
      name: 'area',
      label: 'Onde atua',
      type: 'text',
      admin: { placeholder: 'Ex.: Matriz, Comunidade São Pedro e São Paulo' },
    },
    {
      type: 'collapsible',
      label: 'Contato direto (opcional)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'publicEmail',
          label: 'E-mail',
          type: 'email',
          access: { read: canReadPublicContact },
        },
        {
          name: 'publicPhone',
          label: 'Telefone',
          type: 'text',
          access: { read: canReadPublicContact },
          admin: { placeholder: '(61) 90000-0000' },
        },
        {
          name: 'publicContactAuthorized',
          label: 'A pessoa autorizou mostrar este contato no site',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Sem esta autorização, o site mostra apenas o contato da secretaria.',
          },
        },
      ],
    },
    {
      name: 'current',
      label: 'Mostrar no site',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Desmarque quando a pessoa deixar a função.',
      },
    },
    {
      name: 'order',
      label: 'Posição na página',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Número menor aparece primeiro.',
      },
    },
    ...editorialFields(),
  ],
}
