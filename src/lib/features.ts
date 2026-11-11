/**
 * Feature switches. While the site is a prototype under review, every feature is on
 * unless its variable is explicitly set to "false". Before the official launch, set the
 * variables the parish has not approved yet to "false" in the hosting environment.
 */
type Feature =
  | 'CONTACT_FORM_ENABLED'
  | 'SACRAMENT_FORM_ENABLED'
  | 'TITHE_FORM_ENABLED'
  | 'NEWSLETTER_ENABLED'
  | 'SHOW_DEMO_CONTENT'

export const featureEnabled = (name: Feature): boolean =>
  process.env[name]?.trim().toLowerCase() !== 'false'
