'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Media } from '@/payload-types'

import { MediaImage } from '@/components/site/MediaImage'
import { SmartLink } from '@/components/site/SmartLink'

import styles from './HeroCarousel.module.css'
import { Icon } from '@/components/site/Icon'

export type HeroSlide = {
  id: number | string
  title: string
  eyebrow: string
  summary: string
  image?: number | Media | null
  ctaLabel: string
  href: string
  external?: boolean
}

type HeroCarouselProps = {
  slides: HeroSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slide = slides[activeIndex] || slides[0]
  if (!slide) return null

  const selectSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length)
  }

  return (
    <section
      aria-label="Destaques da paróquia"
      aria-roledescription="carrossel"
      className={styles.carousel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') selectSlide(activeIndex - 1)
        if (event.key === 'ArrowRight') selectSlide(activeIndex + 1)
      }}
    >
      <div
        aria-label={`${activeIndex + 1} de ${slides.length}`}
        aria-roledescription="slide"
        className={styles.slide}
        key={slide.id}
        role="group"
      >
        <div className={styles.media}>
          {slide.image ? (
            <MediaImage
              alt=""
              className={styles.image}
              eager={activeIndex === 0}
              image={slide.image}
              sizes="(max-width: 768px) 100vw, 1240px"
            />
          ) : (
            <Image
              alt=""
              className={styles.image}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1240px"
              src="/images/matriz-atual.jpg"
            />
          )}
        </div>
        <div className={styles.copy}>
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.summary}</p>
          <SmartLink icon className={styles.heroButton} external={slide.external} href={slide.href}>
            {slide.ctaLabel}
          </SmartLink>
        </div>
      </div>
      {slides.length > 1 && (
        <div className={styles.controls}>
          <div className={styles.dots} aria-label="Escolher destaque">
            {slides.map((item, index) => (
              <button
                aria-label={`Exibir destaque ${index + 1}: ${item.title}`}
                aria-pressed={index === activeIndex}
                key={item.id}
                onClick={() => selectSlide(index)}
                type="button"
              />
            ))}
          </div>
          <div className={styles.arrows}>
            <button
              aria-label="Destaque anterior"
              onClick={() => selectSlide(activeIndex - 1)}
              type="button"
            >
              <Icon name="arrowLeft" />
            </button>
            <button
              aria-label="Próximo destaque"
              onClick={() => selectSlide(activeIndex + 1)}
              type="button"
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        Destaque {activeIndex + 1} de {slides.length}: {slide.title}
      </p>
    </section>
  )
}
