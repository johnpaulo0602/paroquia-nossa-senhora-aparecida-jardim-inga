import Link from 'next/link'

import type { SacramentGuide } from '@/payload-types'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'

import { EmptyState } from './EmptyState'
import styles from './life.module.css'

type SacramentGuideViewProps = {
  guide: SacramentGuide | null
  fallbackTitle: string
  fallbackIntro: string
}

export function SacramentGuideView({
  guide,
  fallbackTitle,
  fallbackIntro,
}: SacramentGuideViewProps) {
  const sections = guide?.sections ?? []
  const requirements = guide?.requirements ?? []
  const title = guide?.title ?? fallbackTitle

  return (
    <>
      <PageHeader eyebrow="Celebrações e vida cristã" title={title} intro={fallbackIntro} />
      <nav className={styles.topicNav} aria-label="Assuntos de vida cristã">
        <Link href="/vida">Visão geral</Link>
        <Link
          href="/vida/catequese"
          aria-current={guide?.slug === 'catequese' ? 'page' : undefined}
        >
          Catequese
        </Link>
        <Link href="/vida/pastorais">Pastorais</Link>
      </nav>

      {guide?.intro ? <RichText content={guide.intro} className={styles.guideIntro} /> : null}

      <div className={styles.guideLayout}>
        {sections.length > 0 ? (
          <nav className={styles.guideNav} aria-label={`Nesta página: ${title}`}>
            <span className="eyebrow">Nesta página</span>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id ?? index}>
                  <a href={`#guia-secao-${index + 1}`}>{section.title}</a>
                </li>
              ))}
              {requirements.length > 0 ? (
                <li>
                  <a href="#guia-requisitos">Requisitos</a>
                </li>
              ) : null}
              <li>
                <a href="#guia-secretaria">Atendimento</a>
              </li>
            </ol>
          </nav>
        ) : null}

        <div className={styles.guideContent}>
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <section key={section.id ?? index} aria-labelledby={`guia-secao-${index + 1}`}>
                <h2 id={`guia-secao-${index + 1}`}>{section.title}</h2>
                <RichText content={section.body} />
              </section>
            ))
          ) : (
            <EmptyState title="Orientações em preparação">
              <p>
                As seções deste guia ainda não foram publicadas. A secretaria pode informar os
                passos atuais e esclarecer dúvidas.
              </p>
            </EmptyState>
          )}

          {requirements.length > 0 ? (
            <section aria-labelledby="guia-requisitos">
              <h2 id="guia-requisitos">Documentação e requisitos</h2>
              <ul className={styles.requirements}>
                {requirements.map((requirement, index) => (
                  <li key={requirement.id ?? index}>
                    <span aria-hidden="true">✓</span>
                    <RichText content={requirement.text} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <section
        className={styles.secretariatPanel}
        id="guia-secretaria"
        aria-labelledby="guia-contato"
      >
        <div>
          <span className="eyebrow">Atendimento e confirmação</span>
          <h2 id="guia-contato">Converse com a secretaria</h2>
          {guide?.contactInfo ? (
            <RichText content={guide.contactInfo} />
          ) : (
            <p>
              A equipe informará preparação, documentos, inscrições e disponibilidade para o seu
              caso.
            </p>
          )}
          <p className="notice">
            Informar uma data de interesse não reserva a celebração. Datas, horários e demais
            condições só são confirmados pela secretaria paroquial.
          </p>
        </div>
        <Link className="button" href="/secretaria">
          Falar com a secretaria <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  )
}
