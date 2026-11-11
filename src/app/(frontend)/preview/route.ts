import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCMS } from '@/lib/payload'

/**
 * Entry point of the panel's preview pane. Only a logged-in panel user may turn on draft
 * mode; everyone else is sent to the published page.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const requested = searchParams.get('path') || '/'
  // Same-site paths only, so the route cannot be used as an open redirect.
  const path = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/'

  const payload = await getCMS()
  const { user } = await payload.auth({ headers: request.headers })
  const draft = await draftMode()

  if (user) draft.enable()
  else draft.disable()

  redirect(path)
}
