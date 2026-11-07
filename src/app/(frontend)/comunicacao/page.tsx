import type { Metadata } from 'next'

import { CommunicationFeed } from '@/components/communication/CommunicationFeed'
import { HighlightsCarousel } from '@/components/communication/HighlightsCarousel'
import { PageHeader } from '@/components/site/PageHeader'
import { activeDuring, getCMS } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Comunicação da paróquia',
  description: 'Notícias, artigos, fotografias e vídeos da Paróquia Nossa Senhora Aparecida.',
}

export default async function CommunicationPage() {
  const payload = await getCMS()
  const now = new Date()
  const active = activeDuring(now)

  const [highlights, posts] = await Promise.all([
    payload.find({
      collection: 'highlights',
      where: {
        and: [{ placement: { contains: 'communication' } }, ...active.and],
      },
      sort: 'order',
      limit: 4,
      depth: 2,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      where: { editorialAreas: { contains: 'communication' } },
      sort: '-publishedAt',
      limit: 6,
      page: 1,
      depth: 1,
      draft: false,
      overrideAccess: false,
    }),
  ])

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow="Informação, fé e comunidade"
          title="Comunicação da paróquia"
          intro="Notícias, reflexões e registros da nossa caminhada."
        />
        <HighlightsCarousel highlights={highlights.docs} />
        <CommunicationFeed
          initialPosts={posts.docs}
          initialTotal={posts.totalDocs}
          initialHasNextPage={posts.hasNextPage}
        />
      </div>
    </div>
  )
}
