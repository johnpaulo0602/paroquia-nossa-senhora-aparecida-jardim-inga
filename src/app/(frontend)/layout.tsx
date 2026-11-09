import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { getCMS } from '@/lib/payload'
import type { Navigation, SiteSetting } from '@/payload-types'

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
  let navigation: Navigation | null = null

  if (process.env.DATABASE_URL) {
    try {
      const payload = await getCMS()
      ;[settings, navigation] = await Promise.all([
        payload.findGlobal({
          slug: 'site-settings',
          depth: 2,
          draft: false,
          overrideAccess: false,
        }),
        payload.findGlobal({
          slug: 'navigation',
          depth: 2,
          draft: false,
          overrideAccess: false,
        }),
      ])
    } catch {
      // Fallback to default layout navigation/settings when DB is unavailable during image build
    }
  }

  return (
    <html className={poppins.variable} lang="pt-BR">
      <body>
        <a className="skip-link" href="#main-content">
          Ir para o conteúdo
        </a>
        <Header navigation={navigation} settings={settings} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer navigation={navigation} settings={settings} />
      </body>
    </html>
  )
}
