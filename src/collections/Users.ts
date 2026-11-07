import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administração',
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
      label: 'Função',
      type: 'select',
      required: true,
      defaultValue: 'contributor',
      saveToJWT: true,
      options: [
        { label: 'Administrador técnico', value: 'admin' },
        { label: 'Editor — pode publicar', value: 'editor' },
        { label: 'Colaborador — cria rascunhos', value: 'contributor' },
        { label: 'Secretaria — atendimento privado', value: 'secretary' },
      ],
    },
  ],
}
