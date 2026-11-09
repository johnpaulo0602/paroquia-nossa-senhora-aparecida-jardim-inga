import type { Media } from '@/payload-types'
import { Icon, type IconName } from '@/components/site/Icon'
import { MediaImage } from '@/components/site/MediaImage'

type MediaPanelProps = {
  image?: number | Media | null
  alt: string
  className?: string
  sizes?: string
  /** Shown on a soft panel when there is no image. */
  icon?: IconName
}

export function MediaPanel({ image, alt, className, sizes, icon = 'cross' }: MediaPanelProps) {
  if (!image || typeof image === 'number') {
    return (
      <div aria-hidden="true" className={className} data-media-empty="">
        <Icon name={icon} />
      </div>
    )
  }

  return <MediaImage image={image} alt={alt} className={className} sizes={sizes} />
}
