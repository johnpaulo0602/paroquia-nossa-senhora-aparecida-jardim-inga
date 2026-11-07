import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PastoralDetail } from '@/components/life/PastoralDetail'
import styles from '@/components/life/life.module.css'
import { getPastoralBySlug } from '@/components/life/queries'

type PastoralPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PastoralPageProps): Promise<Metadata> {
  const { slug } = await params
  const pastoral = await getPastoralBySlug(slug)

  if (!pastoral) return { title: 'Pastoral não encontrada' }

  return {
    title: pastoral.title,
    description: `Conheça a missão, as atividades e as formas de participação da pastoral ${pastoral.title}.`,
  }
}

export default async function PastoralPage({ params }: PastoralPageProps) {
  const { slug } = await params
  const pastoral = await getPastoralBySlug(slug)

  if (!pastoral) notFound()

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <PastoralDetail pastoral={pastoral} />
      </div>
    </div>
  )
}
