import type { SiteSetting } from '@/payload-types'

import styles from './ContactCards.module.css'
import { emailHref, phoneHref, safeExternalUrl, whatsappHref } from './utils'
import { Icon } from '@/components/site/Icon'

type ContactCardsProps = {
  settings: SiteSetting
  emptyMessage?: string
}

export function ContactCards({
  settings,
  emptyMessage = 'Os canais de contato ainda não foram publicados.',
}: ContactCardsProps) {
  const mapUrl = safeExternalUrl(settings.mapUrl)
  const whatsappUrl = settings.whatsapp ? whatsappHref(settings.whatsapp) : null
  const hasContent = Boolean(
    mapUrl ||
    settings.address ||
    settings.postalCode ||
    settings.phone ||
    whatsappUrl ||
    settings.email,
  )

  if (!hasContent) return <p className="notice">{emptyMessage}</p>

  return (
    <div className={styles.grid}>
      {mapUrl && (
        <a
          className={styles.map}
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir endereço da paróquia no mapa"
        >
          <Icon className={styles.mapPin} name="map-pin" />
          <strong>{settings.shortName || 'Paróquia'} · localização</strong>
          <span>
            Abrir no mapa <Icon name="external" />
          </span>
        </a>
      )}
      {(settings.address || settings.postalCode) && (
        <section className={styles.card}>
          <h3>Endereço</h3>
          {settings.address && <p>{settings.address}</p>}
          {settings.postalCode && <p>CEP {settings.postalCode}</p>}
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              Como chegar <Icon name="external" />
            </a>
          )}
        </section>
      )}
      {(settings.phone || whatsappUrl) && (
        <section className={styles.card}>
          <h3>{settings.phone ? 'Telefone e WhatsApp' : 'WhatsApp'}</h3>
          {settings.phone && <p>{settings.phone}</p>}
          {!settings.phone && settings.whatsapp && <p>{settings.whatsapp}</p>}
          <div className={styles.actions}>
            {settings.phone && (
              <a className="button-secondary" href={phoneHref(settings.phone)}>
                Ligar
              </a>
            )}
            {whatsappUrl && (
              <a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp <Icon name="external" />
              </a>
            )}
          </div>
        </section>
      )}
      {settings.email && (
        <section className={styles.card}>
          <h3>E-mail</h3>
          <p className={styles.breakable}>{settings.email}</p>
          <a className="button" href={emailHref(settings.email)}>
            Enviar e-mail <Icon name="arrow" />
          </a>
        </section>
      )}
    </div>
  )
}
