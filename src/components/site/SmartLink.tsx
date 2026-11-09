import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import { Icon } from './Icon'

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode
  external?: boolean | null
  href: string
  /**
   * Appends the right trailing icon: `external-link` when the link opens another site,
   * `arrow-right` otherwise. Use it instead of typing arrows into the label.
   */
  icon?: boolean
}

export function SmartLink({ children, external, href, icon, ...props }: SmartLinkProps) {
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href)
  const opensNewWindow = isExternal && /^https?:/.test(href)
  const content = icon ? (
    <>
      {children} <Icon name={opensNewWindow ? 'external' : 'arrow'} />
    </>
  ) : (
    children
  )

  if (isExternal) {
    return (
      <a
        href={href}
        {...(opensNewWindow ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} {...props}>
      {content}
    </Link>
  )
}
