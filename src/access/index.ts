import { APIError } from 'payload'
import type { Access, CollectionBeforeChangeHook, FieldAccess } from 'payload'

import { featureEnabled } from '../lib/features'

type Role = 'admin' | 'editor' | 'contributor' | 'secretary'
type RequestUser = { role?: Role } | null | undefined

const hasRole = (user: RequestUser, roles: Role[]) => Boolean(user?.role && roles.includes(user.role))

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => hasRole(req.user, ['admin'])

export const isAdminOrEditor: Access = ({ req }) => hasRole(req.user, ['admin', 'editor'])

export const canEditContent: Access = ({ req }) =>
  hasRole(req.user, ['admin', 'editor', 'contributor'])

export const canManageService: Access = ({ req }) =>
  hasRole(req.user, ['admin', 'secretary'])

export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, ['admin'])) return true
  if (!req.user) return false

  return { id: { equals: req.user.id } }
}

export const readPublished: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const readPublicContent: Access = ({ req }) => {
  if (req.user) return true

  const published = { _status: { equals: 'published' } }
  if (featureEnabled('SHOW_DEMO_CONTENT') || process.env.NODE_ENV === 'development') {
    return published
  }

  return {
    and: [published, { origin: { not_equals: 'demonstration' } }],
  }
}

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user)

export const enforcePublishPermission: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status === 'published' && req.user && !hasRole(req.user, ['admin', 'editor'])) {
    throw new APIError('Somente editores e administradores podem publicar conteúdo.', 403)
  }

  return data
}

/**
 * `admin.hidden` helper: shows a collection in the panel menu only to the given roles.
 * It only declutters the menu; the access functions above are what protect the data.
 */
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }): boolean =>
    !hasRole(user as RequestUser, roles)

export const contentRoles: Role[] = ['admin', 'editor', 'contributor']
export const serviceRoles: Role[] = ['admin', 'secretary']
