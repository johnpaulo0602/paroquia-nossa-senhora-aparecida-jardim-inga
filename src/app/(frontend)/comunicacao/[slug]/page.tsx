import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { PostCard } from '@/components/communication/PostCard'
import {
  isMedia,
  postCategoryLabels,
  postFormatLabels,
  safeExternalUrl,
  videoEmbedUrl,
} from '@/components/communication/content'
import { MediaImage } from '@/components/site/MediaImage'
import { RichText } from '@/components/site/RichText'
import { formatParishDate } from '@/lib/dates'
import { getCMS } from '@/lib/payload'
import type { Post } from '@/payload-types'

import styles from '@/components/communication/communication.module.css'
import { Icon } from '@/components/site/Icon'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

const getPost = cache(async (slug: string) => {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { editorialAreas: { contains: 'communication' } }],
    },
    limit: 1,
    depth: 3,
    draft: false,
    overrideAccess: false,
  })
  return result.docs[0] || null
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return { title: 'Publicação não encontrada' }
  return { title: post.title, description: post.summary }
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  const payload = await getCMS()
  const manuallyRelated = (post.relatedPosts || []).filter(
    (related): related is Post =>
      typeof related === 'object' &&
      related.id !== post.id &&
      related.editorialAreas.includes('communication'),
  )
  const relatedResult = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { id: { not_equals: post.id } },
        { editorialAreas: { contains: 'communication' } },
        { format: { equals: post.format } },
      ],
    },
    sort: '-publishedAt',
    limit: 6,
    depth: 1,
    draft: false,
    overrideAccess: false,
  })
  const relatedIds = new Set(manuallyRelated.map((related) => related.id))
  const related = [
    ...manuallyRelated,
    ...relatedResult.docs.filter((item) => !relatedIds.has(item.id)),
  ].slice(0, 3)

  const cover = isMedia(post.cover) ? post.cover : null
  const coverCredits = [cover?.caption, cover?.credit, cover?.source].filter(Boolean).join(' · ')
  const author = post.author && typeof post.author === 'object' ? post.author.name : null
  const sourceUrl = safeExternalUrl(post.sourceUrl)
  const embedUrl = videoEmbedUrl(post.videoUrl)
  const videoUrl = safeExternalUrl(post.videoUrl)
  const directVideo = videoUrl && /\.(mp4|webm|ogg)(?:$|\?)/i.test(videoUrl)

  return (
    <div className="page">
      <div className="container">
        <article className={styles.article}>
          <Link className={styles.backLink} href="/comunicacao">
            <Icon name="arrowLeft" /> Comunicação da paróquia
          </Link>
          <header className={styles.articleHeader}>
            <span className="eyebrow">
              {post.category ? postCategoryLabels[post.category] : postFormatLabels[post.format]}
            </span>
            <h1>{post.title}</h1>
            <p className={styles.lead}>{post.summary}</p>
            <div className={styles.meta}>
              <span>{postFormatLabels[post.format]}</span>
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatParishDate(post.publishedAt)}</time>
              )}
              {author && <span>Por {author}</span>}
            </div>
          </header>

          {cover && (
            <figure className={styles.cover}>
              <MediaImage
                image={cover}
                alt={cover.alt || post.title}
                sizes="(max-width: 900px) 100vw, 850px"
              />
              {coverCredits && <figcaption>{coverCredits}</figcaption>}
            </figure>
          )}

          <RichText content={post.body} className={styles.body} />

          {post.gallery && post.gallery.length > 0 && (
            <section aria-labelledby="gallery-title">
              <h2 id="gallery-title">Galeria de fotos</h2>
              <div className={styles.gallery}>
                {post.gallery.map((item) => {
                  if (!isMedia(item.image)) return null
                  const image = item.image
                  return (
                    <figure key={item.id || image.id}>
                      <MediaImage
                        image={image}
                        alt={image.alt || item.caption || post.title}
                        sizes="(max-width: 700px) 100vw, 420px"
                      />
                      {(item.caption || image.credit) && (
                        <figcaption>
                          {[item.caption, image.credit].filter(Boolean).join(' · ')}
                        </figcaption>
                      )}
                    </figure>
                  )
                })}
              </div>
            </section>
          )}

          {post.format === 'video' && videoUrl && (
            <section aria-label="Vídeo da publicação">
              {embedUrl ? (
                <iframe
                  className={styles.video}
                  src={embedUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : directVideo ? (
                <video className={styles.video} controls preload="metadata" src={videoUrl}>
                  Seu navegador não reproduz este vídeo.
                </video>
              ) : (
                <p>
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    Assistir ao vídeo na fonte externa <Icon name="external" />
                  </a>
                </p>
              )}
            </section>
          )}

          {(post.sourceName || sourceUrl) && (
            <p className={styles.source}>
              Fonte:{' '}
              {sourceUrl ? (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  {post.sourceName || 'Publicação original'} <Icon name="external" />
                </a>
              ) : (
                post.sourceName
              )}
            </p>
          )}
        </article>

        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title">Leia também</h2>
            <div className={styles.grid}>
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
