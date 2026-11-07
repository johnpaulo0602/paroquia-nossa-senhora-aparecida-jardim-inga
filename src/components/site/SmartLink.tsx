import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode
  external?: boolean | null
  href: string
}

export function SmartLink({ children, external, href, ...props }: SmartLinkProps) {
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href)

  if (isExternal) {
    const opensNewWindow = /^https?:/.test(href)

    return (
      <a
        href={href}
        {...(opensNewWindow ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
