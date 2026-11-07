import { notFound } from 'next/navigation'

import { eventLocation } from '@/components/events/content'
import { generateEventICS } from '@/lib/calendar'
import { getCMS } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const safeFilename = (value: string, id: number) => {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${normalized || `evento-${id}`}.ics`
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: false,
    overrideAccess: false,
  })
  const event = result.docs[0]
  if (!event) notFound()

  const ics = generateEventICS({
    id: event.id,
    slug: event.slug,
    title: event.title || 'Evento paroquial',
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: eventLocation(event),
    description: event.summary || '',
    url: `${new URL(request.url).origin}/eventos/${encodeURIComponent(event.slug)}`,
  })

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeFilename(event.slug, event.id)}"`,
      'Cache-Control': 'no-store',
    },
  })
}
