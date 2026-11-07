import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/life/EmptyState'
import { MonthPicker } from '@/components/life/MonthPicker'
import styles from '@/components/life/life.module.css'
import { getTitheWallContent } from '@/components/life/queries'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'

export const metadata: Metadata = {
  title: 'Mural do dízimo',
  description: 'Gratidão, partilha e compromisso com a vida da comunidade.',
}

export default async function TitheWallPage() {
  const content = await getTitheWallContent()
  const reasons = content.reasons ?? []

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title={content.title || 'Mural do dízimo'}
          intro={content.intro || 'Gratidão, partilha e compromisso com a vida da comunidade.'}
        />

        <MonthPicker initialMonth={new Date().getMonth()} />

        <section className={styles.titheIntro} aria-labelledby="tithe-intro-title">
          <div>
            <span className="eyebrow">Uma comunidade que partilha</span>
            <h2 id="tithe-intro-title">
              {content.titheTitle || 'Dízimo é cuidado com a nossa missão.'}
            </h2>
            {content.titheBody ? (
              <RichText content={content.titheBody} />
            ) : (
              <p>
                A participação no dízimo expressa gratidão e corresponsabilidade pela comunidade. A
                secretaria pode orientar sobre cadastro e formas de contribuição aprovadas pela
                paróquia.
              </p>
            )}
            <Link className="button" href="/secretaria">
              Quero ser dizimista <span aria-hidden="true">↗</span>
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
          {reasons.length > 0 ? (
            <ol className={styles.reasons}>
              {reasons.map((reason, index) => (
                <li key={reason.id ?? index}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{reason.title}</h3>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="Motivos em preparação">
              <p>As orientações sobre o dízimo serão publicadas nesta página.</p>
            </EmptyState>
          )}
        </section>

        <section className={styles.registration} aria-labelledby="interest-title">
          <div>
            <span className="eyebrow">Caminhe conosco</span>
            <h2 id="interest-title">
              {content.interestTitle || 'Tenho interesse em ser dizimista'}
            </h2>
            <p>
              {content.interestBody ||
                'Converse com a secretaria para receber orientações da equipe e conhecer as formas de participação.'}
            </p>
          </div>
          <div>
            <p>
              O atendimento é feito pelos canais da secretaria. Esta página não coleta dados,
              realiza cadastro nem recebe pagamentos.
            </p>
            <Link className="button" href="/secretaria">
              Falar com a secretaria <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
