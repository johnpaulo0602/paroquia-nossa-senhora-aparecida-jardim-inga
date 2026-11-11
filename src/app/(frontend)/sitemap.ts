import type { MetadataRoute } from 'next'

import { getCMS } from '@/lib/payload'
import { getSiteURL } from '@/lib/deploy-env'

export const dynamic = 'force-dynamic'

const staticRoutes = [
  '',
  '/comunicacao',
  '/agenda',
  '/horarios',
  '/secretaria',
  '/contato',
  '/paroquia',
  '/padroeira',
  '/equipe',
  '/comunidades',
  '/vida',
  '/vida/catequese',
  '/vida/batismo',
  '/vida/matrimonio',
  '/vida/pastorais',
  '/vida/in-cordibus-pastorum',
  '/vida/espiritualidade',
  '/vida/mural-do-dizimo',
  '/projetos',
  '/contribuir',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteURL()
  const payload = await getCMS()
  const [posts, events, communities, pastorals] = await Promise.all([
    payload.find({ collection: 'posts', limit: 1000, overrideAccess: false, draft: false }),
    payload.find({ collection: 'events', limit: 1000, overrideAccess: false, draft: false }),
    payload.find({ collection: 'communities', limit: 100, overrideAccess: false, draft: false }),
    payload.find({ collection: 'pastorals', limit: 100, overrideAccess: false, draft: false }),
  ])

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}` })),
    ...posts.docs.map((post) => ({ url: `${baseUrl}/comunicacao/${post.slug}`, lastModified: post.updatedAt })),
    ...events.docs.map((event) => ({ url: `${baseUrl}/eventos/${event.slug}`, lastModified: event.updatedAt })),
    ...communities.docs.map((community) => ({
      url: `${baseUrl}/comunidades/${community.slug}`,
      lastModified: community.updatedAt,
    })),
    ...pastorals.docs.map((pastoral) => ({
      url: `${baseUrl}/pastorais/${pastoral.slug}`,
      lastModified: pastoral.updatedAt,
    })),
  ]
}
