import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { LivePreviewListener } from '@/components/site/LivePreviewListener'
import { getCMS, isPreview } from '@/lib/payload'
import type { SiteSetting } from '@/payload-types'

import { poppins } from './fonts'
import './tokens.css'
import './styles.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description:
    'Site da Paróquia Nossa Senhora Aparecida, no Jardim Ingá, em Luziânia: celebrações, comunicação, agenda e vida comunitária.',
  title: {
    default: 'Paróquia Nossa Senhora Aparecida | Jardim Ingá',
    template: '%s | Paróquia Nossa Senhora Aparecida',
  },
}

export const viewport: Viewport = {
  themeColor: '#102a4c',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let settings: SiteSetting | null = null

  if (process.env.DATABASE_URL) {
    try {
      const payload = await getCMS()
      settings = await payload.findGlobal({
        slug: 'site-settings',
        depth: 2,
        draft: false,
        overrideAccess: false,
      })
    } catch {
      // Fallback to default settings when the DB is unavailable during the image build
    }
  }

  const preview = await isPreview()

  return (
    <html className={poppins.variable} data-scroll-behavior="smooth" lang="pt-BR">
      <body>
        {preview && <LivePreviewListener />}
        <a className="skip-link" href="#main-content">
          Ir para o conteúdo
        </a>
        <Header settings={settings} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
