import type { StaticImage } from './types'

/** Page "Dízimo e doações" (/contribuir). */
export const contributionPage = {
  title: 'Sua participação faz a comunidade.',
  intro:
    'Há muitas formas de contribuir: participar de uma pastoral, oferecer seu tempo e apoiar a missão paroquial.',
  paragraphs: [
    'Seja dizimista: converse com a secretaria sobre a pastoral do dízimo e as formas de participação.',
    'Ofereça seu tempo: conheça as pastorais e procure a secretaria para saber onde servir.',
    'Apoie uma campanha: a secretaria informa as campanhas em andamento.',
  ],
  donationNotice: 'Para doar, fale com a secretaria paroquial.',
}

/** Page "Espiritualidade" (/vida/espiritualidade). */
export const spiritualityPage = {
  title: 'Cultive sua espiritualidade',
  intro: 'Um convite à oração, à escuta da Palavra e ao cuidado com a vida.',
  heroImage: {
    src: '/images/oracao.webp',
    width: 1600,
    height: 800,
    alt: '',
    credit: 'Ilustração gerada por IA para o protótipo.',
  } satisfies StaticImage,
  heroTitle: 'A fé também habita os pequenos momentos.',
  heroBody:
    'Encontre tempo para silenciar, agradecer e rezar. Aqui reunimos caminhos simples para sua oração pessoal e comunitária.',
  practices: [
    {
      title: 'Escute a Palavra',
      body: 'Leia o Evangelho do dia com calma e escolha uma palavra para levar consigo.',
    },
    {
      title: 'Apresente sua vida',
      body: 'Agradeça, partilhe suas preocupações com Deus e recorde quem precisa de oração.',
    },
    {
      title: 'Transforme em cuidado',
      body: 'Escolha um gesto de reconciliação, acolhimento ou serviço para viver hoje.',
    },
  ],
}

/** Page "In Cordibus Pastorum" (/vida/in-cordibus-pastorum). */
export const pastorumPage = {
  title: 'In Cordibus Pastorum',
  intro: 'Formação, escuta e reflexões para caminhar na fé com a nossa comunidade.',
  image: {
    src: '/images/equipe-placeholder.webp',
    width: 800,
    height: 800,
    alt: 'Equipe sacerdotal da paróquia',
    credit: 'Imagem genérica fornecida pelo usuário; não é retrato de um sacerdote.',
  } satisfies StaticImage,
  sectionTitle: 'Uma presença que acolhe e orienta.',
  sectionBody:
    'Mensagens, homilias e reflexões dos sacerdotes da paróquia, Pe. Inaldo José Salustiano e Pe. Cláudio Eduardo de Faria, para caminhar na fé com a comunidade.',
}

/** Page "Mural do dízimo" (/vida/mural-do-dizimo). */
export const titheWallPage = {
  title: 'Mural do dízimo',
  intro: 'Gratidão, partilha e compromisso com a vida da comunidade.',
  titheTitle: 'Dízimo é cuidado com a nossa missão.',
  titheParagraphs: [
    'A participação no dízimo expressa gratidão e corresponsabilidade pela comunidade. É uma contribuição livre e consciente que ajuda a sustentar a evangelização e o serviço ao próximo.',
    'A secretaria poderá orientar sobre cadastro e formas de contribuição aprovadas pela paróquia.',
  ],
  reasons: [
    'Agradecer pelos dons recebidos',
    'Cuidar da casa da comunidade',
    'Apoiar a evangelização',
    'Colaborar com a formação na fé',
    'Fortalecer o serviço ao próximo',
    'Participar de uma missão comum',
    'Cultivar a generosidade',
    'Valorizar o trabalho comunitário',
    'Exercitar um compromisso livre e consciente',
    'Ajudar a comunidade a planejar seus cuidados',
  ],
  interestTitle: 'Tenho interesse em ser dizimista',
  interestBody:
    'Procure a secretaria paroquial para receber orientações sobre como se tornar dizimista.',
}
