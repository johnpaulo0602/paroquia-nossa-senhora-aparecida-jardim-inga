import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaImageProps = {
  image: number | Media | null | undefined
  alt?: string
  className?: string
  sizes?: string
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

export function MediaImage({ image, alt, className, sizes = '100vw' }: MediaImageProps) {
  if (!image || typeof image === 'number' || !image.url) return null

  return (
    <Image
      alt={alt ?? image.alt}
      className={className}
      height={image.height || 900}
      sizes={sizes}
      src={normalizeMediaSrc(image.url)}
      width={image.width || 1200}
    />
  )
}
