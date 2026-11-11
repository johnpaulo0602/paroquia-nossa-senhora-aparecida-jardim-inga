'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * Rendered only in draft mode. Inside the panel's preview pane it reloads the page data
 * whenever the document is saved. In a normal tab it shows a bar, so an editor browsing
 * the site knows they are seeing drafts and can go back to the published version.
 */
export function LivePreviewListener() {
  const router = useRouter()
  const pathname = usePathname()
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => '')
  const standalone = useSyncExternalStore(noop, () => window.self === window.top, () => false)

  if (!origin) return null

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />
      {standalone && (
        <p
          role="status"
          style={{
            background: '#102a4c',
            color: '#fff',
            fontSize: '0.875rem',
            margin: 0,
            padding: '0.5rem 1rem',
            textAlign: 'center',
          }}
        >
          Você está vendo a prévia, com rascunhos ainda não publicados.{' '}
          <a
            href={`/preview/sair?path=${encodeURIComponent(pathname)}`}
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            Ver o site como os visitantes
          </a>
        </p>
      )}
    </>
  )
}
