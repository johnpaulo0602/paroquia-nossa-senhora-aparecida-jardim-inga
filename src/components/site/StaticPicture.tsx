import Image from 'next/image'

import type { StaticImage } from '@/content/types'

type StaticPictureProps = {
  image: StaticImage
  alt?: string
  className?: string
  sizes?: string
}

/** Image from `public/`, used by the fixed-content pages in `src/content`. */
export function StaticPicture({ image, alt, className, sizes = '100vw' }: StaticPictureProps) {
  return (
    <Image
      alt={alt ?? image.alt}
      className={className}
      height={image.height}
      sizes={sizes}
      src={image.src}
      width={image.width}
    />
  )
}
