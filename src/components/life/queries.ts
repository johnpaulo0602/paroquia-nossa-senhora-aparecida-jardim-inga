import { cache } from 'react'

import { getCMS } from '@/lib/payload'

const publicRead = {
  overrideAccess: false,
  draft: false,
  depth: 2,
} as const

export const getSacramentGuide = cache(async (slug: string) => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'sacrament-guides',
    ...publicRead,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  return docs[0] ?? null
})

export const getActivePastorals = cache(async () => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'pastorals',
    ...publicRead,
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
  })

  return docs
})

export const getPastoralBySlug = cache(async (slug: string) => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'pastorals',
    ...publicRead,
    where: {
      and: [{ slug: { equals: slug } }, { active: { equals: true } }],
    },
    limit: 1,
  })

  return docs[0] ?? null
})

export const getReflections = cache(async (area: 'pastorum' | 'spirituality') => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'posts',
    ...publicRead,
    where: { editorialAreas: { contains: area } },
    sort: '-publishedAt',
    limit: 12,
  })

  return docs
})

export const getReflectionBySlug = cache(async (slug: string) => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'posts',
    ...publicRead,
    where: {
      and: [
        { slug: { equals: slug } },
        {
          or: [
            { editorialAreas: { contains: 'spirituality' } },
            { editorialAreas: { contains: 'pastorum' } },
          ],
        },
      ],
    },
    limit: 1,
  })

  return docs[0] ?? null
})

export const getClergy = cache(async () => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'people',
    ...publicRead,
    where: {
      and: [{ roleType: { equals: 'clergy' } }, { current: { equals: true } }],
    },
    sort: 'order',
    limit: 20,
  })

  return docs
})

/** Names for the "which church?" list of the sacrament request form. */
export const getActiveCommunities = cache(async () => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'communities',
    ...publicRead,
    depth: 0,
    where: { active: { equals: true } },
    sort: 'order',
    limit: 50,
  })

  return docs.map(({ id, name }) => ({ id, name }))
})

export const getLifeSiteSettings = cache(async () => {
  const payload = await getCMS()
  return payload.findGlobal({ slug: 'site-settings', ...publicRead })
})
