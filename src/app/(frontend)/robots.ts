import type { MetadataRoute } from 'next'

import { getSiteURL } from '@/lib/deploy-env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteURL()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
