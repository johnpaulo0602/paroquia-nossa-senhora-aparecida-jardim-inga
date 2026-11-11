import type { Metadata } from 'next'

import { PostGrid } from '@/components/life/PostGrid'
import { PrayerCallout } from '@/components/life/PrayerCallout'
import styles from '@/components/life/life.module.css'
import { getLifeSiteSettings, getReflections } from '@/components/life/queries'
import { PageHeader } from '@/components/site/PageHeader'
import { Icon } from '@/components/site/Icon'
import { StaticPicture } from '@/components/site/StaticPicture'
import { spiritualityPage as content } from '@/content/life'

export const metadata: Metadata = {
  title: 'Espiritualidade',
  description: 'Oração, escuta da Palavra, liturgia diária e reflexões para a vida cristã.',
}

export default async function SpiritualityPage() {
  const [posts, settings] = await Promise.all([
    getReflections('spirituality'),
    getLifeSiteSettings(),
  ])
  const liturgyUrl = settings.liturgyUrl || 'https://liturgia.cancaonova.com/pb/'
  const practices = content.practices

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title={content.title}
          intro={content.intro}
        />

        <section className={styles.spiritualHero} aria-labelledby="spiritual-hero-title">
          <StaticPicture
            image={content.heroImage}
            className={styles.spiritualImage}
            sizes="100vw"
          />
          <div>
            <span className="eyebrow">Na presença de Deus</span>
            <h2 id="spiritual-hero-title">
              {content.heroTitle}
            </h2>
            <p>
              {content.heroBody}
            </p>
            <a className="button" href={liturgyUrl} target="_blank" rel="noopener noreferrer">
              Liturgia diária <Icon name="external" />
            </a>
          </div>
        </section>

        <section aria-labelledby="practices-title">
          <h2 className={styles.visuallyHidden} id="practices-title">
            Práticas de espiritualidade
          </h2>
          <div className={styles.practiceGrid}>
            {practices.map((practice, index) => (
              <section key={practice.title}>
                <span className={styles.practiceNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{practice.title}</h3>
                <p>{practice.body}</p>
              </section>
            ))}
          </div>
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
