import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Community, Event, HomePage as HomePageData, Post, Project } from '@/payload-types'
import { Icon } from '@/components/site/Icon'
import { MediaImage } from '@/components/site/MediaImage'
import { SmartLink } from '@/components/site/SmartLink'

import { HeroCarousel, type HeroSlide } from './HeroCarousel'
import { SponsorsMarquee, type SponsorLogo } from './SponsorsMarquee'
import styles from './HomeSections.module.css'

type HomeSectionsProps = {
  home: HomePageData | null
  slides: HeroSlide[]
  posts: Post[]
  events: Event[]
  communities: Community[]
  projects: Project[]
  sponsors: SponsorLogo[]
  liturgyUrl?: string | null
}

const defaultServices = [
  {
    title: 'Missas e confissões',
    description: 'Encontre sua celebração',
    url: '/horarios',
    icon: 'church',
  },
  {
    title: 'Catequese e crisma',
    description: 'Caminhos de formação',
    url: '/vida/catequese',
    icon: 'book',
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
    icon: 'location',
  },
]

const sacraments = [
  {
    eyebrow: 'Iniciação cristã',
    title: 'Batismo',
    description: 'O início de uma caminhada na fé.',
    url: '/vida/batismo',
    action: 'Orientações',
    icon: 'church',
  },
  {
    eyebrow: 'Vida em família',
    title: 'Matrimônio',
    description: 'Preparação para a vida a dois.',
    url: '/vida/matrimonio',
    action: 'Saiba como começar',
    icon: 'heart',
  },
  {
    eyebrow: 'Formação e comunidade',
    title: 'Eucaristia e crisma',
    description: 'Crescer na fé e na participação.',
    url: '/vida/catequese',
    action: 'Conheça a catequese',
    icon: 'book',
  },
]

const defaultFaithLinks = [
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
    description: 'As leituras do dia para a sua oração.',
    url: 'https://liturgia.cancaonova.com/pb/',
  },
  {
    title: 'Catequese e crisma',
    description: 'Orientações para começar ou retomar seu caminho.',
    url: '/vida/catequese',
  },
]

const postFormats: Record<Post['format'], string> = {
  news: 'Notícia',
  article: 'Artigo',
  photos: 'Fotos',
  video: 'Vídeo',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(date))
}

function SectionHeading({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action}
      {children}
    </div>
  )
}

function ServiceIcon({ name }: { name?: string | null }) {
  if (name === 'book' || name === 'catequese') return <Icon name="book" />
  if (name === 'phone' || name === 'secretaria') return <Icon name="phone" />
  if (name === 'location' || name === 'mapa') return <Icon name="location" />
  return <Icon name="church" />
}

export function HomeSections({
  home,
  slides,
  posts,
  events,
  communities,
  projects,
  sponsors,
  liturgyUrl,
}: HomeSectionsProps) {
  const services = home?.serviceLinks?.length ? home.serviceLinks : defaultServices
  const faithLinks = home?.faithLinks?.length ? home.faithLinks : defaultFaithLinks
  const dailyLiturgyUrl = liturgyUrl || 'https://liturgia.cancaonova.com/pb/'

  return (
    <div className="page">
      <div className={`container ${styles.home}`}>
        <HeroCarousel slides={slides} />

        <nav className={styles.services} aria-label="Serviços e informações">
          {services.map(
            (service, index) =>
              service.url && (
                <SmartLink
                  href={service.url}
                  key={('id' in service && service.id) || `${service.title}-${index}`}
                >
                  <span className={styles.serviceIcon}>
                    <ServiceIcon name={service.icon || defaultServices[index]?.icon} />
                  </span>
                  <span>
                    <strong>{service.title || 'Saiba mais'}</strong>
                    {service.description && <small>{service.description}</small>}
                  </span>
                </SmartLink>
              ),
          )}
        </nav>

        {home?.showCommunication !== false && (
          <section className={styles.section} aria-labelledby="home-communication">
            <SectionHeading
              action={
                <SmartLink className="button-secondary" href="/comunicacao">
                  Todos os conteúdos <span aria-hidden="true">↗</span>
                </SmartLink>
              }
              eyebrow="Comunicação"
              title={home?.communicationTitle || 'A vida da Igreja, mais perto de você.'}
            />
            <span className="sr-only" id="home-communication">
              Comunicação
            </span>
            {home?.communicationIntro && <p className={styles.intro}>{home.communicationIntro}</p>}
            {posts.length ? (
              <div className={styles.postGrid}>
                {posts.map((post) => (
                  <article className={styles.postCard} key={post.id}>
                    <SmartLink className={styles.postCover} href={`/comunicacao/${post.slug}`}>
                      {post.cover ? (
                        <MediaImage
                          alt=""
                          image={post.cover}
                          sizes="(max-width: 650px) 50vw, (max-width: 950px) 50vw, 390px"
                        />
                      ) : (
                        <span className={styles.postCoverFallback}>
                          <Icon name="book" />
                          <span>Paróquia Nossa Senhora Aparecida</span>
                        </span>
                      )}
                    </SmartLink>
                    <div className={styles.postBody}>
                      <span className="eyebrow">{postFormats[post.format]}</span>
                      <h3>
                        <SmartLink href={`/comunicacao/${post.slug}`}>{post.title}</SmartLink>
                      </h3>
                      <p>{post.summary}</p>
                      <small>
                        <time dateTime={post.publishedAt || post.createdAt}>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </time>
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="notice">
                Os conteúdos da paróquia estão em preparação. Volte em breve para acompanhar as
                novidades.
              </p>
            )}
          </section>
        )}

        <section className={styles.participation} aria-labelledby="home-participation">
          <div>
            <span className="eyebrow">Nossa casa, sua comunidade</span>
            <h2 id="home-participation">
              {home?.participationTitle || 'A igreja azul. Uma história de encontros.'}
            </h2>
            <p>
              {home?.participationBody ||
                'Conheça a matriz Nossa Senhora Aparecida e as comunidades que caminham juntas no Jardim Ingá.'}
            </p>
            <div className={styles.actions}>
              <SmartLink className={styles.lightButton} href="/paroquia">
                Conheça a paróquia <span aria-hidden="true">↗</span>
              </SmartLink>
              <SmartLink className={styles.textLink} href="/contato">
                Como chegar <span aria-hidden="true">↗</span>
              </SmartLink>
            </div>
          </div>
          <div className={styles.participationImage}>
            {home?.participationImage ? (
              <MediaImage
                alt="Fachada da matriz Nossa Senhora Aparecida"
                image={home.participationImage}
                sizes="(max-width: 650px) 100vw, 580px"
              />
            ) : (
              <Image
                alt="Fachada azul da matriz Nossa Senhora Aparecida"
                height={900}
                sizes="(max-width: 650px) 100vw, 580px"
                src="/images/matriz-atual.jpg"
                width={1200}
              />
            )}
          </div>
        </section>

        {home?.showAgenda !== false && (
          <section className={styles.agenda} aria-labelledby="home-agenda">
            <div>
              <SectionHeading
                action={
                  <SmartLink className={styles.textLink} href="/agenda">
                    Agenda completa <span aria-hidden="true">↗</span>
                  </SmartLink>
                }
                eyebrow="Encontros e participação"
                title="Na nossa agenda"
              />
              <h2 className="sr-only" id="home-agenda">
                Agenda
              </h2>
              {events.length ? (
                <div>
                  {events.map((event) => {
                    const date = new Date(event.startsAt)
                    const community =
                      event.community && typeof event.community !== 'number'
                        ? event.community.name
                        : null
                    return (
                      <SmartLink
                        className={styles.eventRow}
                        href={`/eventos/${event.slug}`}
                        key={event.id}
                      >
                        <time className={styles.eventDate} dateTime={event.startsAt}>
                          <strong>
                            {new Intl.DateTimeFormat('pt-BR', {
                              day: '2-digit',
                              timeZone: 'America/Sao_Paulo',
                            }).format(date)}
                          </strong>
                          <small>
                            {new Intl.DateTimeFormat('pt-BR', {
                              month: 'short',
                              timeZone: 'America/Sao_Paulo',
                            })
                              .format(date)
                              .replace('.', '')}
                          </small>
                        </time>
                        <span className={styles.eventCopy}>
                          <small>{formatDate(event.startsAt)}</small>
                          <h3>{event.title}</h3>
                          <p>
                            {community || event.locationText || 'Paróquia Nossa Senhora Aparecida'}
                          </p>
                        </span>
                        <span className={styles.eventArrow} aria-hidden="true">
                          →
                        </span>
                      </SmartLink>
                    )
                  })}
                </div>
              ) : (
                <p className="notice">
                  Os próximos eventos serão publicados aqui. Consulte a agenda ou fale com a
                  secretaria para mais informações.
                </p>
              )}
            </div>
            <aside className={styles.celebrate}>
              <span className="eyebrow">Celebre conosco</span>
              <h2>Um tempo para a sua fé.</h2>
              <p>Consulte missas, confissões e orientações para participar da vida paroquial.</p>
              <SmartLink className="button" href="/horarios">
                Ver horários <span aria-hidden="true">↗</span>
              </SmartLink>
              <div className={styles.liturgy}>
                <span className="eyebrow">Liturgia diária</span>
                <h3>A Palavra do dia</h3>
                <SmartLink external className={styles.textLink} href={dailyLiturgyUrl}>
                  Leia na Canção Nova <span aria-hidden="true">↗</span>
                </SmartLink>
              </div>
            </aside>
          </section>
        )}

        {home?.showSacraments !== false && (
          <section className={styles.section} aria-labelledby="home-sacraments">
            <SectionHeading
              eyebrow="Sacramentos"
              title={home?.sacramentsTitle || 'A fé acompanha cada etapa da vida.'}
            >
              <p className={styles.headingIntro}>
                {home?.sacramentsIntro ||
                  'Encontre orientações para a preparação e converse com a secretaria sobre os próximos passos.'}
              </p>
            </SectionHeading>
            <h2 className="sr-only" id="home-sacraments">
              Sacramentos
            </h2>
            <div className={styles.sacramentGrid}>
              {sacraments.map((sacrament) => (
                <SmartLink href={sacrament.url} key={sacrament.title}>
                  <span className={styles.sacramentSymbol}>
                    <ServiceIcon name={sacrament.icon} />
                  </span>
                  <span className="eyebrow">{sacrament.eyebrow}</span>
                  <h3>{sacrament.title}</h3>
                  <p>{sacrament.description}</p>
                  <span className={styles.textLink}>
                    {sacrament.action} <span aria-hidden="true">↗</span>
                  </span>
                </SmartLink>
              ))}
            </div>
          </section>
        )}

        {home?.showCommunities !== false && (
          <section className={styles.communities} aria-labelledby="home-communities">
            <div>
              <span className="eyebrow">Nossas comunidades</span>
              <h2 id="home-communities">
                {home?.communitiesTitle || 'Uma paróquia. Muitos lugares de encontro.'}
              </h2>
              <p>
                {home?.communitiesIntro ||
                  'A mesma fé reúne a matriz e suas comunidades. Encontre a sua e saiba como participar.'}
              </p>
              <SmartLink className="button-secondary" href="/comunidades">
                Conheça as comunidades <span aria-hidden="true">↗</span>
              </SmartLink>
            </div>
            {communities.length ? (
              <div className={styles.communityList}>
                {communities.map((community) => (
                  <SmartLink href={`/comunidades/${community.slug}`} key={community.id}>
                    <span>
                      <strong>{community.name}</strong>
                      {community.region && <small>{community.region}</small>}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </SmartLink>
                ))}
              </div>
            ) : (
              <p className="notice">
                O cadastro das comunidades está em preparação. A secretaria pode orientar você sobre
                os locais de celebração.
              </p>
            )}
          </section>
        )}

        {home?.showProjects !== false && (
          <section className={styles.projects} aria-labelledby="home-projects">
            <div className={styles.projectVisual}>
              {projects[0]?.cover ? (
                <MediaImage
                  alt=""
                  image={projects[0].cover}
                  sizes="(max-width: 750px) 100vw, 550px"
                />
              ) : (
                <div className={styles.projectVisualFallback}>
                  <Icon name="heart" />
                  <span>Fé que se faz gesto, encontro e cuidado.</span>
                </div>
              )}
              <span>Partilha e missão</span>
            </div>
            <div className={styles.projectCopy}>
              <span className="eyebrow">Participe desta missão</span>
              <h2 id="home-projects">{home?.projectsTitle || 'Projetos e parcerias'}</h2>
              <p>
                {home?.projectsIntro ||
                  'Iniciativas que aproximam pessoas e fortalecem a comunidade.'}
              </p>
              {projects.length ? (
                <div className={styles.projectList}>
                  {projects.map((project) => (
                    <article key={project.id}>
                      <Icon name="heart" />
                      <div>
                        <h3>{project.title}</h3>
                        {project.summary && <p>{project.summary}</p>}
                        <SmartLink href={`/projetos#${project.slug}`}>
                          {project.ctaLabel || 'Conheça o projeto'}{' '}
                          <span aria-hidden="true">↗</span>
                        </SmartLink>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="notice">
                  Os projetos ativos serão apresentados aqui. Fale com a paróquia para conhecer as
                  formas de participação.
                </p>
              )}
              <div className={styles.actions}>
                <SmartLink className="button-secondary" href="/contato">
                  Seja um parceiro
                </SmartLink>
                <SmartLink className="button" href="/contribuir">
                  Quero doar <Icon name="heart" />
                </SmartLink>
              </div>
            </div>
          </section>
        )}

        {home?.showSponsors !== false && (
          <section className={styles.sponsors} aria-labelledby="home-sponsors">
            <span className="eyebrow">Apoio à comunidade</span>
            <h2 id="home-sponsors">{home?.sponsorsTitle || 'Nossos patrocinadores'}</h2>
            <p>{home?.sponsorsIntro || 'Parceiros que apoiam iniciativas da nossa comunidade.'}</p>
            {sponsors.length ? (
              <SponsorsMarquee sponsors={sponsors} />
            ) : (
              <p className="notice">
                Os apoiadores serão apresentados aqui após a confirmação das parcerias.
              </p>
            )}
          </section>
        )}

        {home?.showFaith !== false && (
          <section className={styles.faith} aria-labelledby="home-faith">
            <div>
              <span className="eyebrow">Vida cristã</span>
              <h2 id="home-faith">{home?.faithTitle || 'Rezar, aprender e servir juntos.'}</h2>
              <p>
                {home?.faithIntro ||
                  'A vida da comunidade continua em cada encontro, na oração e no cuidado com o próximo.'}
              </p>
              <SmartLink className="button" href="/vida/pastorais">
                Conheça as pastorais <span aria-hidden="true">↗</span>
              </SmartLink>
            </div>
            <div className={styles.faithLinks}>
              {faithLinks.map(
                (link, index) =>
                  link.url && (
                    <SmartLink
                      href={link.url}
                      key={('id' in link && link.id) || `${link.title}-${index}`}
                    >
                      <h3>
                        {link.title || 'Conheça mais'} <span aria-hidden="true">↗</span>
                      </h3>
                      {link.description && <p>{link.description}</p>}
                    </SmartLink>
                  ),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
