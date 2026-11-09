import Link from 'next/link'

import type { Post } from '@/payload-types'
import { RichText } from '@/components/site/RichText'

import styles from './life.module.css'
import { MediaPanel } from './MediaPanel'
import { Icon } from '@/components/site/Icon'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

export function ReflectionArticle({ post }: { post: Post }) {
  const inPastorum = post.editorialAreas.includes('pastorum')
  const backHref = inPastorum ? '/vida/in-cordibus-pastorum' : '/vida/espiritualidade'
  const author = typeof post.author === 'object' ? post.author : null

  return (
    <>
      <Link className={styles.backLink} href={backHref}>
        <Icon name="arrowLeft" /> Voltar às reflexões
      </Link>
      <article className={styles.reading}>
        <header>
          <span className="eyebrow">Reflexão · Vida cristã</span>
          <h1>{post.title}</h1>
          <p className={styles.lead}>{post.summary}</p>
          <div className={styles.articleMeta}>
            {author ? <span>Por {author.name}</span> : null}
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {dateFormatter.format(new Date(post.publishedAt))}
              </time>
            ) : null}
          </div>
        </header>

        {post.cover ? (
          <MediaPanel
            image={post.cover}
            alt=""
            className={styles.readingImage}
            sizes="(max-width: 850px) 100vw, 800px"
          />
        ) : null}

        <RichText content={post.body} className={styles.readingBody} />

        {post.format === 'photos' && post.gallery?.length ? (
          <section className={styles.gallery} aria-labelledby="reflection-gallery-title">
            <h2 id="reflection-gallery-title">Galeria</h2>
            <div>
              {post.gallery.map((item, index) => (
                <figure key={item.id ?? index}>
                  <MediaPanel image={item.image} alt={item.caption ?? ''} />
                  {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {post.format === 'video' && post.videoUrl ? (
          <p>
            <a
              className="button button-secondary"
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Assistir ao vídeo <Icon name="external" />
            </a>
          </p>
        ) : null}

        {post.sourceName && post.sourceUrl ? (
          <p className={styles.sourceLink}>
            Fonte:{' '}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
              {post.sourceName} <Icon name="external" />
            </a>
          </p>
        ) : null}

        <nav className={styles.reflectionNav} aria-label="Continuar em vida cristã">
          <Link href="/vida/espiritualidade">Espiritualidade</Link>
          <Link href="/vida/in-cordibus-pastorum">In Cordibus Pastorum</Link>
        </nav>
      </article>
    </>
  )
}
