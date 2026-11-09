import type { Navigation, SiteSetting } from '@/payload-types'

import { Brand } from './Brand'
import { Icon } from './Icon'
import { SmartLink } from './SmartLink'
import styles from './Footer.module.css'

type FooterProps = {
  navigation: Navigation | null
  settings: SiteSetting | null
}

const fallbackGroups: NonNullable<Navigation['footerGroups']> = [
  {
    label: 'A paróquia',
    links: [
      { label: 'Nossa história', url: '/paroquia' },
      { label: 'Nossa padroeira', url: '/padroeira' },
      { label: 'Comunidades', url: '/comunidades' },
      { label: 'Secretaria', url: '/secretaria' },
    ],
  },
  {
    label: 'Participe',
    links: [
      { label: 'Missas e confissões', url: '/horarios' },
      { label: 'Agenda paroquial', url: '/agenda' },
      { label: 'Sacramentos', url: '/vida' },
      { label: 'Pastorais e movimentos', url: '/vida/pastorais' },
    ],
  },
  {
    label: 'Comunicação',
    links: [
      { label: 'Notícias e artigos', url: '/comunicacao' },
      { label: 'Projetos e parcerias', url: '/projetos' },
      { label: 'Dízimo e doações', url: '/contribuir' },
      { label: 'Fale conosco', url: '/contato' },
    ],
  },
]

export function Footer({ navigation, settings }: FooterProps) {
  const groups = navigation?.footerGroups?.length ? navigation.footerGroups : fallbackGroups
  const name = settings?.name || 'Paróquia Nossa Senhora Aparecida'

  return (
    <>
      <section className={styles.contactCta} aria-labelledby="footer-contact-title">
        <div className="container">
          <div>
            <span className="eyebrow">Comunicação e acolhimento</span>
            <h2 id="footer-contact-title">Acompanhe a vida da nossa comunidade.</h2>
            <p>Leia os comunicados paroquiais ou fale com a secretaria para receber orientações.</p>
          </div>
          <div className={styles.ctaActions}>
            <SmartLink className="button-secondary" href="/comunicacao">
              Ver comunicação <Icon name="arrow" />
            </SmartLink>
            <SmartLink className="button" href="/contato">
              Entrar em contato <Icon name="arrow" />
            </SmartLink>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.identity}>
            <Brand settings={settings} />
            {settings?.address ? <p>{settings.address}</p> : <p>Jardim Ingá · Luziânia, Goiás</p>}
            <SmartLink href="/secretaria" icon>
              Localização e atendimento
            </SmartLink>
            <div className={styles.contacts}>
              {settings?.phone && (
                <SmartLink href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
                  <Icon name="phone" /> {settings.phone}
                </SmartLink>
              )}
              {settings?.email && (
                <SmartLink href={`mailto:${settings.email}`}>
                  <Icon name="mail" /> {settings.email}
                </SmartLink>
              )}
            </div>
          </div>
          {groups.map((group) => (
            <nav aria-label={group.label} className={styles.navGroup} key={group.id || group.label}>
              <h3>{group.label}</h3>
              {group.links?.map(
                (link) =>
                  link.url && (
                    <SmartLink external={link.external} href={link.url} key={link.id || link.url}>
                      {link.label}
                      {link.external && (
                        <>
                          {' '}
                          <Icon name="external" />
                        </>
                      )}
                    </SmartLink>
                  ),
              )}
            </nav>
          ))}
        </div>
        <div className={`container ${styles.bottom}`}>
          <span>
            © {new Date().getFullYear()} · {name} · Jardim Ingá
          </span>
          <SmartLink href="/contato" icon>
            Fale com a paróquia
          </SmartLink>
        </div>
      </footer>
    </>
  )
}
