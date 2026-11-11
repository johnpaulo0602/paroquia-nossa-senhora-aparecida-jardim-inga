import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaImageProps = {
  image: number | Media | null | undefined
  alt?: string
  className?: string
  sizes?: string
  /** Above-the-fold image (logo, first hero slide): load eagerly with high priority. */
  eager?: boolean
}

function normalizeMediaSrc(url: string): string {
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/')) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    // Keep original URL if parsing fails
  }
  return url
}

export function MediaImage({ image, alt, className, sizes = '100vw', eager }: MediaImageProps) {
  if (!image || typeof image === 'number' || !image.url) return null

  return (
    <Image
      alt={alt ?? image.alt}
      className={className}
      fetchPriority={eager ? 'high' : undefined}
      height={image.height || 900}
      loading={eager ? 'eager' : undefined}
      placeholder={image.blurData ? 'blur' : 'empty'}
      blurDataURL={image.blurData || undefined}
      sizes={sizes}
      src={normalizeMediaSrc(image.url)}
      width={image.width || 1200}
    />
  )
}
