import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import styles from '@/components/institutional/pages.module.css'
import { asMedia, safeExternalUrl } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { activeDuring, getCMS } from '@/lib/payload'
import { Icon } from '@/components/site/Icon'

export const metadata: Metadata = {
  title: 'Projetos e parcerias',
  description:
    'Iniciativas comunitárias, ações sociais e formas de parceria com a Paróquia Nossa Senhora Aparecida.',
}

export default async function ProjectsPage() {
  const payload = await getCMS()
  const now = new Date()

  const [projects, sponsors] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: {
        and: [{ active: { equals: true } }, activeDuring(now)],
      },
      overrideAccess: false,
      draft: false,
      depth: 2,
      sort: 'order',
      limit: 50,
    }),
    payload.find({
      collection: 'sponsors',
      where: {
        and: [{ approved: { equals: true } }, activeDuring(now)],
      },
      overrideAccess: false,
      draft: false,
      depth: 2,
      sort: 'order',
      limit: 50,
    }),
  ])

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow="Partilha, serviço e missão"
            title="Projetos e parcerias"
            intro="Conheça as iniciativas vinculadas à comunidade e saiba como apoiar ou propor parcerias institucionais."
          />
        </div>

        <section aria-labelledby="projects-list-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Fé em ação</span>
            <h2 id="projects-list-title">Iniciativas e propostas</h2>
            <p>Projetos sociais, mutirões e frentes de cuidado acompanhadas pela paróquia.</p>
          </div>

          {projects.docs.length > 0 ? (
            <div className={styles.projectGrid}>
              {projects.docs.map((project) => {
                const cover = asMedia(project.cover)
                return (
                  <article
                    className={styles.projectCard}
                    id={project.slug || undefined}
                    key={project.id}
                  >
                    {cover ? (
                      <MediaImage
                        image={cover}
                        alt={cover.alt || project.title}
                        className={styles.projectImage}
                        sizes="(max-width: 700px) 100vw, (max-width: 950px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.photoFallback}>Iniciativa comunitária</div>
                    )}
                    <div className={styles.projectCopy}>
                      <span className="eyebrow">Projeto comunitário</span>
                      <h2>{project.title}</h2>
                      {project.summary && (
                        <p className={styles.projectSummary}>{project.summary}</p>
                      )}
                      {project.body && (
                        <RichText content={project.body} className={styles.projectBody} />
                      )}
                      {project.institutionalContacts && (
                        <div className={styles.projectContacts}>
                          <RichText content={project.institutionalContacts} />
                        </div>
                      )}
                      <Link href="/contato">
                        {project.ctaLabel || 'Conversar sobre o projeto'} <Icon name="arrow" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="notice">
              Nenhum projeto ativo está publicado no momento. Entre em contato com a secretaria para
              conhecer as ações em andamento.
            </p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="sponsors-list-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Apoio institucional</span>
            <h2 id="sponsors-list-title">Apoiadores e patrocinadores</h2>
            <p>Marcas e parceiros com aprovação institucional vigente para exibição pública.</p>
          </div>

          {sponsors.docs.length > 0 ? (
            <div className={styles.sponsorGrid}>
              {sponsors.docs.map((sponsor) => {
                const logo = asMedia(sponsor.logo)
                const externalUrl = safeExternalUrl(sponsor.url)
                const content = (
                  <div>
                    {logo && (
                      <MediaImage
                        image={logo}
                        alt={logo.alt || sponsor.name}
                        className={styles.sponsorImage}
                        sizes="220px"
                      />
                    )}
                    <small>{sponsor.name}</small>
                  </div>
                )

                return externalUrl ? (
                  <a
                    className={styles.sponsor}
                    href={externalUrl}
                    key={sponsor.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <div className={styles.sponsor} key={sponsor.id}>
                    {content}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="notice">
              Os apoiadores oficiais serão exibidos nesta seção após confirmação e aprovação pela
              paróquia.
            </p>
          )}
        </section>

        <Callout
          eyebrow="Parcerias e responsabilidade social"
          title="Quer apoiar uma iniciativa ou propor uma parceria?"
          body="Converse com a secretaria paroquial para apresentar propostas de apoio comunitário ou institucional."
          href="/contato"
          linkLabel="Falar sobre parcerias"
        />
      </div>
    </div>
  )
}
