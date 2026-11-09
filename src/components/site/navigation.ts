import type { Navigation } from '@/payload-types'

/**
 * Default main menu. Used by the header when the CMS has no navigation yet, and by the
 * seed script, so both stay in sync.
 *
 * Rules: Mass times and the calendar are direct links (the most common tasks), a group
 * with one destination is a link (never a one-item dropdown), and no page appears in two
 * groups.
 */
export const defaultHeaderGroups: NonNullable<Navigation['headerGroups']> = [
  {
    label: 'A paróquia',
    links: [
      { label: 'Nossa história', url: '/paroquia' },
      { label: 'Nossa padroeira', url: '/padroeira' },
      { label: 'Clero e equipe', url: '/equipe' },
      { label: 'Comunidades', url: '/comunidades' },
      { label: 'Secretaria paroquial', url: '/secretaria' },
    ],
  },
  { label: 'Missas e horários', links: [{ label: 'Missas e horários', url: '/horarios' }] },
  { label: 'Agenda', links: [{ label: 'Agenda', url: '/agenda' }] },
  {
    label: 'Sacramentos',
    links: [
      { label: 'Batismo', url: '/vida/batismo' },
      { label: 'Catequese e crisma', url: '/vida/catequese' },
      { label: 'Matrimônio', url: '/vida/matrimonio' },
      { label: 'Todos os sacramentos', url: '/vida' },
    ],
  },
  {
    label: 'Participe',
    links: [
      { label: 'Pastorais e movimentos', url: '/vida/pastorais' },
      { label: 'In Cordibus Pastorum', url: '/vida/in-cordibus-pastorum' },
      { label: 'Espiritualidade', url: '/vida/espiritualidade' },
      { label: 'Projetos e parcerias', url: '/projetos' },
      { label: 'Mural do dízimo', url: '/vida/mural-do-dizimo' },
    ],
  },
  { label: 'Notícias', links: [{ label: 'Notícias', url: '/comunicacao' }] },
  { label: 'Contato', links: [{ label: 'Contato', url: '/contato' }] },
]

export const defaultHeaderCta = { label: 'Quero doar', url: '/contribuir' }
