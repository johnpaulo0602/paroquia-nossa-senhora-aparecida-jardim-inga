'use client'

import { useCallback, useRef, useState } from 'react'

import type { Post } from '@/payload-types'

import { PostCard } from './PostCard'
import styles from './communication.module.css'

type Format = 'all' | Post['format']

type PostsResponse = {
  docs: Post[]
  totalDocs: number
  hasNextPage: boolean
}

const filters: { value: Format; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'news', label: 'Notícias' },
  { value: 'article', label: 'Artigos' },
  { value: 'photos', label: 'Fotos' },
  { value: 'video', label: 'Vídeos' },
]

export function CommunicationFeed({
  initialPosts,
  initialTotal,
  initialHasNextPage,
}: {
  initialPosts: Post[]
  initialTotal: number
  initialHasNextPage: boolean
}) {
  const [format, setFormat] = useState<Format>('all')
  const [posts, setPosts] = useState(initialPosts)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const request = useRef<AbortController | null>(null)

  const load = useCallback(
    async (nextFormat: Format, nextPage: number, append: boolean) => {
      request.current?.abort()
      const controller = new AbortController()
      request.current = controller
      setLoading(true)
      setError(false)
      if (!append) setFormat(nextFormat)

      const params = new URLSearchParams({
        depth: '1',
        draft: 'false',
        limit: '6',
        page: String(nextPage),
        sort: '-publishedAt',
        'where[and][0][editorialAreas][contains]': 'communication',
      })
      if (nextFormat !== 'all') {
        params.set('where[and][1][format][equals]', nextFormat)
      }

      try {
        const response = await fetch(`/api/posts?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Falha ao carregar publicações')
        const data = (await response.json()) as PostsResponse

        setPosts((current) => {
          if (!append) return data.docs
          const ids = new Set(current.map((post) => post.id))
          return [...current, ...data.docs.filter((post) => !ids.has(post.id))]
        })
        setTotal(data.totalDocs)
        setPage(nextPage)
        setHasNextPage(data.hasNextPage)
        setFormat(nextFormat)
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setError(true)
        if (!append) {
          setPosts([])
          setTotal(0)
          setHasNextPage(false)
        }
      } finally {
        if (request.current === controller) setLoading(false)
      }
    },
    [],
  )

  const changeFormat = (nextFormat: Format) => {
    if (nextFormat === format && !error) return
    void load(nextFormat, 1, false)
  }

  return (
    <section className={styles.feed} aria-labelledby="communication-feed-title">
      <div className={styles.feedHeading}>
        <h2 id="communication-feed-title">Acompanhe as novidades</h2>
        <p role="status">
          {loading && !posts.length ? 'Carregando conteúdos…' : `${posts.length} de ${total} conteúdos`}
        </p>
      </div>
      <div className={styles.filters} aria-label="Filtrar publicações por formato">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={format === filter.value}
            disabled={loading && format !== filter.value}
            onClick={() => changeFormat(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.grid} aria-busy={loading}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {!loading && !error && !posts.length && (
        <div className={styles.empty}>
          <h3>Nenhuma publicação neste formato</h3>
          <p>Selecione outro formato para continuar navegando.</p>
        </div>
      )}

      {error && (
        <div className={styles.error} role="alert">
          <p>Não foi possível carregar as publicações. Verifique sua conexão e tente novamente.</p>
          <button className="button button-secondary" type="button" onClick={() => load(format, page, posts.length > 0)}>
            Tentar novamente
          </button>
        </div>
      )}

      {loading && posts.length > 0 && <p role="status">Carregando mais conteúdos…</p>}
      {hasNextPage && !error && (
        <div className={styles.more}>
          <button
            className="button button-secondary"
            type="button"
            disabled={loading}
            onClick={() => load(format, page + 1, true)}
          >
            {loading ? 'Carregando…' : 'Carregar mais'}
          </button>
        </div>
      )}
    </section>
  )
}
