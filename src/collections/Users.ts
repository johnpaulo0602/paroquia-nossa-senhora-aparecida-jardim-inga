import type { CollectionConfig } from 'payload'

import { hiddenUnless, isAdmin, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Configurações',
    hidden: hiddenUnless('admin'),
    description: 'Quem pode entrar no painel e o que cada pessoa pode fazer.',
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
    },
    {
      name: 'role',
      label: 'O que esta pessoa pode fazer?',
      type: 'select',
      required: true,
      defaultValue: 'contributor',
      saveToJWT: true,
      options: [
        { label: 'Administrador — acesso total', value: 'admin' },
        { label: 'Editor — escreve e publica', value: 'editor' },
        { label: 'Colaborador — escreve, mas não publica', value: 'contributor' },
        { label: 'Secretaria — vê as mensagens recebidas', value: 'secretary' },
      ],
    },
  ],
}
