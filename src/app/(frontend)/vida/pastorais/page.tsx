import type { Metadata } from 'next'

import { EmptyState } from '@/components/life/EmptyState'
import { PastoralCard } from '@/components/life/PastoralCard'
import { PrayerCallout } from '@/components/life/PrayerCallout'
import styles from '@/components/life/life.module.css'
import { getActivePastorals } from '@/components/life/queries'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: 'Pastorais e movimentos',
  description: 'Conheça as pastorais ativas e encontre caminhos para servir e participar.',
}

export default async function PastoralsPage() {
  const pastorals = await getActivePastorals()

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PageHeader
          eyebrow="Vida cristã"
          title="Pastorais e movimentos"
          intro="Muitos dons, uma mesma missão. Encontre caminhos para servir e participar."
        />
        {pastorals.length > 0 ? (
          <div className={styles.pastoralGrid}>
            {pastorals.map((pastoral) => (
              <PastoralCard key={pastoral.id} pastoral={pastoral} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma pastoral publicada">
            <p>
              A relação de pastorais ativas será apresentada aqui. Enquanto isso, converse com a
              secretaria sobre as formas confirmadas de participação.
            </p>
          </EmptyState>
        )}
        <PrayerCallout />
      </div>
    </div>
  )
}
