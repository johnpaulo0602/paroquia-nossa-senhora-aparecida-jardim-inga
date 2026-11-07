import type { Media, Post } from '@/payload-types'

export const postFormatLabels: Record<Post['format'], string> = {
  news: 'Notícia',
  article: 'Artigo',
  photos: 'Fotos',
  video: 'Vídeo',
}

export const postCategoryLabels: Record<NonNullable<Post['category']>, string> = {
  general: 'Vida paroquial',
  'church-brazil': 'Igreja no Brasil',
  'pope-vatican': 'Papa e Vaticano',
  'communities-pastorals': 'Comunidades e pastorais',
  'community-memory': 'Memória da comunidade',
}

export const isMedia = (value: Post['cover']): value is Media =>
  Boolean(value && typeof value === 'object')

export const safeExternalUrl = (value: string | null | undefined) => {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export const videoEmbedUrl = (value: string | null | undefined) => {
  const safeUrl = safeExternalUrl(value)
  if (!safeUrl) return null

  const url = new URL(safeUrl)
  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = url.searchParams.get('v') || (url.pathname.startsWith('/shorts/') ? url.pathname.split('/')[2] : '')
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  }

  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
  }

  return null
}
