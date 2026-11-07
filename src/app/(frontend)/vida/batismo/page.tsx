import type { Metadata } from 'next'

import { SacramentGuideView } from '@/components/life/SacramentGuideView'
import styles from '@/components/life/life.module.css'
import { getSacramentGuide } from '@/components/life/queries'

export const metadata: Metadata = {
  title: 'Batismo',
  description: 'Preparação, requisitos e orientações para a celebração do Batismo.',
}

export default async function BaptismPage() {
  const guide = await getSacramentGuide('batismo')

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <SacramentGuideView
          guide={guide}
          fallbackTitle="Batismo"
          fallbackIntro="O início da vida cristã, em comunidade."
        />
      </div>
    </div>
  )
}
