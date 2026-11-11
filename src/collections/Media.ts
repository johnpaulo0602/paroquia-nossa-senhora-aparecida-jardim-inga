import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticatedField, contentRoles, hiddenUnless, isAdminOrEditor } from '@/access'
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
  labels: { singular: 'Imagem', plural: 'Imagens' },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'credit'],
    group: 'Imagens',
    hidden: hiddenUnless(...contentRoles),
    description: 'Todas as fotos e artes usadas no site. Para enviar, só a descrição é obrigatória.',
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
      label: 'O que aparece na imagem?',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Ex.: Fiéis na procissão da padroeira em frente à matriz',
        description:
          'Uma frase curta. É lida em voz alta para quem não enxerga e ajuda o site a aparecer no Google.',
      },
    },
    {
      name: 'credit',
      label: 'Quem fez a foto ou a arte?',
      type: 'text',
      admin: { placeholder: 'Ex.: Pastoral da Comunicação' },
    },
    {
      type: 'collapsible',
      label: 'Mais informações (opcional)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'caption',
          label: 'Legenda',
          type: 'text',
          admin: { description: 'Texto mostrado abaixo da imagem em algumas páginas.' },
        },
        {
          name: 'usageAuthorized',
          label: 'As pessoas que aparecem autorizaram o uso da imagem',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'recordedAt',
          label: 'Quando a foto foi feita',
          type: 'date',
          admin: { date: { displayFormat: 'dd/MM/yyyy' } },
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
          name: 'source',
          label: 'De onde veio a imagem',
          type: 'text',
        },
        {
          name: 'internalNotes',
          label: 'Anotações internas',
          type: 'textarea',
          access: { read: authenticatedField },
          admin: { description: 'Não aparece no site.' },
        },
      ],
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
