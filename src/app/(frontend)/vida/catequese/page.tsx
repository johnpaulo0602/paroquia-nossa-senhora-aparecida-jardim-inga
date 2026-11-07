import type { Metadata } from 'next'

import { SacramentGuideView } from '@/components/life/SacramentGuideView'
import styles from '@/components/life/life.module.css'
import { getSacramentGuide } from '@/components/life/queries'

export const metadata: Metadata = {
  title: 'Catequese',
  description: 'Orientações para a catequese e a participação na vida da comunidade.',
}

export default async function CatechesisPage() {
  const guide = await getSacramentGuide('catequese')

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <SacramentGuideView
          guide={guide}
          fallbackTitle="Catequese"
          fallbackIntro="Um caminho de formação e participação na comunidade."
        />
      </div>
    </div>
  )
}
