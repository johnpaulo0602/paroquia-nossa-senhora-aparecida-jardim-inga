import type { Metadata } from 'next'
import Link from 'next/link'

import { ClergyList } from '@/components/life/ClergyList'
import { PostGrid } from '@/components/life/PostGrid'
import { PrayerCallout } from '@/components/life/PrayerCallout'
import styles from '@/components/life/life.module.css'
import { getClergy, getReflections } from '@/components/life/queries'
import { PageHeader } from '@/components/site/PageHeader'
import { Icon } from '@/components/site/Icon'
import { StaticPicture } from '@/components/site/StaticPicture'
import { pastorumPage as content } from '@/content/life'

export const metadata: Metadata = {
  title: 'In Cordibus Pastorum',
  description: 'Formação, escuta e reflexões da equipe sacerdotal para a caminhada da comunidade.',
}

export default async function PastorumPage() {
  const [clergy, posts] = await Promise.all([
    getClergy(),
    getReflections('pastorum'),
  ])

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title={content.title}
          intro={content.intro}
        />

        <section className={styles.pastorIntro} aria-labelledby="pastor-intro-title">
          <StaticPicture
            image={content.image}
            className={styles.pastorImage}
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div>
            <span className="eyebrow">A palavra dos nossos pastores</span>
            <h2 id="pastor-intro-title">
              {content.sectionTitle}
            </h2>
            <p>
              {content.sectionBody}
            </p>
            <ClergyList people={clergy} />
            <Link className={styles.textLink} href="/equipe">
              Conheça a estrutura paroquial <Icon name="arrow" />
            </Link>
          </div>
        </section>

        <section aria-labelledby="pastorum-reflections-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Para refletir</span>
            <h2 id="pastorum-reflections-title">Palavras para a caminhada</h2>
          </div>
          <PostGrid posts={posts} />
        </section>
        <PrayerCallout />
      </div>
    </div>
  )
}
