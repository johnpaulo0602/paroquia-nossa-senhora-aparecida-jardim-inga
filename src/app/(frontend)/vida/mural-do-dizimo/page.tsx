import type { Metadata } from 'next'
import Link from 'next/link'

import { MonthPicker } from '@/components/life/MonthPicker'
import styles from '@/components/life/life.module.css'
import { PageHeader } from '@/components/site/PageHeader'
import { TitheInterestForm } from '@/components/forms/TitheInterestForm'
import { Icon } from '@/components/site/Icon'
import { titheWallPage as content } from '@/content/life'
import { featureEnabled } from '@/lib/features'

export const metadata: Metadata = {
  title: 'Mural do dízimo',
  description: 'Gratidão, partilha e compromisso com a vida da comunidade.',
}

export default function TitheWallPage() {
  const reasons = content.reasons

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title={content.title}
          intro={content.intro}
        />

        <MonthPicker initialMonth={new Date().getMonth()} />

        <section className={styles.titheIntro} aria-labelledby="tithe-intro-title">
          <div>
            <span className="eyebrow">Uma comunidade que partilha</span>
            <h2 id="tithe-intro-title">
              {content.titheTitle}
            </h2>
            {content.titheParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link className="button" href="/secretaria">
              Quero ser dizimista <Icon name="arrow" />
            </Link>
          </div>
          <div className={styles.titheStatement}>
            <span aria-hidden="true">“</span>
            <p>
              Partilhar é reconhecer que a missão se constrói com a participação de cada pessoa.
            </p>
          </div>
        </section>

        <section aria-labelledby="reasons-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Fé que se faz participação</span>
            <h2 id="reasons-title">Motivos para partilhar</h2>
          </div>
          <ol className={styles.reasons}>
            {reasons.map((reason, index) => (
              <li key={reason}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{reason}</h3>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.registration} aria-labelledby="interest-title">
          <div>
            <span className="eyebrow">Caminhe conosco</span>
            <h2 id="interest-title">
              {content.interestTitle}
            </h2>
            <p>
              {content.interestBody}
            </p>
          </div>
          <div>
            {featureEnabled('TITHE_FORM_ENABLED') ? (
              <>
                <p>
                  Deixe seu nome e e-mail e a pastoral do dízimo entra em contato. Esta página não
                  recebe pagamentos.
                </p>
                <TitheInterestForm />
              </>
            ) : (
              <>
                <p>
                  O atendimento é feito pelos canais da secretaria. Esta página não coleta dados,
                  realiza cadastro nem recebe pagamentos.
                </p>
                <Link className="button" href="/secretaria">
                  Falar com a secretaria <Icon name="arrow" />
                </Link>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
