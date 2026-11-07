import Image from 'next/image'

import type { SiteSetting } from '@/payload-types'

import { MediaImage } from './MediaImage'
import { SmartLink } from './SmartLink'
import styles from './Brand.module.css'

type BrandProps = {
  settings: SiteSetting | null
  inverted?: boolean
}

export function Brand({ settings, inverted = false }: BrandProps) {
  const name = settings?.shortName || settings?.name || 'Nossa Senhora Aparecida'

  return (
    <SmartLink
      aria-label={`${name} — página inicial`}
      className={`${styles.brand} ${inverted ? styles.inverted : ''}`}
      href="/"
    >
      <span className={styles.symbol}>
        {settings?.logo ? (
          <MediaImage image={settings.logo} alt="" sizes="110px" />
        ) : (
          <Image alt="" height={50} src="/images/logo-igreja.png" width={110} />
        )}
      </span>
      <span className={styles.words}>
        <small>Paróquia</small>
        <strong>{name}</strong>
        <em>Jardim Ingá · GO</em>
      </span>
    </SmartLink>
  )
}
