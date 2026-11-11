import Link from 'next/link'

import type { SacramentGuide } from '@/payload-types'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'

import { SacramentRequestForm } from '@/components/forms/SacramentRequestForm'
import { featureEnabled } from '@/lib/features'

import { EmptyState } from './EmptyState'
import { getActiveCommunities } from './queries'
import styles from './life.module.css'
import { Icon } from '@/components/site/Icon'

type SacramentGuideViewProps = {
  guide: SacramentGuide | null
  fallbackTitle: string
  fallbackIntro: string
}

export async function SacramentGuideView({
  guide,
  fallbackTitle,
  fallbackIntro,
}: SacramentGuideViewProps) {
  const sections = guide?.sections ?? []
  const requirements = guide?.requirements ?? []
  const title = guide?.title ?? fallbackTitle
  const formType =
    featureEnabled('SACRAMENT_FORM_ENABLED') &&
    (guide?.formType === 'baptism' || guide?.formType === 'marriage')
      ? guide.formType
      : null
  const communities = formType ? await getActiveCommunities() : []

  return (
    <>
      {/* The CMS intro (rendered below) replaces the fallback, so the sentence never shows twice. */}
      <PageHeader
        eyebrow="Celebrações e vida cristã"
        title={title}
        intro={guide?.intro ? undefined : fallbackIntro}
      />
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
              {formType ? (
                <li>
                  <a href="#guia-pedido">Fazer o pedido</a>
                </li>
              ) : null}
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
                    <Icon name="check" />
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
        <Link className={formType ? 'button-secondary' : 'button'} href="/secretaria">
          Falar com a secretaria <Icon name="arrow" />
        </Link>
      </section>

      {formType && (
        <section className={styles.requestPanel} id="guia-pedido" aria-labelledby="guia-pedido-titulo">
          <span className="eyebrow">Pedido pelo site</span>
          <h2 id="guia-pedido-titulo">
            {formType === 'baptism' ? 'Peça o batismo' : 'Peça o casamento'}
          </h2>
          <p>
            Preencha o que já souber. A secretaria recebe o pedido e entra em contato para
            combinar a preparação, os documentos e a data.
          </p>
          <SacramentRequestForm communities={communities} type={formType} />
        </section>
      )}
    </>
  )
}
