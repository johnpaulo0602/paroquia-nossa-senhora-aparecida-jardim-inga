import config from '@payload-config'
import { getPayload } from 'payload'

export const getCMS = async () => getPayload({ config: await config })

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
