import { notFound } from 'next/navigation'

/**
 * Unknown URLs would otherwise fall through to Next's default (English, unstyled) 404.
 * Routing them here renders `(frontend)/not-found.tsx` inside the site layout.
 */
export default function CatchAllNotFound() {
  notFound()
}
