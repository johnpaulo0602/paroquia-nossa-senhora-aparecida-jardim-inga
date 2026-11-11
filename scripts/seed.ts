import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

import { getPayload } from 'payload'
import type {
  CollectionSlug,
  DataFromCollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  Payload,
  RequiredDataFromCollectionSlug,
} from 'payload'

import type { Post } from '../src/payload-types'
import config from '../src/payload.config'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROTOTYPE = path.join(ROOT, 'docs', 'prototipo')

const demonstration = {
  origin: 'demonstration',
  verification: 'pending',
  _status: 'published',
} as const

type CollectionData<TSlug extends CollectionSlug> = RequiredDataFromCollectionSlug<TSlug>
type GlobalData<TSlug extends GlobalSlug> = Partial<
  Omit<DataFromGlobalSlug<TSlug>, 'id' | 'createdAt' | 'updatedAt'>
>
type IdentityField = 'slug' | 'internalNotes'

type PortalPost = {
  id: string
  category: string
  title: string
  summary: string
  date: string | null
  sourceName?: string
  source?: string
  image: string
  alt: string
  paragraphs: string[]
  generated: boolean
  credit?: string
  kind: string
}

type PortalSlide = {
  category: string
  title: string
  summary: string
  image: string
  alt: string
  href: string
  cta: string
}

type MediaSpec = {
  file: string
  alt: string
  credit: string
  mediaType: CollectionData<'media'>['mediaType']
  caption?: string
}

function richText(paragraphs: string | string[]): Post['body'] {
  const items = Array.isArray(paragraphs) ? paragraphs : [paragraphs]

  return {
    root: {
      type: 'root',
      children: items.map((text) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function loadPrototypeContent(): { posts: PortalPost[]; slides: PortalSlide[] } {
  const filename = path.join(PROTOTYPE, 'conteudo.js')
  const sandbox: { window: { portalPosts?: unknown; portalSlides?: unknown } } = { window: {} }

  vm.createContext(sandbox)
  new vm.Script(readFileSync(filename, 'utf8'), { filename }).runInContext(sandbox)

  if (
    !Array.isArray(sandbox.window.portalPosts) ||
    sandbox.window.portalPosts.length !== 10 ||
    !Array.isArray(sandbox.window.portalSlides) ||
    sandbox.window.portalSlides.length !== 4
  ) {
    throw new Error('conteudo.js deve conter exatamente dez publicações e quatro destaques.')
  }

  return {
    posts: sandbox.window.portalPosts as PortalPost[],
    slides: sandbox.window.portalSlides as PortalSlide[],
  }
}

async function upsert<TSlug extends CollectionSlug>(
  payload: Payload,
  collection: TSlug,
  identityField: IdentityField,
  identityValue: string,
  data: CollectionData<TSlug>,
): Promise<DataFromCollectionSlug<TSlug>> {
  const existing = await payload.find({
    collection,
    where: { [identityField]: { equals: identityValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data: data as never,
      depth: 0,
      overrideAccess: true,
    }) as Promise<DataFromCollectionSlug<TSlug>>
  }

  return payload.create({
    collection,
    data: data as never,
    depth: 0,
    overrideAccess: true,
  }) as Promise<DataFromCollectionSlug<TSlug>>
}

async function updateGlobal<TSlug extends GlobalSlug>(
  payload: Payload,
  slug: TSlug,
  data: GlobalData<TSlug>,
) {
  return payload.updateGlobal({ slug, data: data as never, depth: 0, overrideAccess: true })
}

const mediaCache = new Map<string, number>()

async function upsertMedia(payload: Payload, spec: MediaSpec): Promise<number> {
  const cacheKey = `${spec.file}\0${spec.alt}`
  const cached = mediaCache.get(cacheKey)
  if (cached) return cached

  const relativePath = path.posix.join('docs/prototipo', spec.file)
  const marker = `seed:media:${relativePath}`
  const existing = await payload.find({
    collection: 'media',
    where: {
      and: [{ alt: { equals: spec.alt } }, { internalNotes: { equals: marker } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const data: CollectionData<'media'> = {
    alt: spec.alt,
    caption: spec.caption,
    credit: spec.credit,
    source: relativePath,
    mediaType: spec.mediaType,
    usageAuthorized: false,
    internalNotes: marker,
  }

  const media = existing.docs[0]
    ? await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'media',
        data,
        filePath: path.join(ROOT, relativePath),
        depth: 0,
        overrideAccess: true,
      })

  mediaCache.set(cacheKey, media.id)
  return media.id
}

async function ensureInitialAdmin(payload: Payload) {
  const users = await payload.find({
    collection: 'users',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (users.totalDocs > 0) return

  const email = process.env.PAYLOAD_ADMIN_EMAIL?.trim()
  const password = process.env.PAYLOAD_ADMIN_PASSWORD
  if (!email || !password) {
    console.info(
      '[seed] Nenhum usuário existe. Defina PAYLOAD_ADMIN_EMAIL e PAYLOAD_ADMIN_PASSWORD no ambiente e execute o seed novamente para criar o admin; nenhuma credencial previsível foi gerada.',
    )
    return
  }

  await payload.create({
    collection: 'users',
    data: { name: 'Administrador técnico', email, password, role: 'admin' },
    depth: 0,
    overrideAccess: true,
  })
  console.info(`[seed] Admin inicial criado para ${email}.`)
}

const communitySeeds = [
  {
    slug: 'matriz',
    name: 'Matriz Nossa Senhora Aparecida',
    type: 'matrix',
    region: 'Jardim Ingá / Parque Estrela D’Alva IX',
    address:
      'Avenida Lucena Roriz, quadra 255, lotes 11 a 20, Parque Estrela D’Alva IX, Jardim Ingá, Luziânia — GO',
  },
  {
    slug: 'sao-pedro-e-sao-paulo',
    name: 'São Pedro e São Paulo',
    type: 'chapel',
    region: 'Jardim Ingá',
  },
  {
    slug: 'sao-miguel-arcanjo',
    name: 'São Miguel Arcanjo',
    type: 'chapel',
    region: 'Parque Estrela D’Alva VII',
  },
  {
    slug: 'nossa-senhora-do-perpetuo-socorro',
    name: 'Nossa Senhora do Perpétuo Socorro',
    type: 'chapel',
    region: 'Parque Estrela D’Alva VIII',
  },
  {
    slug: 'nossa-senhora-da-assuncao',
    name: 'Nossa Senhora da Assunção',
    type: 'chapel',
    region: 'Parque Estrela D’Alva X',
  },
  {
    slug: 'nossa-senhora-de-fatima',
    name: 'Nossa Senhora de Fátima',
    type: 'chapel',
    region: 'Parque Estrela D’Alva IX',
  },
] as const

const celebrationSeeds = [
  ['nossa-senhora-de-fatima', 'tuesday', '19:00'],
  ['sao-pedro-e-sao-paulo', 'wednesday', '19:00'],
  ['matriz', 'thursday', '19:00'],
  ['matriz', 'friday', '19:00'],
  ['nossa-senhora-da-assuncao', 'saturday', '19:00'],
  ['matriz', 'sunday', '07:30'],
  ['sao-pedro-e-sao-paulo', 'sunday', '09:00'],
  ['nossa-senhora-do-perpetuo-socorro', 'sunday', '10:30'],
  ['nossa-senhora-de-fatima', 'sunday', '17:00'],
  ['matriz', 'sunday', '19:00'],
] as const

const pastoralSeeds = [
  {
    slug: 'liturgia-musica',
    title: 'Liturgia e música',
    mission: 'Servir à celebração, acolher a assembleia e colocar os dons a serviço da oração.',
    activities: [
      'Preparação das leituras e dos cantos',
      'Acolhimento nas celebrações',
      'Formação litúrgica da equipe',
    ],
    image: 'banner-oracao-paz.png',
  },
  {
    slug: 'catequese',
    title: 'Catequese',
    mission: 'Acompanhar crianças, jovens e adultos no encontro com Jesus e na vida em comunidade.',
    activities: [
      'Encontros de iniciação cristã',
      'Participação das famílias',
      'Preparação dos catequistas',
    ],
    image: 'banner-aparecida.png',
  },
  {
    slug: 'comunicacao',
    title: 'Comunicação',
    mission: 'Aproximar pessoas por meio da informação, da escuta e dos registros da comunidade.',
    activities: [
      'Divulgação de avisos e celebrações',
      'Produção de notícias e fotografias',
      'Cuidado com os canais paroquiais',
    ],
    image: 'banner-matriz.png',
  },
  {
    slug: 'acolhimento',
    title: 'Acolhimento',
    mission: 'Receber quem chega e ajudar cada pessoa a encontrar seu lugar na comunidade.',
    activities: [
      'Recepção nas celebrações',
      'Orientação aos visitantes',
      'Atenção às necessidades de acessibilidade',
    ],
    image: 'banner-missoes.png',
  },
  {
    slug: 'dizimo',
    title: 'Dízimo',
    mission: 'Cultivar a gratidão, a partilha e a corresponsabilidade pela missão paroquial.',
    activities: [
      'Acolhimento aos dizimistas',
      'Formação sobre partilha',
      'Orientação junto à secretaria',
    ],
    image: 'banner-missoes.png',
  },
  {
    slug: 'caridade',
    title: 'Caridade e ação social',
    mission:
      'Reconhecer as necessidades do próximo e construir caminhos de cuidado e solidariedade.',
    activities: [
      'Escuta e acolhimento',
      'Organização de iniciativas solidárias',
      'Articulação com a comunidade',
    ],
    image: 'banner-oracao-paz.png',
  },
] as const

const reflectionSeeds = [
  {
    id: 'escuta',
    title: 'Fazer espaço para a escuta',
    summary: 'A atenção ao próximo começa quando encontramos tempo para ouvir.',
    image: 'banner-oracao-paz.png',
    body: [
      'No ritmo cotidiano, é fácil responder antes de compreender. A escuta abre outro caminho: estar presente, acolher a história de alguém e reconhecer suas necessidades.',
      'Na vida comunitária, esse cuidado pode começar com gestos simples. Perguntar como alguém está, oferecer companhia e respeitar o silêncio são maneiras de construir proximidade.',
      'Reserve hoje alguns minutos para uma conversa sem pressa. Que pessoa da sua convivência precisa ser ouvida?',
    ],
  },
  {
    id: 'servir',
    title: 'Pequenos gestos, uma comunidade mais próxima',
    summary: 'O serviço pode começar com o tempo e os dons que já temos.',
    image: 'banner-missoes.png',
    body: [
      'Uma comunidade se constrói com a participação de muitas pessoas. Preparar um espaço, acolher uma família ou colaborar em uma atividade pode parecer pequeno, mas contribui para que todos encontrem lugar.',
      'Para começar, vale reconhecer os próprios dons e conversar sobre as necessidades da comunidade. O compromisso cresce com disponibilidade, formação e cuidado.',
      'Pense em algo que você sabe fazer e gostaria de oferecer. Procure a secretaria para conhecer as formas de participação confirmadas pela paróquia.',
    ],
  },
  {
    id: 'oracao',
    title: 'Um tempo de silêncio no dia a dia',
    summary: 'Uma pausa para apresentar a Deus a vida como ela é.',
    image: 'banner-aparecida.png',
    body: [
      'A oração pode começar com uma pausa. Encontrar um lugar tranquilo e respirar com calma ajuda a perceber aquilo que carregamos: gratidão, preocupações, alegrias e perguntas.',
      'Apresente a Deus o que está no seu coração. Leia uma passagem do Evangelho e permaneça alguns instantes com uma palavra que chamou sua atenção.',
      'Ao terminar, escolha um gesto concreto de cuidado para o seu dia. A oração também encontra expressão no modo como tratamos as pessoas.',
    ],
  },
] as const

async function seedCommunities(payload: Payload) {
  const ids = new Map<string, number>()
  const matrixCover = await upsertMedia(payload, {
    file: 'assets/matriz-atual.jpg',
    alt: 'Fotografia da fachada azul da igreja matriz Nossa Senhora Aparecida',
    credit: 'Fotografia fornecida pelo usuário para o protótipo.',
    mediaType: 'photograph',
  })

  for (const [index, community] of communitySeeds.entries()) {
    const doc = await upsert(payload, 'communities', 'slug', community.slug, {
      ...demonstration,
      name: community.name,
      slug: community.slug,
      generateSlug: false,
      type: community.type,
      region: community.region,
      description: richText(
        community.slug === 'matriz'
          ? 'A igreja matriz reúne a comunidade no Jardim Ingá. As informações históricas e operacionais desta apresentação aguardam revisão paroquial.'
          : 'Esta comunidade faz parte da Paróquia Nossa Senhora Aparecida. A apresentação, a fotografia e o endereço completo da capela serão preenchidos com a equipe da paróquia.',
      ),
      address: 'address' in community ? community.address : undefined,
      mapUrl:
        community.slug === 'matriz'
          ? 'https://www.google.com/maps/search/?api=1&query=Par%C3%B3quia+Nossa+Senhora+Aparecida+Jardim+Ing%C3%A1'
          : undefined,
      cover: community.slug === 'matriz' ? matrixCover : undefined,
      publicPhone: community.slug === 'matriz' ? '(61) 3055-0747' : undefined,
      publicWhatsapp: community.slug === 'matriz' ? '(61) 3055-0747' : undefined,
      publicEmail: community.slug === 'matriz' ? 'nsaparecidaparoquia@yahoo.com.br' : undefined,
      order: index,
      active: true,
      internalNotes: `seed:community:${community.slug}`,
    })
    ids.set(community.slug, doc.id)
  }

  for (const [communitySlug, weekday, time] of celebrationSeeds) {
    await upsert(
      payload,
      'celebrations',
      'internalNotes',
      `seed:celebration:${communitySlug}:${weekday}:${time}`,
      {
        ...demonstration,
        title: 'Santa Missa',
        celebrationType: 'mass',
        community: ids.get(communitySlug)!,
        weekday,
        time,
        // The origin badge already says this is unconfirmed; null also clears older seeds.
        notes: null,
        active: true,
        internalNotes: `seed:celebration:${communitySlug}:${weekday}:${time}`,
      },
    )
  }

  return ids
}

async function seedPeopleAndPastorals(payload: Payload) {
  const team = [
    {
      slug: 'pe-inaldo-jose-salustiano',
      name: 'Pe. Inaldo José Salustiano',
      role: 'Pároco',
      roleType: 'clergy',
    },
    {
      slug: 'pe-claudio-eduardo-de-faria',
      name: 'Pe. Cláudio Eduardo de Faria',
      role: 'Vigário paroquial',
      roleType: 'clergy',
    },
    {
      slug: 'placeholder-secretaria',
      name: 'Nome a confirmar — Secretaria paroquial',
      role: 'Secretaria paroquial',
      roleType: 'service',
    },
    {
      slug: 'placeholder-coordenacao-administrativa',
      name: 'Nome a confirmar — Coordenação administrativa',
      role: 'Coordenação administrativa',
      roleType: 'administration',
    },
    {
      slug: 'placeholder-comunicacao',
      name: 'Nome a confirmar — Pastoral da comunicação',
      role: 'Pastoral da comunicação',
      roleType: 'pastoral',
    },
    {
      slug: 'placeholder-conselho-pastoral',
      name: 'Nome a confirmar — Conselho pastoral',
      role: 'Conselho pastoral',
      roleType: 'pastoral',
    },
    {
      slug: 'placeholder-catequese',
      name: 'Nome a confirmar — Coordenação da catequese',
      role: 'Coordenação da catequese',
      roleType: 'pastoral',
    },
    {
      slug: 'placeholder-acolhimento',
      name: 'Nome a confirmar — Equipe de acolhimento',
      role: 'Equipe de acolhimento',
      roleType: 'service',
    },
  ] as const

  for (const [index, member] of team.entries()) {
    const photo = await upsertMedia(payload, {
      file: 'assets/equipe-placeholder.png',
      alt: `Espaço reservado para fotografia: ${member.role}`,
      credit: 'Imagem genérica fornecida pelo usuário; não é retrato do integrante.',
      mediaType: 'illustration',
      caption: 'Fotografia a incluir após autorização.',
    })
    await upsert(payload, 'people', 'slug', member.slug, {
      ...demonstration,
      name: member.name,
      slug: member.slug,
      generateSlug: false,
      // No placeholder biography: an empty field hides the block on the site.
      biography: null,
      photo,
      publicContactAuthorized: false,
      roleTitle: member.role,
      roleType: member.roleType,
      area: 'Paróquia Nossa Senhora Aparecida — Jardim Ingá',
      order: index,
      current: true,
      internalNotes: `seed:person:${member.slug}`,
    })
  }

  const pastoralIds = new Map<string, number>()
  for (const [index, pastoral] of pastoralSeeds.entries()) {
    const cover = await upsertMedia(payload, {
      file: `assets/editorial/${pastoral.image}`,
      alt: `Ilustração temática para ${pastoral.title}; não é registro desta pastoral`,
      credit: 'Ilustração gerada por IA para o protótipo; não representa um grupo local.',
      mediaType: 'illustration',
    })
    const doc = await upsert(payload, 'pastorals', 'slug', pastoral.slug, {
      ...demonstration,
      title: pastoral.title,
      slug: pastoral.slug,
      generateSlug: false,
      mission: richText(pastoral.mission),
      activities: pastoral.activities.map((title) => ({
        title,
        description: 'Atividade ilustrativa, sem confirmação de funcionamento local.',
      })),
      coordinators: [],
      meetingInfo: [],
      participationInfo: richText(
        'Para saber como participar, fale com a secretaria paroquial.',
      ),
      requirements: richText('Coordenação, encontros, local, preparação e requisitos a confirmar.'),
      cover,
      contactViaSecretariat: true,
      order: index,
      active: true,
      internalNotes: `seed:pastoral:${pastoral.slug}`,
    })
    pastoralIds.set(pastoral.slug, doc.id)
  }

  return pastoralIds
}

async function seedSacramentGuides(payload: Payload) {
  const contactInfo = richText(
    'Procure a secretaria paroquial para receber orientações confirmadas. Os formulários não estão ativos; nenhuma solicitação ou data é registrada por este conteúdo.',
  )
  const guides: Array<{
    slug: string
    title: string
    guideType: 'baptism' | 'marriage' | 'catechesis'
    intro: string
    sections: Array<{ title: string; paragraphs: string[] }>
    requirements: string[]
  }> = [
    {
      slug: 'batismo',
      title: 'Batismo',
      guideType: 'baptism',
      intro: 'O início da vida cristã, em comunidade.',
      sections: [
        {
          title: 'Formas de celebração',
          paragraphs: [
            'O Batismo marca o início da vida cristã. Para conhecer a preparação e organizar a celebração, o primeiro passo é conversar com a secretaria paroquial.',
            'A equipe informará sobre encontros para responsáveis e padrinhos, datas disponíveis e orientações para a celebração.',
            'As modalidades de celebração, os horários e as contribuições precisam ser confirmados diretamente com a paróquia do Jardim Ingá.',
          ],
        },
        {
          title: 'Documentação e requisitos',
          paragraphs: [
            'Antes de reunir documentos, solicite à secretaria a lista atualizada e as orientações para o seu caso.',
            'Confirme os documentos de identificação e de registro, a preparação necessária e os procedimentos de inscrição.',
            'A equipe orientará sobre a preparação e os requisitos para os padrinhos acompanharem a criança na vida cristã.',
          ],
        },
      ],
      requirements: [
        'Relação oficial de documentos a confirmar pela paróquia.',
        'Preparação de responsáveis e padrinhos a confirmar pela paróquia.',
        'Datas, locais e disponibilidade sujeitos à confirmação da secretaria.',
      ],
    },
    {
      slug: 'matrimonio',
      title: 'Matrimônio',
      guideType: 'marriage',
      intro: 'Preparar a celebração é também preparar a vida em família.',
      sections: [
        {
          title: 'Informações para o casamento',
          paragraphs: [
            'A preparação para o Matrimônio envolve a celebração e o caminho de vida em família. Converse com a secretaria antes de definir os detalhes do evento.',
            'As datas e os locais disponíveis precisam ser confirmados pela equipe paroquial. Uma solicitação não representa reserva.',
          ],
        },
        {
          title: 'Preparação e processo matrimonial',
          paragraphs: [
            'A secretaria orientará sobre os encontros de preparação, a documentação e os passos do processo matrimonial.',
            'Consulte a equipe sobre a celebração, a organização do espaço e as orientações litúrgicas.',
            'Eventuais contribuições serão informadas pela secretaria.',
          ],
        },
      ],
      requirements: [
        'Encontros de preparação e antecedência a confirmar.',
        'Documentação e processo matrimonial a confirmar.',
        'Data e local somente após confirmação da secretaria.',
      ],
    },
    {
      slug: 'catequese',
      title: 'Catequese e crisma',
      guideType: 'catechesis',
      intro: 'Um caminho de formação e participação na comunidade.',
      sections: [
        {
          title: 'Primeira Eucaristia',
          paragraphs: [
            'Idades, inscrições, encontros e documentação serão publicados após confirmação.',
          ],
        },
        {
          title: 'Crisma',
          paragraphs: ['Consulte a secretaria sobre turmas e preparação.'],
        },
        {
          title: 'Iniciação cristã de adultos',
          paragraphs: ['Procure a equipe para saber como começar ou retomar seu caminho de fé.'],
        },
      ],
      requirements: [
        'Turmas, idades, encontros e documentação ainda não confirmados.',
        'A participação depende das orientações da equipe paroquial.',
      ],
    },
  ]

  for (const guide of guides) {
    await upsert(payload, 'sacrament-guides', 'slug', guide.slug, {
      ...demonstration,
      title: guide.title,
      slug: guide.slug,
      generateSlug: false,
      guideType: guide.guideType,
      intro: richText(guide.intro),
      sections: guide.sections.map((section) => ({
        title: section.title,
        body: richText(section.paragraphs),
      })),
      requirements: guide.requirements.map((text) => ({ text: richText(text) })),
      contactInfo,
      formType: 'none',
      internalNotes: `seed:sacrament-guide:${guide.slug}`,
    })
  }
}

async function seedPosts(
  payload: Payload,
  prototypePosts: PortalPost[],
  communityIds: Map<string, number>,
) {
  const ids = new Map<string, number>()
  const categories: Record<string, CollectionData<'posts'>['category']> = {
    'Igreja no Brasil': 'church-brazil',
    'Papa e Vaticano': 'pope-vatican',
    'Comunidades e pastorais': 'communities-pastorals',
    'Memória da comunidade': 'community-memory',
  }

  for (const post of prototypePosts) {
    const cover = await upsertMedia(payload, {
      file: post.image,
      alt: post.alt,
      credit:
        post.credit ??
        (post.generated
          ? 'Ilustração gerada por IA; não é fotografia do fato noticiado.'
          : 'Imagem fornecida para o protótipo.'),
      mediaType: post.generated ? 'illustration' : 'photograph',
    })
    const doc = await upsert(payload, 'posts', 'slug', post.id, {
      ...demonstration,
      title: post.title,
      slug: post.id,
      generateSlug: false,
      summary: post.summary,
      body: richText(post.paragraphs),
      format: post.kind === 'noticia' ? 'news' : 'article',
      editorialAreas: post.id === 'matriz' ? ['communication', 'institutional'] : ['communication'],
      category: categories[post.category] ?? 'general',
      publishedAt: post.date ? `${post.date}T12:00:00-03:00` : undefined,
      cover,
      sourceName: post.sourceName,
      sourceUrl: post.source,
      communities: post.id === 'matriz' ? [communityIds.get('matriz')!] : [],
      internalNotes: `seed:post:${post.id}`,
    })
    ids.set(post.id, doc.id)
  }

  const albumCover = await upsertMedia(payload, {
    file: 'assets/matriz-atual.jpg',
    alt: 'Fotografia da fachada azul da igreja matriz',
    credit: 'Fotografia fornecida pelo usuário para este projeto.',
    mediaType: 'photograph',
    caption: 'Registro da fachada fornecido para o acervo do protótipo; data não informada.',
  })
  const album = await upsert(payload, 'posts', 'slug', 'album-matriz', {
    ...demonstration,
    title: 'A matriz em imagens: a igreja azul do Jardim Ingá',
    slug: 'album-matriz',
    generateSlug: false,
    summary: 'Um registro da fachada fornecido para o acervo do protótipo.',
    body: richText([
      'Este registro apresenta a fachada da matriz Nossa Senhora Aparecida no Jardim Ingá. A imagem foi fornecida para o projeto do portal.',
      'Na versão final, álbuns como este poderão reunir fotografias com descrição, data e créditos confirmados pela equipe de comunicação.',
    ]),
    format: 'photos',
    editorialAreas: ['communication', 'institutional'],
    category: 'community-memory',
    publishedAt: '2026-10-12T12:00:00-03:00',
    cover: albumCover,
    gallery: [{ image: albumCover, caption: 'Fachada azul da igreja matriz no Jardim Ingá.' }],
    sourceName: 'Acervo fornecido para o protótipo',
    communities: [communityIds.get('matriz')!],
    internalNotes: 'seed:post:album-matriz',
  })
  ids.set('album-matriz', album.id)

  for (const reflection of reflectionSeeds) {
    const cover = await upsertMedia(payload, {
      file: `assets/editorial/${reflection.image}`,
      alt: 'Ilustração temática de fé e comunidade',
      credit: 'Ilustração gerada por IA para o protótipo.',
      mediaType: 'illustration',
    })
    const doc = await upsert(payload, 'posts', 'slug', reflection.id, {
      ...demonstration,
      title: reflection.title,
      slug: reflection.id,
      generateSlug: false,
      summary: reflection.summary,
      body: richText([
        ...reflection.body,
      ]),
      format: 'article',
      editorialAreas: ['spirituality', 'pastorum'],
      category: 'general',
      publishedAt: '2026-10-12T12:00:00-03:00',
      cover,
      sourceName: 'Protótipo — exemplo editorial sem autoria atribuída',
      internalNotes: `seed:post:reflection:${reflection.id}`,
    })
    ids.set(reflection.id, doc.id)
  }

  return ids
}

async function seedEvents(payload: Payload, communityIds: Map<string, number>) {
  const events = [
    {
      slug: 'encontro-de-formacao-2026-11-15',
      title: 'Encontro de formação',
      startsAt: '2026-11-15T09:00:00-03:00',
      endsAt: '2026-11-15T11:00:00-03:00',
      community: 'matriz',
      description:
        'Exemplo de evento para demonstrar como uma formação seria apresentada no portal. Programação, responsáveis e inscrições serão definidos pela equipe em eventos reais.',
    },
    {
      slug: 'encontro-da-comunidade-2026-11-21',
      title: 'Encontro da comunidade',
      startsAt: '2026-11-21T16:00:00-03:00',
      endsAt: '2026-11-21T18:00:00-03:00',
      community: 'sao-pedro-e-sao-paulo',
      description:
        'Exemplo de encontro comunitário. Esta página demonstra os campos de data, local e orientações; não corresponde a uma atividade confirmada.',
    },
    {
      slug: 'reuniao-pastoral-2026-11-28',
      title: 'Reunião pastoral',
      startsAt: '2026-11-28T14:00:00-03:00',
      endsAt: '2026-11-28T16:00:00-03:00',
      community: 'nossa-senhora-de-fatima',
      description:
        'Encontro de exemplo para mostrar a agenda por comunidade. Procure a secretaria para saber das reuniões desta pastoral.',
    },
  ] as const

  for (const event of events) {
    const communityName = communitySeeds.find((item) => item.slug === event.community)!.name
    await upsert(payload, 'events', 'slug', event.slug, {
      ...demonstration,
      title: event.title,
      slug: event.slug,
      generateSlug: false,
      summary: 'Encontro de exemplo para mostrar a organização da agenda por comunidade.',
      body: richText(event.description),
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      community: communityIds.get(event.community)!,
      locationText: communityName,
      participationInfo: richText(
        'Para informações sobre inscrição e participação, fale com a secretaria paroquial.',
      ),
      archived: false,
      internalNotes: `seed:event:${event.slug}`,
    })
  }
}

async function seedHighlights(
  payload: Payload,
  slides: PortalSlide[],
  postIds: Map<string, number>,
) {
  for (const [index, slide] of slides.entries()) {
    const postSlug = slide.href.match(/^#noticia\/(.+)$/)?.[1]
    const post = postSlug ? postIds.get(postSlug) : undefined
    if (!post) throw new Error(`Destaque sem publicação de destino: ${slide.href}`)

    const image = await upsertMedia(payload, {
      file: slide.image,
      alt: slide.alt,
      credit: 'Ilustração gerada por IA para o protótipo; não é fotografia do conteúdo.',
      mediaType: 'illustration',
    })
    await upsert(payload, 'highlights', 'internalNotes', `seed:highlight:${postSlug}`, {
      ...demonstration,
      title: slide.title.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''),
      eyebrow: slide.category,
      summary: slide.summary,
      image,
      ctaLabel: slide.cta,
      destinationType: 'post',
      post,
      placement: ['home'],
      order: index,
      internalNotes: `seed:highlight:${postSlug}`,
    })
  }
}

async function seedProjectsAndSponsors(payload: Payload) {
  const projects = [
    {
      slug: 'maos-que-acolhem',
      title: 'Mãos que acolhem',
      summary: 'Proposta de campanha solidária',
      body: 'Uma proposta de arrecadação de alimentos e itens de cuidado para apoiar famílias. A implantação, os responsáveis e a forma de distribuição dependerão da equipe paroquial.',
    },
    {
      slug: 'amigos-da-comunidade',
      title: 'Amigos da comunidade',
      summary: 'Parcerias com o comércio local',
      body: 'Proposta de uma rede de apoiadores para colaborar com ações comunitárias, serviços e eventos. Nenhuma empresa está vinculada a este exemplo.',
    },
    {
      slug: 'cuidar-da-nossa-casa',
      title: 'Cuidar da nossa casa',
      summary: 'Voluntariado e acolhimento',
      body: 'Proposta de mutirões e serviços voluntários para cuidar dos espaços usados nas celebrações e nos encontros. Não há calendário de atividades confirmado.',
    },
  ] as const
  const projectIds: number[] = []
  const cover = await upsertMedia(payload, {
    file: 'assets/editorial/banner-missoes.png',
    alt: 'Ilustração de partilha e missão',
    credit: 'Ilustração gerada por IA para o protótipo.',
    mediaType: 'illustration',
  })

  for (const [index, project] of projects.entries()) {
    const doc = await upsert(payload, 'projects', 'slug', project.slug, {
      ...demonstration,
      title: project.title,
      slug: project.slug,
      generateSlug: false,
      summary: project.summary,
      body: richText(project.body),
      cover,
      institutionalContacts: richText(
        'Proposta de exemplo, ainda sem responsáveis ou calendário. Para conversar sobre uma parceria, procure a secretaria.',
      ),
      ctaLabel: 'Conversar sobre a proposta',
      order: index,
      active: true,
      internalNotes: `seed:project:${project.slug}`,
    })
    projectIds.push(doc.id)
  }

  const sponsorNames = [
    'Logo',
    'Sponsor',
    'Loremlogo',
    'BrandName',
    'Company Name',
    'Casa verde',
    'Casa azul',
  ]
  for (const [index, name] of sponsorNames.entries()) {
    const file = `assets/patrocinadores/exemplo-${index + 1}.png`
    const logo = await upsertMedia(payload, {
      file,
      alt: `${name} — patrocinador ilustrativo`,
      credit: 'Marca fictícia fornecida para o protótipo; sem vínculo com empresas reais.',
      mediaType: 'artwork',
    })
    const identifier = `seed:sponsor:exemplo-${index + 1}`
    await upsert(payload, 'sponsors', 'internalNotes', identifier, {
      ...demonstration,
      name,
      logo,
      project: projectIds[index % projectIds.length],
      approved: false,
      order: index,
      internalNotes: identifier,
    })
  }
}

async function seedGlobals(payload: Payload) {
  const logo = await upsertMedia(payload, {
    file: 'assets/logo-igreja.png',
    alt: 'Desenho recortado da igreja matriz Nossa Senhora Aparecida',
    credit: 'Desenho fornecido pelo usuário para o projeto.',
    mediaType: 'illustration',
  })
  const matrixPhoto = await upsertMedia(payload, {
    file: 'assets/matriz-atual.jpg',
    alt: 'Fotografia da fachada azul da matriz Nossa Senhora Aparecida',
    credit: 'Fotografia fornecida pelo usuário para o protótipo.',
    mediaType: 'photograph',
  })
  const matrixArt = await upsertMedia(payload, {
    file: 'assets/editorial/banner-matriz.png',
    alt: 'Interpretação artística da fachada da igreja matriz',
    credit: 'Ilustração gerada por IA para o protótipo.',
    mediaType: 'illustration',
  })

  await updateGlobal(payload, 'site-settings', {
    name: 'Paróquia Nossa Senhora Aparecida',
    shortName: 'Nossa Senhora Aparecida — Jardim Ingá',
    logo,
    diocese: 'Diocese de Luziânia',
    forania: 'Forania Cidade Ocidental e Jardim Ingá',
    address:
      'Avenida Lucena Roriz, quadra 255, lotes 11 a 20, Parque Estrela D’Alva IX, Jardim Ingá, Luziânia — GO',
    postalCode: '72850-010',
    phone: '(61) 3055-0747',
    whatsapp: '(61) 3055-0747',
    email: 'nsaparecidaparoquia@yahoo.com.br',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Par%C3%B3quia+Nossa+Senhora+Aparecida+Jardim+Ing%C3%A1',
    instagramUrl: 'https://www.instagram.com/nsaaparecidajdinga/',
    facebookUrl: 'https://www.facebook.com/MatrizAparecidaJardiminga/',
    liturgyUrl: 'https://liturgia.cancaonova.com/pb/',
    secretariatHours: [
      {
        weekday: 'tuesday',
        opensAt: '08:00',
        closesAt: '12:00',
        secondOpensAt: '14:00',
        secondClosesAt: '17:00',
      },
      {
        weekday: 'wednesday',
        opensAt: '08:00',
        closesAt: '12:00',
        secondOpensAt: '14:00',
        secondClosesAt: '17:00',
      },
      {
        weekday: 'thursday',
        opensAt: '08:00',
        closesAt: '12:00',
        secondOpensAt: '14:00',
        secondClosesAt: '17:00',
      },
      {
        weekday: 'friday',
        opensAt: '08:00',
        closesAt: '12:00',
        secondOpensAt: '14:00',
        secondClosesAt: '17:00',
      },
      { weekday: 'saturday', opensAt: '08:00', closesAt: '11:00' },
    ],
    donationInfo: richText(
      'Para contribuir com a paróquia, fale com a secretaria paroquial, que orienta sobre o dízimo e as campanhas em andamento.',
    ),
  })

  await updateGlobal(payload, 'home-page', {
    _status: 'published',
    serviceLinks: [
      {
        title: 'Missas e confissões',
        description: 'Encontre sua celebração',
        url: '/horarios',
        icon: 'cross',
      },
      {
        title: 'Catequese e crisma',
        description: 'Caminhos de formação',
        url: '/vida/catequese',
        icon: 'book-open',
      },
      {
        title: 'Secretaria paroquial',
        description: 'Informações e acolhimento',
        url: '/secretaria',
        icon: 'phone',
      },
      {
        title: 'Como chegar',
        description: 'Venha celebrar conosco',
        url: '/secretaria',
        icon: 'map-pin',
      },
    ],
    communicationTitle: 'A vida da Igreja, mais perto de você.',
    communicationIntro:
      'Notícias, avisos e reflexões da paróquia e da Igreja.',
    participationTitle: 'A igreja azul. Uma história de encontros.',
    participationBody:
      'Conheça a matriz Nossa Senhora Aparecida e as comunidades que caminham juntas no Jardim Ingá.',
    participationImage: matrixPhoto,
    sacramentsTitle: 'A fé acompanha cada etapa da vida.',
    sacramentsIntro:
      'Encontre orientações para a preparação e converse com a secretaria sobre os próximos passos.',
    communitiesTitle: 'Uma paróquia. Muitos lugares de encontro.',
    communitiesIntro:
      'A mesma fé reúne a matriz e suas comunidades. Encontre a sua e saiba como participar.',
    projectsTitle: 'Projetos e parcerias',
    projectsIntro:
      'Iniciativas que fortalecem a comunidade e as formas de apoiar cada uma.',
    sponsorsTitle: 'Nossos patrocinadores',
    sponsorsIntro:
      'Empresas e pessoas que apoiam as iniciativas da nossa comunidade.',
    faithTitle: 'Rezar, aprender e servir juntos.',
    faithIntro:
      'A vida da comunidade continua em cada encontro, na oração e no cuidado com o próximo.',
    faithLinks: [
      {
        title: 'No coração dos pastores',
        description: 'Reflexões para a caminhada da comunidade.',
        url: '/vida/in-cordibus-pastorum',
      },
      {
        title: 'Espiritualidade',
        description: 'Leitura, silêncio e oração no dia a dia.',
        url: '/vida/espiritualidade',
      },
      {
        title: 'Liturgia diária',
        description: 'As leituras do dia na Canção Nova.',
        url: 'https://liturgia.cancaonova.com/pb/',
      },
      {
        title: 'Catequese e crisma',
        description: 'Orientações para começar ou retomar seu caminho.',
        url: '/vida/catequese',
      },
    ],
    showCommunication: true,
    showAgenda: true,
    showSacraments: true,
    showCommunities: true,
    showProjects: true,
    showSponsors: true,
    showFaith: true,
  })

  await updateGlobal(payload, 'secretariat-page', {
    title: 'Secretaria paroquial',
    intro: 'Atendimento, celebrações e os canais para falar com a equipe.',
    specialCelebrationsTitle: 'Celebrações especiais',
    specialCelebrationsBody:
      'Em datas como Natal, Páscoa e Festa da Padroeira, os horários podem mudar. Consulte os comunicados e confirme com a secretaria. Horários e contatos vêm da pesquisa e ainda precisam de validação.',
    specialCelebrationsImage: matrixArt,
  })

  await updateGlobal(payload, 'contact-page', {
    title: 'Fale conosco',
    intro:
      'Fale com a secretaria paroquial sobre sacramentos, pastorais, comunidades ou parcerias.',
    formIntro:
      'O atendimento é feito diretamente pela secretaria, pelo WhatsApp, telefone ou e-mail.',
  })
}

async function main() {
  const payload = await getPayload({ config })

  try {
    await ensureInitialAdmin(payload)
    const prototype = loadPrototypeContent()
    const communityIds = await seedCommunities(payload)
    await seedPeopleAndPastorals(payload)
    await seedSacramentGuides(payload)
    const postIds = await seedPosts(payload, prototype.posts, communityIds)
    await seedEvents(payload, communityIds)
    await seedHighlights(payload, prototype.slides, postIds)
    await seedProjectsAndSponsors(payload)
    await seedGlobals(payload)
    console.info(
      '[seed] Conteúdo de desenvolvimento sincronizado: 14 publicações, 4 destaques, 6 comunidades, 10 missas sem divergências, 3 eventos fictícios, 8 pessoas da equipe, 6 pastorais, 3 guias, 3 projetos e 7 patrocinadores não aprovados.',
    )
  } finally {
    await payload.db.destroy?.()
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error('[seed] Falha ao sincronizar o conteúdo de desenvolvimento.', error)
    process.exitCode = 1
    process.exit(1)
  })
