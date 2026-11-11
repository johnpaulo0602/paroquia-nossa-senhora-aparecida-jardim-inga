'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

import type { SiteSetting } from '@/payload-types'

import { Brand } from './Brand'
import { Icon } from './Icon'
import { headerCta as cta, headerGroups as groups, type NavLink } from './navigation'
import { SmartLink } from './SmartLink'
import styles from './Header.module.css'

type HeaderProps = {
  settings: SiteSetting | null
}



const isInternal = (link: NavLink) => !link.external && link.url?.startsWith('/')

/** Exact match marks the current page; prefix match marks the section the page belongs to. */
const matchesPath = (link: NavLink, pathname: string, exact = false) => {
  if (!isInternal(link) || !link.url) return false
  if (link.url === pathname) return true
  return !exact && link.url !== '/' && pathname.startsWith(`${link.url}/`)
}

/**
 * State is stored together with the pathname it was opened on, so any route change
 * closes menus without a setState-in-effect.
 */
type OpenState = { id: string | null; drawer: boolean; pathname: string }

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname()
  const [state, setState] = useState<OpenState>({ id: null, drawer: false, pathname })
  const current = state.pathname === pathname ? state : { id: null, drawer: false, pathname }
  const openId = current.id
  const drawerOpen = current.drawer

  const navRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})


  // The most specific matching URL decides the active section, so a hub link like
  // "/vida" does not also light up its group on every "/vida/*" page.
  const activeUrl = groups
    .flatMap((group) => group.links ?? [])
    .filter((link) => matchesPath(link, pathname))
    .reduce<string | null>(
      (best, link) => (!best || (link.url?.length ?? 0) > best.length ? link.url! : best),
      null,
    )

  const setOpenId = (id: string | null) =>
    setState((prev) => ({
      id,
      drawer: prev.pathname === pathname ? prev.drawer : false,
      pathname,
    }))
  const setDrawer = (drawer: boolean) => setState({ id: null, drawer, pathname })
  const closeAll = () => setState({ id: null, drawer: false, pathname })

  // Close on outside click and Escape while anything is open.
  useEffect(() => {
    if (!openId && !drawerOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setState((prev) => ({ ...prev, id: null }))
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (openId) triggerRefs.current[openId]?.focus()
      setState((prev) => ({ ...prev, id: null, drawer: false }))
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId, drawerOpen])

  // Lock page scroll behind the mobile menu sheet (the CSS applies it at 1280px and below).
  useEffect(() => {
    document.documentElement.classList.toggle('nav-locked', drawerOpen)
    return () => document.documentElement.classList.remove('nav-locked')
  }, [drawerOpen])

  const focusItem = (panel: HTMLElement | null, index: number) => {
    const items = Array.from(panel?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
    if (!items.length) return
    items[(index + items.length) % items.length].focus()
  }

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key !== 'ArrowDown') return
    event.preventDefault()
    setOpenId(id)
    const panelId = event.currentTarget.getAttribute('aria-controls')
    requestAnimationFrame(() => focusItem(panelId ? document.getElementById(panelId) : null, 0))
  }

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = Array.from(event.currentTarget.querySelectorAll('a'))
    const index = items.indexOf(document.activeElement as HTMLAnchorElement)
    focusItem(event.currentTarget, index + (event.key === 'ArrowDown' ? 1 : -1))
  }

  return (
    <>
      <div className={styles.utility}>
        <div className="container">
          <span>Jardim Ingá · {settings?.diocese || 'Diocese de Luziânia'}</span>
          <nav aria-label="Links rápidos">
            {settings?.phone && (
              <SmartLink href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
                <Icon name="phone" /> {settings.phone}
              </SmartLink>
            )}
            <SmartLink href="/secretaria">Secretaria paroquial</SmartLink>
            {settings?.instagramUrl && (
              <SmartLink icon external href={settings.instagramUrl}>
                Instagram
              </SmartLink>
            )}
          </nav>
        </div>
      </div>
      <header className={styles.header}>
        <div className={`container ${styles.masthead}`}>
          <Brand compact settings={settings} />
          <button
            aria-controls="main-navigation"
            aria-expanded={drawerOpen}
            className={styles.menuToggle}
            onClick={() => setDrawer(!drawerOpen)}
            type="button"
          >
            {drawerOpen ? 'Fechar' : 'Menu'}
            <Icon name={drawerOpen ? 'close' : 'menu'} />
          </button>
          <nav
            aria-label="Navegação principal"
            className={`${styles.navigation} ${drawerOpen ? styles.open : ''}`}
            id="main-navigation"
            ref={navRef}
          >
            {groups.map((group, groupIndex) => {
              const links = group.links?.filter((link) => link.label && link.url) || []
              if (!links.length) return null

              const id = `grupo-${groupIndex}`
              const sectionActive = !!activeUrl && links.some((link) => link.url === activeUrl)

              // A group with a single destination is a plain link, never a one-item dropdown.
              if (links.length === 1) {
                const link = links[0]
                return (
                  <SmartLink
                    aria-current={matchesPath(link, pathname, true) ? 'page' : undefined}
                    className={`${styles.navLink} ${sectionActive ? styles.active : ''}`}
                    external={link.external}
                    href={link.url}
                    key={id}
                    onClick={closeAll}
                  >
                    {group.label || link.label}
                  </SmartLink>
                )
              }

              const open = openId === id
              const panelId = `menu-${id}`

              return (
                <div
                  className={`${styles.group} ${open ? styles.groupOpen : ''}`}
                  key={id}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setState((prev) => (prev.id === id ? { ...prev, id: null } : prev))
                    }
                  }}
                >
                  <button
                    aria-controls={panelId}
                    aria-expanded={open}
                    className={`${styles.groupTrigger} ${sectionActive ? styles.active : ''}`}
                    onClick={() => setOpenId(open ? null : id)}
                    onKeyDown={(event) => onTriggerKeyDown(event, id)}
                    ref={(node) => {
                      triggerRefs.current[id] = node
                    }}
                    type="button"
                  >
                    {group.label}
                    <Icon className={styles.chevron} name="chevronDown" />
                  </button>
                  <div
                    className={styles.dropdown}
                    hidden={!open}
                    id={panelId}
                    onKeyDown={onPanelKeyDown}
                  >
                    {links.map((link) => (
                      <SmartLink
                        aria-current={matchesPath(link, pathname, true) ? 'page' : undefined}
                        external={link.external}
                        href={link.url}
                        key={`${link.label}-${link.url}`}
                        onClick={closeAll}
                      >
                        {link.label}
                      </SmartLink>
                    ))}
                  </div>
                </div>
              )
            })}
            {cta.url && (
              <SmartLink className={styles.donate} href={cta.url} onClick={closeAll}>
                {cta.label || 'Quero doar'}
                <Icon name="heart" />
              </SmartLink>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
