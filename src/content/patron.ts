import type { IconName } from '@/components/site/Icon'

import type { StaticImage, TimelineEntry } from './types'

const devotionSource = {
  sourceName: 'Santuário Nacional / A12',
  sourceUrl: 'https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717',
}
const sanctuarySource = {
  sourceName: 'Santuário Nacional / A12',
  sourceUrl: 'https://www.a12.com/devotos-mirins/historia-do-santuario-nacional',
}

const patronArt: StaticImage = {
  src: '/images/padroeira.webp',
  width: 1600,
  height: 800,
  alt: 'Ilustração de Nossa Senhora Aparecida com coroa e manto azul',
  credit: 'Representação artística gerada por IA para o protótipo.',
}

/** Page "Nossa padroeira" (/padroeira). */
export const patronPage = {
  eyebrow: 'Festa da padroeira · 12 de outubro',
  title: 'Nossa Senhora Aparecida',
  intro: 'A história de uma devoção que une gerações.',
  cover: {
    ...patronArt,
    caption: 'Representação artística gerada para o protótipo.',
  } satisfies StaticImage,
  reading: {
    title: 'Uma história de fé para continuar lendo.',
    body: 'Conheça a trajetória da devoção e do Santuário Nacional nas publicações do A12.',
    url: 'https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717',
  },
  facts: [
    {
      icon: 'waves',
      title: 'Uma imagem encontrada nas águas',
      body: 'A devoção remonta ao encontro da imagem no Rio Paraíba do Sul, em 1717.',
    },
    {
      icon: 'crown',
      title: 'A coroa faz parte da história',
      body: 'A coroação solene de 1904 é um dos marcos da devoção à padroeira.',
    },
    {
      icon: 'calendar-days',
      title: '12 de outubro',
      body: 'A festa de Nossa Senhora Aparecida é celebrada em todo o Brasil nesta data.',
    },
  ] satisfies { icon: IconName; title: string; body: string }[],
  sources: [
    {
      label: 'A12 · história da devoção',
      url: 'https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717',
    },
    {
      label: 'Santuário Nacional · linha do tempo',
      url: 'https://www.a12.com/devotos-mirins/historia-do-santuario-nacional',
    },
  ],
}

/** Timeline shown on /padroeira, oldest first. */
export const patronTimeline: TimelineEntry[] = [
  {
    id: 'encontro-1717',
    label: '1717',
    title: 'O encontro nas águas',
    paragraphs: [
      'A tradição de Aparecida começa com três pescadores no Rio Paraíba do Sul, na região de Guaratinguetá, em São Paulo. A pequena imagem encontrada nas redes passa a reunir os fiéis em oração.',
    ],
    ...devotionSource,
  },
  {
    id: 'devocao',
    label: 'Séculos XVIII e XIX',
    title: 'Uma devoção que cresce',
    paragraphs: [
      'Das orações em família às capelas e romarias, a devoção se expande. A imagem torna-se referência de fé para um número crescente de peregrinos.',
    ],
    ...devotionSource,
  },
  {
    id: 'coroacao-1904',
    label: '8 de setembro de 1904',
    title: 'A coroação da imagem',
    paragraphs: [
      'A coroação solene da imagem acontece na Basílica Histórica, em Aparecida. A celebração marca uma nova etapa no reconhecimento da devoção mariana no país.',
    ],
    ...sanctuarySource,
    image: {
      ...patronArt,
      alt: 'Representação artística de Nossa Senhora Aparecida coroada',
      credit: 'Ilustração gerada por IA; não retrata a cerimônia de 1904.',
    },
  },
  {
    id: 'padroeira-1930',
    label: '1930',
    title: 'Padroeira do Brasil',
    paragraphs: [
      'O Papa Pio XI proclama Nossa Senhora da Conceição Aparecida padroeira principal do Brasil, reconhecendo uma devoção presente em muitas comunidades brasileiras.',
    ],
    ...sanctuarySource,
  },
  {
    id: 'basilica-1980',
    label: '1980',
    title: 'A dedicação da nova Basílica',
    paragraphs: [
      'João Paulo II dedica a nova Basílica de Aparecida. O templo acolhe peregrinos que chegam para celebrar, agradecer e rezar diante da padroeira.',
    ],
    ...sanctuarySource,
  },
  {
    id: 'comunidade-hoje',
    label: 'Hoje',
    title: 'A Mãe Aparecida na nossa comunidade',
    paragraphs: [
      'No Jardim Ingá, Nossa Senhora Aparecida dá nome à nossa paróquia e faz parte da identidade da comunidade. A memória da devoção local será completada com a equipe paroquial.',
    ],
    image: {
      src: '/images/matriz-atual.jpg',
      width: 688,
      height: 688,
      alt: 'Fachada da Paróquia Nossa Senhora Aparecida no Jardim Ingá',
      credit: 'Fotografia fornecida para o projeto; data do registro não informada.',
    },
  },
]
