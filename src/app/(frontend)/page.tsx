import type { Highlight } from '@/payload-types'
import { HomeSections } from '@/components/home/HomeSections'
import type { HeroSlide } from '@/components/home/HeroCarousel'
import { activeDuring, getCMS } from '@/lib/payload'

function highlightDestination(highlight: Highlight) {
  if (highlight.destinationType === 'post' && highlight.post) {
    if (typeof highlight.post !== 'number') {
      return { href: `/comunicacao/${highlight.post.slug}`, external: false }
    }
  }

  if (highlight.destinationType === 'event' && highlight.event) {
    if (typeof highlight.event !== 'number') {
      return { href: `/eventos/${highlight.event.slug}`, external: false }
    }
  }

  if (highlight.destinationType === 'internal' && highlight.internalPath?.startsWith('/')) {
    return { href: highlight.internalPath, external: false }
  }

  if (highlight.destinationType === 'external' && highlight.externalUrl) {
    return { href: highlight.externalUrl, external: true }
  }

  return { href: '/comunicacao', external: false }
}

function toSlide(highlight: Highlight): HeroSlide {
  const post = highlight.post && typeof highlight.post !== 'number' ? highlight.post : null
  const event = highlight.event && typeof highlight.event !== 'number' ? highlight.event : null

  return {
    id: highlight.id,
    title: highlight.title || post?.title || event?.title || 'Nossa Senhora Aparecida',
    eyebrow: highlight.eyebrow || 'Paróquia · Jardim Ingá',
    summary:
      highlight.summary ||
      post?.summary ||
      event?.summary ||
      'Acompanhe as informações e os encontros da nossa comunidade.',
    image: highlight.image || post?.cover || event?.cover,
    ctaLabel: highlight.ctaLabel || 'Saiba mais',
    ...highlightDestination(highlight),
  }
}

export default async function Home() {
  const payload = await getCMS()
  const now = new Date()
  const nowISO = now.toISOString()

  const [home, highlights, posts, events, communities, projects, sponsors] = await Promise.all([
    payload.findGlobal({
      slug: 'home-page',
      depth: 2,
      draft: false,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'highlights',
      depth: 2,
      draft: false,
      limit: 6,
      overrideAccess: false,
      sort: 'order',
      where: {
        and: [{ placement: { contains: 'home' } }, activeDuring(now)],
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 2,
      draft: false,
      limit: 6,
      overrideAccess: false,
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'events',
      depth: 2,
      draft: false,
      limit: 3,
      overrideAccess: false,
      sort: 'startsAt',
      where: {
        and: [{ startsAt: { greater_than_equal: nowISO } }, { archived: { not_equals: true } }],
      },
    }),
    payload.find({
      collection: 'communities',
      depth: 2,
      draft: false,
      limit: 12,
      overrideAccess: false,
      sort: 'order',
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: 'projects',
      depth: 2,
      draft: false,
      limit: 3,
      overrideAccess: false,
      sort: 'order',
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: 'sponsors',
      depth: 2,
      draft: false,
      limit: 20,
      overrideAccess: false,
      sort: 'order',
      where: {
        and: [{ approved: { equals: true } }, activeDuring(now)],
      },
    }),
  ])

  const slides: HeroSlide[] = highlights.docs.length
    ? highlights.docs.map(toSlide)
    : [
        {
          id: 'welcome',
          title: 'Nossa Senhora Aparecida',
          eyebrow: 'Paróquia · Jardim Ingá',
          summary:
            'Este espaço reunirá os destaques da nossa comunidade. Enquanto isso, conheça a paróquia e participe da nossa caminhada.',
          ctaLabel: 'Conheça a paróquia',
          href: '/paroquia',
        },
      ]

  return (
    <HomeSections
      communities={communities.docs}
      events={events.docs}
      home={home}
      liturgyUrl={null}
      posts={posts.docs}
      projects={projects.docs}
      slides={slides}
      sponsors={sponsors.docs}
    />
  )
}
