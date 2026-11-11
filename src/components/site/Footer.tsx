import type { SiteSetting } from '@/payload-types'

import { Brand } from './Brand'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { featureEnabled } from '@/lib/features'

import { Icon } from './Icon'
import { footerGroups as groups } from './navigation'
import { SmartLink } from './SmartLink'
import styles from './Footer.module.css'

type FooterProps = {
  settings: SiteSetting | null
}

export function Footer({ settings }: FooterProps) {
  const newsletter = featureEnabled('NEWSLETTER_ENABLED')
  const name = settings?.name || 'Paróquia Nossa Senhora Aparecida'

  return (
    <>
      <section className={styles.contactCta} aria-labelledby="footer-contact-title">
        <div className="container">
          <div>
            <span className="eyebrow">Comunicação e acolhimento</span>
            <h2 id="footer-contact-title">Acompanhe a vida da nossa comunidade.</h2>
            <p>Leia os comunicados paroquiais ou fale com a secretaria para receber orientações.</p>
            {newsletter && (
              <div className={`${styles.ctaActions} ${styles.ctaActionsInline}`}>
                <SmartLink className="button-secondary" href="/comunicacao">
                  Ver comunicação <Icon name="arrow" />
                </SmartLink>
                <SmartLink className="button-secondary" href="/contato">
                  Entrar em contato <Icon name="arrow" />
                </SmartLink>
              </div>
            )}
          </div>
          {newsletter ? (
            <NewsletterForm />
          ) : (
            <div className={styles.ctaActions}>
              <SmartLink className="button-secondary" href="/comunicacao">
                Ver comunicação <Icon name="arrow" />
              </SmartLink>
              <SmartLink className="button" href="/contato">
                Entrar em contato <Icon name="arrow" />
              </SmartLink>
            </div>
          )}
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
            <nav aria-label={group.label} className={styles.navGroup} key={group.label}>
              <h3>{group.label}</h3>
              {group.links?.map(
                (link) =>
                  link.url && (
                    <SmartLink external={link.external} href={link.url} key={link.url}>
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
