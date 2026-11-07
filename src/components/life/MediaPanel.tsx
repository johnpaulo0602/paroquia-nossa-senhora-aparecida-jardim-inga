import type { Media } from '@/payload-types'
import { MediaImage } from '@/components/site/MediaImage'

type MediaPanelProps = {
  image?: number | Media | null
  alt: string
  className?: string
  sizes?: string
}

export function MediaPanel({ image, alt, className, sizes }: MediaPanelProps) {
  if (!image || typeof image === 'number') {
    return (
      <div className={className} aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <path d="M29 8h6v17h17v6H35v25h-6V31H12v-6h17z" fill="currentColor" />
        </svg>
      </div>
    )
  }

  return <MediaImage image={image} alt={alt} className={className} sizes={sizes} />
}
