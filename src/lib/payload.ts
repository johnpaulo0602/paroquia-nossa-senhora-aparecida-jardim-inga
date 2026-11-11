import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

const publishedOnly = async () => getPayload({ config: await config })

/** True inside the panel's preview pane: `/preview` enables draft mode for logged-in users. */
export async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (scripts, tests) there is no draft mode.
    return false
  }
}

type ReadMethod = 'find' | 'findByID' | 'findGlobal'
const readMethods: ReadMethod[] = ['find', 'findByID', 'findGlobal']

/**
 * CMS client for the public site. Pages always ask for published content under the public
 * access rules (`draft: false, overrideAccess: false`). In the preview pane the same calls
 * return the latest draft instead, so every page can be previewed without changing it.
 */
export const getCMS = async (): Promise<Payload> => {
  const payload = await publishedOnly()
  if (!(await isPreview())) return payload

  return new Proxy(payload, {
    get(target, property, receiver) {
      if (readMethods.includes(property as ReadMethod)) {
        const read = target[property as ReadMethod] as (args: object) => unknown
        return (args: object) => read.call(target, { ...args, draft: true, overrideAccess: true })
      }

      const value = Reflect.get(target, property, receiver)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
}

export const activeDuring = (now = new Date()) => ({
  and: [
    {
      or: [{ startsAt: { less_than_equal: now.toISOString() } }, { startsAt: { exists: false } }],
    },
    {
      or: [{ endsAt: { greater_than_equal: now.toISOString() } }, { endsAt: { exists: false } }],
    },
  ],
})
