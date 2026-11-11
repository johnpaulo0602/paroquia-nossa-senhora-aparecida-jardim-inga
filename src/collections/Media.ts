import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticatedField, isAdminOrEditor } from '@/access'
import { makeBlurDataURL } from '@/lib/blur'

/** Regenerates the blur preview whenever a file is uploaded or replaced. */
const generateBlur: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (req.file?.data && req.file.mimetype?.startsWith('image/')) {
    data.blurData = await makeBlurDataURL(req.file.data)
  }
  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídias' },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'mediaType', 'usageAuthorized'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [generateBlur],
  },
  fields: [
    {
      name: 'alt',
      label: 'Descrição alternativa',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      label: 'Legenda',
      type: 'text',
    },
    {
      name: 'credit',
      label: 'Crédito ou autoria',
      type: 'text',
    },
    {
      name: 'source',
      label: 'Fonte ou origem',
      type: 'text',
    },
    {
      name: 'mediaType',
      label: 'Tipo de imagem',
      type: 'select',
      required: true,
      defaultValue: 'photograph',
      options: [
        { label: 'Fotografia', value: 'photograph' },
        { label: 'Ilustração', value: 'illustration' },
        { label: 'Documento', value: 'document' },
        { label: 'Arte de divulgação', value: 'artwork' },
      ],
    },
    {
      name: 'recordedAt',
      label: 'Data do registro',
      type: 'date',
      admin: { description: 'Deixe em branco se a data for desconhecida.' },
    },
    {
      name: 'usageAuthorized',
      label: 'Uso autorizado',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'blurData',
      label: 'Prévia desfocada',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
        description: 'Gerada automaticamente no upload; usada enquanto a imagem carrega.',
      },
    },
    {
      name: 'internalNotes',
      label: 'Observações internas',
      type: 'textarea',
      access: { read: authenticatedField },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
    ],
  },
}
