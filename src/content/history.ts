import type { StaticImage, TimelineEntry } from './types'

const matrix: StaticImage = {
  src: '/images/matriz-atual.jpg',
  width: 688,
  height: 688,
  alt: 'Fotografia da fachada azul da matriz Nossa Senhora Aparecida',
  credit: 'Fotografia fornecida para o protótipo; data do registro não informada.',
}

const dioceseSource = {
  sourceName: 'Diocese de Luziânia',
  sourceUrl: 'https://diocesedeluziania.com.br/about/',
}

/** Page "Nossa história" (/paroquia). */
export const historyPage = {
  eyebrow: 'Nossa Senhora Aparecida · Jardim Ingá',
  title: 'A história da nossa paróquia.',
  intro: 'Memórias de fé, encontros e vida em comunidade.',
  cover: {
    src: '/images/fachada.webp',
    width: 1024,
    height: 374,
    alt: 'Vista da fachada azul da igreja matriz Nossa Senhora Aparecida',
    caption: 'Imagem de referência da matriz. Não representa a fachada em 1997.',
    credit: 'Fotografia fornecida pelo usuário para o projeto.',
  } satisfies StaticImage,
  contributionTitle: 'Você tem uma história para compartilhar?',
  contributionBody:
    'Fotografias antigas, documentos e lembranças podem ajudar a contar a trajetória da nossa comunidade. Converse com a secretaria para saber como colaborar.',
}

/** Timeline shown on /paroquia, oldest first. */
export const historyTimeline: TimelineEntry[] = [
  {
    id: 'criacao',
    label: '1997',
    title: 'Criação da paróquia',
    paragraphs: [
      'O histórico da Diocese de Luziânia registra a criação da Paróquia Nossa Senhora Aparecida, no Jardim Ingá, em 1997.',
      'Este marco se refere à criação da paróquia. A data de inauguração do edifício atual ainda precisa ser documentada.',
    ],
    ...dioceseSource,
  },
  {
    id: 'primeiros-passos',
    label: 'Data a confirmar',
    title: 'Os primeiros passos da comunidade',
    paragraphs: [
      'Espaço reservado para contar como a comunidade começou a se reunir, com depoimentos e registros dos primeiros paroquianos.',
    ],
  },
  {
    id: 'construcao',
    label: 'Data a confirmar',
    title: 'A construção da nossa matriz',
    paragraphs: [
      'Inserir aqui as datas da construção, as etapas da obra e a história das pessoas que ajudaram a erguer a igreja.',
    ],
  },
  {
    id: 'comunidades',
    label: 'Data a confirmar',
    title: 'Uma fé que alcança novos lugares',
    paragraphs: [
      'Este espaço receberá a história das capelas, das pastorais e dos grupos que passaram a integrar a vida paroquial.',
    ],
  },
  {
    id: 'camiseta-2025',
    label: '2025',
    title: 'Um registro da devoção à padroeira',
    paragraphs: [
      'O acervo do projeto inclui a divulgação da camiseta da padroeira de 2025. A arte traz Nossa Senhora Aparecida e o desenho da igreja matriz.',
      'Este é um registro do material de divulgação; não confirma o calendário ou a realização de atividades daquele ano.',
    ],
    sourceName: 'Acervo fornecido para o protótipo',
    image: {
      src: '/images/camiseta-2025.webp',
      width: 1080,
      height: 1350,
      alt: 'Arte de divulgação da camiseta da padroeira de 2025, com frente e verso',
      credit: 'Arte de divulgação de 2025 fornecida para o projeto; não é oferta vigente.',
    },
  },
  {
    id: 'hoje',
    label: 'Hoje',
    title: 'Uma história que continua',
    paragraphs: [
      'A matriz e cinco capelas compõem a Paróquia Nossa Senhora Aparecida, conforme o diretório da Diocese de Luziânia.',
      'A história será completada com documentos, fotografias e relatos da comunidade. Cada novo registro ajudará a preservar a memória da paróquia.',
    ],
    sourceName: 'Diretório da Diocese de Luziânia',
    sourceUrl: 'https://diocesedeluziania.com.br/paroquias/paroquia-nossa-senhora-aparecida-2/',
    image: matrix,
  },
]
