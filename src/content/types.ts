/**
 * Fixed content: pages that are written once and rarely change live in `src/content`
 * instead of the CMS. To change them, edit the file and deploy.
 */
export type StaticImage = {
  /** Path under `public/`. */
  src: string
  width: number
  height: number
  alt: string
  caption?: string
  credit?: string
}

export type TimelineEntry = {
  id: string
  /** Date as shown to visitors, e.g. "1997", "Séculos XVIII e XIX", "Hoje". */
  label: string
  title: string
  paragraphs: string[]
  image?: StaticImage
  sourceName?: string
  sourceUrl?: string
}
