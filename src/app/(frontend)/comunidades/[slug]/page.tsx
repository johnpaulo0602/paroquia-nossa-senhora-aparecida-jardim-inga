import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CelebrationList } from '@/components/institutional/CelebrationList'
import styles from '@/components/institutional/pages.module.css'
import {
  asMedia,
  emailHref,
  phoneHref,
  safeExternalUrl,
  whatsappHref,
} from '@/components/institutional/utils'
import { MediaImage } from '@/components/site/MediaImage'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { getCMS } from '@/lib/payload'
import { Icon } from '@/components/site/Icon'

type CommunityPageProps = {
  params: Promise<{ slug: string }>
}

async function getCommunity(slug: string) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'communities',
    where: {
      and: [{ slug: { equals: slug } }, { active: { equals: true } }],
    },
    overrideAccess: false,
    draft: false,
    depth: 2,
    limit: 1,
  })

  return result.docs[0] || null
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { slug } = await params
  const community = await getCommunity(slug)
  if (!community) return { title: 'Comunidade não encontrada' }

  return {
    title: community.name,
    description:
      community.region ||
      `Informações e celebrações da comunidade ${community.name}, da Paróquia Nossa Senhora Aparecida.`,
  }
}

export default async function CommunityDetailPage({ params }: CommunityPageProps) {
  const { slug } = await params
  const community = await getCommunity(slug)
  if (!community) notFound()

  const payload = await getCMS()
  const now = new Date().toISOString()
  const [settings, celebrations] = await Promise.all([
    payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.find({
      collection: 'celebrations',
      where: {
        and: [
          { community: { equals: community.id } },
          { active: { equals: true } },
          {
            or: [{ validFrom: { less_than_equal: now } }, { validFrom: { exists: false } }],
          },
          { or: [{ validTo: { greater_than_equal: now } }, { validTo: { exists: false } }] },
        ],
      },
      overrideAccess: false,
      draft: false,
      depth: 2,
      limit: 100,
    }),
  ])
  const cover = asMedia(community.cover)
  const mapUrl = safeExternalUrl(community.mapUrl)
  const secretariatWhatsapp = settings.whatsapp
    ? whatsappHref(
        settings.whatsapp,
        `Olá! Gostaria de informações sobre a comunidade ${community.name}.`,
      )
    : null
  const communityWhatsapp = community.publicWhatsapp ? whatsappHref(community.publicWhatsapp) : null

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <Link className={styles.backLink} href="/comunidades">
          <Icon name="arrowLeft" /> Todas as comunidades
        </Link>
        <div className={styles.header}>
          <PageHeader
            eyebrow={community.type === 'matrix' ? 'Igreja matriz' : 'Comunidade paroquial'}
            title={community.name}
            intro={
              community.region
                ? `${community.region} · Paróquia Nossa Senhora Aparecida`
                : 'Paróquia Nossa Senhora Aparecida · Jardim Ingá'
            }
          />
        </div>

        {cover ? (
          <figure className={styles.cover}>
            <MediaImage
              image={cover}
              alt={cover.alt || `Imagem da comunidade ${community.name}`}
              className={styles.coverImage}
              sizes="(max-width: 1200px) 100vw, 1160px"
            />
            {(cover.caption || cover.credit) && (
              <figcaption>{[cover.caption, cover.credit].filter(Boolean).join(' · ')}</figcaption>
            )}
          </figure>
        ) : null}

        <div className={styles.communityDetail}>
          <section aria-labelledby="community-participation-title">
            <span className="eyebrow">Vida em comunidade</span>
            <h2 id="community-participation-title">Venha participar</h2>
            {community.description ? (
              <RichText content={community.description} className={styles.communityDescription} />
            ) : (
              <p className={styles.communityDescription}>
                Para saber mais sobre celebrações, atividades e formas de participação nesta
                comunidade, fale com a secretaria paroquial.
              </p>
            )}

            {(community.address || mapUrl) && (
              <div className={styles.addressBlock}>
                <h2>Endereço e localização</h2>
                {community.address && <p>{community.address}</p>}
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    Abrir no mapa <Icon name="external" />
                  </a>
                )}
              </div>
            )}
          </section>

          <aside className={styles.communitySidebar}>
            <section className={styles.infoPanel} aria-labelledby="community-celebrations-title">
              <span className="eyebrow">Celebrações</span>
              <h2 id="community-celebrations-title">Horários publicados</h2>
              <CelebrationList celebrations={celebrations.docs} />
            </section>

            <section className={styles.infoPanel} aria-labelledby="community-contact-title">
              <span className="eyebrow">Informações e acolhimento</span>
              <h2 id="community-contact-title">Fale com a secretaria</h2>
              <p>
                Confirme horários e tire dúvidas sobre a participação nesta comunidade com a
                secretaria paroquial.
              </p>
              {secretariatWhatsapp ? (
                <a
                  className="button"
                  href={secretariatWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp da secretaria <Icon name="external" />
                </a>
              ) : (
                <Link className="button" href="/secretaria">
                  Ver atendimento da secretaria <Icon name="arrow" />
                </Link>
              )}

              {(community.publicPhone || community.publicEmail || communityWhatsapp) && (
                <div className={styles.personLinks}>
                  {community.publicPhone && (
                    <a href={phoneHref(community.publicPhone)}>
                      Telefone da comunidade <Icon name="arrow" />
                    </a>
                  )}
                  {community.publicEmail && (
                    <a href={emailHref(community.publicEmail)}>
                      E-mail da comunidade <Icon name="arrow" />
                    </a>
                  )}
                  {communityWhatsapp && (
                    <a href={communityWhatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp da comunidade <Icon name="external" />
                    </a>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
