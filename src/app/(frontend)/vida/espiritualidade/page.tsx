import type { Metadata } from 'next'

import { EmptyState } from '@/components/life/EmptyState'
import { MediaPanel } from '@/components/life/MediaPanel'
import { PostGrid } from '@/components/life/PostGrid'
import { PrayerCallout } from '@/components/life/PrayerCallout'
import styles from '@/components/life/life.module.css'
import {
  getLifeSiteSettings,
  getReflections,
  getSpiritualityContent,
} from '@/components/life/queries'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: 'Espiritualidade',
  description: 'Oração, escuta da Palavra, liturgia diária e reflexões para a vida cristã.',
}

export default async function SpiritualityPage() {
  const [content, posts, settings] = await Promise.all([
    getSpiritualityContent(),
    getReflections('spirituality'),
    getLifeSiteSettings(),
  ])
  const liturgyUrl = settings.liturgyUrl || 'https://liturgia.cancaonova.com/pb/'
  const practices = content.practices ?? []

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title={content.title || 'Cultive sua espiritualidade'}
          intro={
            content.intro || 'Um convite à oração, à escuta da Palavra e ao cuidado com a vida.'
          }
        />

        <section className={styles.spiritualHero} aria-labelledby="spiritual-hero-title">
          <MediaPanel
            image={content.heroImage}
            alt=""
            className={styles.spiritualImage}
            sizes="100vw"
          />
          <div>
            <span className="eyebrow">Na presença de Deus</span>
            <h2 id="spiritual-hero-title">
              {content.heroTitle || 'A fé também habita os pequenos momentos.'}
            </h2>
            <p>
              {content.heroBody ||
                'Encontre tempo para silenciar, agradecer e rezar. Caminhos simples podem nutrir sua oração pessoal e comunitária.'}
            </p>
            <a className="button" href={liturgyUrl} target="_blank" rel="noopener noreferrer">
              Liturgia diária <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section aria-labelledby="practices-title">
          <h2 className={styles.visuallyHidden} id="practices-title">
            Práticas de espiritualidade
          </h2>
          {practices.length > 0 ? (
            <div className={styles.practiceGrid}>
              {practices.map((practice, index) => (
                <section key={practice.id ?? index}>
                  <span className={styles.practiceNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{practice.title || 'Prática de oração'}</h3>
                  {practice.body ? <p>{practice.body}</p> : null}
                </section>
              ))}
            </div>
          ) : (
            <EmptyState title="Práticas em preparação">
              <p>Novas orientações para a oração serão publicadas pela equipe paroquial.</p>
            </EmptyState>
          )}
        </section>

        <section aria-labelledby="spirituality-reflections-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Leituras para a caminhada</span>
            <h2 id="spirituality-reflections-title">Leituras para refletir</h2>
          </div>
          <PostGrid posts={posts} />
        </section>
        <PrayerCallout />
      </div>
    </div>
  )
}
