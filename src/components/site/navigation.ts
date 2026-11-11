export type NavLink = { label: string; url: string; external?: boolean }
export type NavGroup = { label: string; links: NavLink[] }

/**
 * Site menus. They live in code, not in the CMS: a wrong link here breaks navigation for
 * every visitor, and the structure changes only when pages are added or removed.
 *
 * Rules: Mass times and the calendar are direct links (the most common tasks), a group
 * with one destination is a link (never a one-item dropdown), and no page appears in two
 * groups.
 */
export const headerGroups: NavGroup[] = [
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

export const headerCta: NavLink = { label: 'Quero doar', url: '/contribuir' }

export const footerGroups: NavGroup[] = [
  {
    label: 'A paróquia',
    links: [
      { label: 'Nossa história', url: '/paroquia' },
      { label: 'Nossa padroeira', url: '/padroeira' },
      { label: 'Estrutura da paróquia', url: '/equipe' },
      { label: 'Comunidades', url: '/comunidades' },
      { label: 'Secretaria', url: '/secretaria' },
    ],
  },
  {
    label: 'Participe',
    links: [
      { label: 'Missas e confissões', url: '/horarios' },
      { label: 'Agenda paroquial', url: '/agenda' },
      { label: 'Sacramentos', url: '/vida' },
      { label: 'Catequese e crisma', url: '/vida/catequese' },
      { label: 'Pastorais e movimentos', url: '/vida/pastorais' },
      { label: 'In Cordibus Pastorum', url: '/vida/in-cordibus-pastorum' },
      { label: 'Espiritualidade', url: '/vida/espiritualidade' },
      { label: 'Mural do dízimo', url: '/vida/mural-do-dizimo' },
    ],
  },
  {
    label: 'Comunicação',
    links: [
      { label: 'Notícias e artigos', url: '/comunicacao' },
      { label: 'Projetos e parcerias', url: '/projetos' },
      {
        label: 'Instagram',
        url: 'https://www.instagram.com/nsaaparecidajdinga/',
        external: true,
      },
      {
        label: 'Facebook',
        url: 'https://www.facebook.com/MatrizAparecidaJardiminga/',
        external: true,
      },
      { label: 'Dízimo e doações', url: '/contribuir' },
      {
        label: 'Diocese de Luziânia',
        url: 'https://diocesedeluziania.com.br/',
        external: true,
      },
    ],
  },
]
