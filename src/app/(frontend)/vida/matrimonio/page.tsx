import type { Metadata } from 'next'

import { SacramentGuideView } from '@/components/life/SacramentGuideView'
import styles from '@/components/life/life.module.css'
import { getSacramentGuide } from '@/components/life/queries'

export const metadata: Metadata = {
  title: 'Matrimônio',
  description: 'Preparação, requisitos e orientações para a celebração do Matrimônio.',
}

export default async function MarriagePage() {
  const guide = await getSacramentGuide('matrimonio')

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <SacramentGuideView
          guide={guide}
          fallbackTitle="Matrimônio"
          fallbackIntro="Preparar a celebração é também preparar a vida em família."
        />
      </div>
    </div>
  )
}
