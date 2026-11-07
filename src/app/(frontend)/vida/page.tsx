import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/site/PageHeader'
import { getLifeSiteSettings } from '@/components/life/queries'
import styles from '@/components/life/life.module.css'

export const metadata: Metadata = {
  title: 'Vida cristã',
  description: 'Orientações para os sacramentos, catequese, pastorais e vida de oração.',
}

const guides = [
  {
    title: 'Batismo',
    text: 'Conheça a preparação, os requisitos e os passos para conversar sobre a celebração.',
    href: '/vida/batismo',
    link: 'Ver orientações',
  },
  {
    title: 'Matrimônio',
    text: 'Prepare a celebração e a vida em família com o acompanhamento da comunidade.',
    href: '/vida/matrimonio',
    link: 'Ver orientações',
  },
  {
    title: 'Catequese',
    text: 'Um caminho de formação, encontro com Jesus e participação na vida da Igreja.',
    href: '/vida/catequese',
    link: 'Conhecer a catequese',
  },
  {
    title: 'Confissão e unção dos enfermos',
    text: 'A secretaria orientará sobre atendimento e contato com o sacerdote.',
    href: '/secretaria',
    link: 'Consultar a secretaria',
  },
]

const pathways = [
  {
    title: 'Pastorais e movimentos',
    text: 'Descubra formas de colocar seus dons a serviço da comunidade.',
    href: '/vida/pastorais',
  },
  {
    title: 'In Cordibus Pastorum',
    text: 'Formação, escuta e reflexões para a caminhada da nossa comunidade.',
    href: '/vida/in-cordibus-pastorum',
  },
  {
    title: 'Espiritualidade',
    text: 'Um convite à oração, à escuta da Palavra e ao cuidado com a vida.',
    href: '/vida/espiritualidade',
  },
  {
    title: 'Mural do dízimo',
    text: 'Gratidão, partilha e compromisso com a missão paroquial.',
    href: '/vida/mural-do-dizimo',
  },
]

export default async function ChristianLifePage() {
  const settings = await getLifeSiteSettings()
  const liturgyUrl = settings.liturgyUrl || 'https://liturgia.cancaonova.com/pb/'

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Oração · Formação · Participação"
          title="Vida cristã"
          intro="Encontre orientações para participar da vida paroquial."
        />
        <nav className={styles.topicNav} aria-label="Assuntos de vida cristã">
          <Link href="/vida" aria-current="page">
            Sacramentos
          </Link>
          <Link href="/vida/catequese">Catequese</Link>
          <Link href="/vida/pastorais">Pastorais</Link>
        </nav>

        <section aria-labelledby="sacraments-title">
          <div className={styles.sectionIntro}>
            <h2 id="sacraments-title">Sacramentos e formação</h2>
            <p>Procure a secretaria para receber as orientações confirmadas pela paróquia.</p>
          </div>
          <div className={styles.guideGrid}>
            {guides.map((guide) => (
              <section className={styles.guideCard} key={guide.title}>
                <h3>{guide.title}</h3>
                <p>{guide.text}</p>
                <Link className={styles.textLink} href={guide.href}>
                  {guide.link} <span aria-hidden="true">↗</span>
                </Link>
              </section>
            ))}
          </div>
        </section>

        <section className={styles.pathways} aria-labelledby="pathways-title">
          <div>
            <span className="eyebrow">Caminhe conosco</span>
            <h2 id="pathways-title">Há um lugar para você na comunidade.</h2>
            <p>Reze, aprenda, participe e encontre uma forma de servir.</p>
          </div>
          <div className={styles.pathwayLinks}>
            {pathways.map((pathway) => (
              <Link href={pathway.href} key={pathway.href}>
                <span>
                  <strong>{pathway.title}</strong>
                  <small>{pathway.text}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.liturgyPanel} aria-labelledby="liturgy-title">
          <div>
            <span className="eyebrow">Para sua oração</span>
            <h2 id="liturgy-title">Liturgia diária</h2>
            <p>Leituras e referências do dia em uma fonte externa.</p>
          </div>
          <a
            className="button button-secondary"
            href={liturgyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar a liturgia <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </div>
  )
}
