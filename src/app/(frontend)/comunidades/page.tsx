import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import styles from '@/components/institutional/pages.module.css'
import { asMedia } from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { getCMS } from '@/lib/payload'
import { Icon } from '@/components/site/Icon'

export const metadata: Metadata = {
  title: 'Comunidades',
  description: 'Conheça a matriz e as comunidades da Paróquia Nossa Senhora Aparecida.',
}

export default async function CommunitiesPage() {
  const payload = await getCMS()
  const communities = await payload.find({
    collection: 'communities',
    where: { active: { equals: true } },
    overrideAccess: false,
    draft: false,
    depth: 2,
    sort: 'order',
    limit: 100,
  })

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow="Uma paróquia, muitos lugares de encontro"
            title="Nossas comunidades"
            intro="Encontre uma comunidade, conheça sua história e consulte as celebrações publicadas."
          />
        </div>

        {communities.docs.length ? (
          <div className={styles.communityGrid}>
            {communities.docs.map((community) => {
              const cover = asMedia(community.cover)
              return (
                <article className={styles.communityCard} key={community.id}>
                  {cover ? (
                    <MediaImage
                      image={cover}
                      alt={cover.alt || `Imagem da comunidade ${community.name}`}
                      className={styles.communityCardImage}
                      sizes="(max-width: 700px) 100vw, (max-width: 950px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.communityCardFallback} aria-hidden="true">
                      <Icon name="church" />
                    </div>
                  )}
                  <div className={styles.communityCardCopy}>
                    <span className="eyebrow">
                      {community.type === 'matrix' ? 'Matriz' : 'Comunidade'}
                      {community.region ? ` · ${community.region}` : ''}
                    </span>
                    <h2>{community.name}</h2>
                    {community.address ? (
                      <p>{community.address}</p>
                    ) : (
                      <p>Apresentação e endereço disponíveis na página da comunidade.</p>
                    )}
                    <Link href={`/comunidades/${community.slug}`}>
                      Conhecer a comunidade <Icon name="arrow" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="notice">Nenhuma comunidade ativa foi publicada até o momento.</p>
        )}

        <Callout
          eyebrow="Informação e acolhimento"
          title="Quer participar de uma comunidade?"
          body="A secretaria paroquial pode ajudar com informações sobre celebrações e atividades."
          href="/secretaria"
          linkLabel="Falar com a secretaria"
        />
      </div>
    </div>
  )
}
