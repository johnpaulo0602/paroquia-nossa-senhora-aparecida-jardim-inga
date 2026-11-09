import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import { ContactCards } from '@/components/institutional/ContactCards'
import styles from '@/components/institutional/pages.module.css'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { getCMS } from '@/lib/payload'
import { Icon } from '@/components/site/Icon'

export const metadata: Metadata = {
  title: 'Dízimo e doações',
  description:
    'Formas de participação, dízimo, voluntariado e apoio à missão da Paróquia Nossa Senhora Aparecida.',
}

export default async function ContributePage() {
  const payload = await getCMS()
  const [page, settings] = await Promise.all([
    payload.findGlobal({
      slug: 'contribution-page',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
  ])

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow="Partilha e corresponsabilidade"
            title={page.title || 'Sua participação faz a comunidade.'}
            intro={
              page.intro ||
              'Há muitas formas de contribuir com a evangelização, a manutenção dos espaços e o cuidado com o próximo.'
            }
          />
        </div>

        {page.body ? (
          <RichText content={page.body} className={styles.contributionBody} />
        ) : (
          <p className={styles.contributionBody}>
            A vida paroquial é sustentada pela oração, pelo serviço voluntário e pela partilha dos
            fiéis. Procure a secretaria para conhecer as formas oficiais de colaboração.
          </p>
        )}

        {settings.donationInfo && (
          <section className={styles.donationInfo} aria-labelledby="official-donation-info-title">
            <h2 id="official-donation-info-title">Orientação sobre canais de doação</h2>
            <RichText content={settings.donationInfo} className={styles.contributionBody} />
          </section>
        )}

        <p className={`notice ${styles.noticeSpace}`}>
          {page.donationNotice ||
            'Esta página não realiza cobrança, checkout nem exibe chaves Pix ou contas bancárias sem confirmação oficial da paróquia.'}
        </p>

        <section className={styles.contributionCards} aria-label="Formas de participar">
          <article className={styles.contributionCard}>
            <span className="eyebrow">Partilha mensal</span>
            <h2>Seja dizimista</h2>
            <p>
              O dízimo é um gesto livre e consciente de gratidão a Deus e de cuidado com a missão da
              comunidade.
            </p>
            <Link href="/vida/mural-do-dizimo">
              Conhecer o Mural do dízimo <Icon name="arrow" />
            </Link>
          </article>

          <article className={styles.contributionCard}>
            <span className="eyebrow">Dons e serviço</span>
            <h2>Participe de uma pastoral</h2>
            <p>
              Ofereça seu tempo e seus talentos nas celebrações, na formação, na acolhida ou na ação
              solidária.
            </p>
            <Link href="/vida/pastorais">
              Ver pastorais e movimentos <Icon name="arrow" />
            </Link>
          </article>

          <article className={styles.contributionCard}>
            <span className="eyebrow">Apoio comunitário</span>
            <h2>Projetos e parcerias</h2>
            <p>
              Conheça propostas de cuidado social e saiba como apoiar iniciativas com a equipe
              paroquial.
            </p>
            <Link href="/projetos">
              Conhecer projetos <Icon name="arrow" />
            </Link>
          </article>

          <article className={styles.contributionCard}>
            <span className="eyebrow">Atendimento oficial</span>
            <h2>Confirme na secretaria</h2>
            <p>
              Antes de realizar qualquer contribuição financeira ou entrega de doações materiais,
              confirme os procedimentos diretamente na secretaria.
            </p>
            <Link href="/secretaria">
              Falar com a secretaria <Icon name="arrow" />
            </Link>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="contribute-contacts-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Canais de confirmação</span>
            <h2 id="contribute-contacts-title">Atendimento da secretaria paroquial</h2>
          </div>
          <ContactCards settings={settings} />
        </section>

        <Callout
          eyebrow="Dúvidas ou orientações"
          title="Precisa falar com a equipe paroquial?"
          body="Entre em contato pelos canais oficiais para receber orientações seguras sobre doações, campanhas e participação."
          href="/contato"
          linkLabel="Ir para Fale conosco"
        />
      </div>
    </div>
  )
}
