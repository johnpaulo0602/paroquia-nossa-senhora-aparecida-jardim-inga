'use client'

import { useState } from 'react'

import type { Media } from '@/payload-types'

import { MediaImage } from '@/components/site/MediaImage'
import { SmartLink } from '@/components/site/SmartLink'

import styles from './SponsorsMarquee.module.css'

export type SponsorLogo = {
  id: number
  name: string
  logo: number | Media
  url?: string | null
}

type SponsorsMarqueeProps = {
  sponsors: SponsorLogo[]
}

function SponsorGroup({ sponsors, hidden = false }: { sponsors: SponsorLogo[]; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className={styles.group}>
      {sponsors.map((sponsor) => {
        const content = (
          <>
            <MediaImage alt={sponsor.name} image={sponsor.logo} sizes="200px" />
            <span className={styles.fallback}>{sponsor.name}</span>
          </>
        )

        return sponsor.url && !hidden ? (
          <SmartLink
            aria-label={`${sponsor.name} — site do patrocinador`}
            className={styles.logo}
            external
            href={sponsor.url}
            key={sponsor.id}
          >
            {content}
          </SmartLink>
        ) : (
          <div className={styles.logo} key={sponsor.id}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

export function SponsorsMarquee({ sponsors }: SponsorsMarqueeProps) {
  const [paused, setPaused] = useState(false)

  return (
    <>
      <div
        aria-label="Patrocinadores da paróquia"
        className={`${styles.marquee} ${paused ? styles.paused : ''}`}
      >
        <div className={styles.track}>
          <SponsorGroup sponsors={sponsors} />
          <SponsorGroup hidden sponsors={sponsors} />
        </div>
      </div>
      <button
        aria-pressed={paused}
        className={`button-secondary ${styles.toggle}`}
        onClick={() => setPaused((value) => !value)}
        type="button"
      >
        {paused ? 'Retomar animação' : 'Pausar animação'}
      </button>
    </>
  )
}
