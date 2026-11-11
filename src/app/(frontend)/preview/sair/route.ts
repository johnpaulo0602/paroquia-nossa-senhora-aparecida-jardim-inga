import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Leaves draft mode and returns to the published version of the page. */
export async function GET(request: Request): Promise<Response> {
  const requested = new URL(request.url).searchParams.get('path') || '/'
  const path = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/'

  ;(await draftMode()).disable()
  redirect(path)
}
