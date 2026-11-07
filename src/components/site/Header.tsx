'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { Navigation, SiteSetting } from '@/payload-types'

import { Brand } from './Brand'
import { Icon } from './Icon'
import { SmartLink } from './SmartLink'
import styles from './Header.module.css'

type HeaderProps = {
  navigation: Navigation | null
  settings: SiteSetting | null
}

const fallbackGroups: NonNullable<Navigation['headerGroups']> = [
  {
    label: 'A paróquia',
    links: [
      { label: 'Nossa história', url: '/paroquia' },
      { label: 'Nossa padroeira', url: '/padroeira' },
      { label: 'Estrutura da paróquia', url: '/equipe' },
      { label: 'Comunidades', url: '/comunidades' },
      { label: 'Secretaria paroquial', url: '/secretaria' },
    ],
  },
  { label: 'Comunicação', links: [{ label: 'Comunicação', url: '/comunicacao' }] },
  { label: 'Agenda', links: [{ label: 'Agenda', url: '/agenda' }] },
  {
    label: 'Sacramentos',
    links: [
      { label: 'Batismo', url: '/vida/batismo' },
      { label: 'Matrimônio', url: '/vida/matrimonio' },
      { label: 'Catequese e crisma', url: '/vida/catequese' },
      { label: 'Todos os sacramentos', url: '/vida' },
    ],
  },
  {
    label: 'Vida cristã',
    links: [
      { label: 'Catequese e crisma', url: '/vida/catequese' },
      { label: 'Pastorais e movimentos', url: '/vida/pastorais' },
      { label: 'In Cordibus Pastorum', url: '/vida/in-cordibus-pastorum' },
      { label: 'Espiritualidade', url: '/vida/espiritualidade' },
      { label: 'Mural do dízimo', url: '/vida/mural-do-dizimo' },
    ],
  },
  { label: 'Contato', links: [{ label: 'Contato', url: '/contato' }] },
]

export function Header({ navigation, settings }: HeaderProps) {
  const [openMenuPathname, setOpenMenuPathname] = useState<string | null>(null)
  const pathname = usePathname()
  const menuOpen = openMenuPathname === pathname
  const setMenuOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    const nextOpen = typeof open === 'function' ? open(menuOpen) : open
    setOpenMenuPathname(nextOpen ? pathname : null)
  }
  const groups = navigation?.headerGroups?.length ? navigation.headerGroups : fallbackGroups
  const cta = navigation?.headerCta?.url
    ? navigation.headerCta
    : { label: 'Quero doar', url: '/contribuir' }

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenuPathname(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <div className={styles.utility}>
        <div className="container">
          <span>Jardim Ingá · {settings?.diocese || 'Diocese de Luziânia'}</span>
          <nav aria-label="Links rápidos">
            <SmartLink href="/projetos">Projetos e parcerias</SmartLink>
            <SmartLink href="/horarios">Horários de missa</SmartLink>
            <SmartLink href="/secretaria">Secretaria paroquial</SmartLink>
            {settings?.instagramUrl && (
              <SmartLink external href={settings.instagramUrl}>
                Instagram <span aria-hidden="true">↗</span>
              </SmartLink>
            )}
          </nav>
        </div>
      </div>
      <header className={styles.header}>
        <div className={`container ${styles.masthead}`}>
          <Brand settings={settings} />
          <button
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? 'Fechar' : 'Menu'}
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
          <nav
            aria-label="Navegação principal"
            className={`${styles.navigation} ${menuOpen ? styles.open : ''}`}
            id="main-navigation"
          >
            {groups.map((group) => {
              const links = group.links?.filter((link) => link.label && link.url) || []
              if (!links.length) return null

              if (links.length === 1 && links[0].label === group.label) {
                const link = links[0]
                return (
                  <SmartLink
                    className={styles.navLink}
                    external={link.external}
                    href={link.url}
                    key={group.id || group.label}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </SmartLink>
                )
              }

              return (
                <details className={styles.group} key={group.id || group.label}>
                  <summary>{group.label}</summary>
                  <div className={styles.dropdown}>
                    {links.map((link) => (
                      <SmartLink
                        external={link.external}
                        href={link.url}
                        key={link.id || `${link.label}-${link.url}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </SmartLink>
                    ))}
                  </div>
                </details>
              )
            })}
            {cta.url && (
              <SmartLink
                className={styles.donate}
                href={cta.url}
                onClick={() => setMenuOpen(false)}
              >
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
