import type { Field, TextFieldSingleValidation } from 'payload'

/** Pages of the site, by the name shown in the menu. Keep in sync with `src/app/(frontend)`. */
export const sitePageOptions = [
  { label: 'Página inicial', value: '/' },
  { label: 'Notícias', value: '/comunicacao' },
  { label: 'Agenda', value: '/agenda' },
  { label: 'Missas e horários', value: '/horarios' },
  { label: 'Secretaria paroquial', value: '/secretaria' },
  { label: 'Contato', value: '/contato' },
  { label: 'Nossa história', value: '/paroquia' },
  { label: 'Nossa padroeira', value: '/padroeira' },
  { label: 'Clero e equipe', value: '/equipe' },
  { label: 'Comunidades', value: '/comunidades' },
  { label: 'Todos os sacramentos', value: '/vida' },
  { label: 'Batismo', value: '/vida/batismo' },
  { label: 'Catequese e crisma', value: '/vida/catequese' },
  { label: 'Matrimônio', value: '/vida/matrimonio' },
  { label: 'Pastorais e movimentos', value: '/vida/pastorais' },
  { label: 'In Cordibus Pastorum', value: '/vida/in-cordibus-pastorum' },
  { label: 'Espiritualidade', value: '/vida/espiritualidade' },
  { label: 'Mural do dízimo', value: '/vida/mural-do-dizimo' },
  { label: 'Projetos e parcerias', value: '/projetos' },
  { label: 'Dízimo e doações', value: '/contribuir' },
]

export const validateWebAddress: TextFieldSingleValidation = (value) => {
  if (!value) return true

  try {
    const url = new URL(value)
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    // Falls through to the message below.
  }

  return 'Cole o endereço completo, começando com https://'
}

/** A page of this site, picked from a list. */
export const sitePageField = (condition: (data: Record<string, unknown>) => boolean): Field => ({
  name: 'internalPath',
  label: 'Qual página do site?',
  type: 'select',
  options: sitePageOptions,
  admin: { condition },
})

/** An address on another site. */
export const externalLinkField = (
  condition: (data: Record<string, unknown>) => boolean,
): Field => ({
  name: 'externalUrl',
  label: 'Endereço do outro site',
  type: 'text',
  validate: validateWebAddress,
  admin: {
    condition,
    placeholder: 'https://',
    description: 'Copie o endereço da barra do navegador e cole aqui.',
  },
})
