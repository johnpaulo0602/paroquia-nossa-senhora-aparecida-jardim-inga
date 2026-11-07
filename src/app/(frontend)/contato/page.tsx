import type { Metadata } from 'next'
import Link from 'next/link'

import { Callout } from '@/components/institutional/Callout'
import { ContactCards } from '@/components/institutional/ContactCards'
import styles from '@/components/institutional/pages.module.css'
import { emailHref, phoneHref, whatsappHref } from '@/components/institutional/utils'
import { PageHeader } from '@/components/site/PageHeader'
import { getCMS } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Fale conosco',
  description: 'Canais diretos de contato e atendimento da Paróquia Nossa Senhora Aparecida.',
}

export default async function ContactPage() {
  const payload = await getCMS()
  const [page, settings] = await Promise.all([
    payload.findGlobal({
      slug: 'contact-page',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      draft: false,
      depth: 2,
    }),
  ])

  const whatsappUrl = settings.whatsapp
    ? whatsappHref(settings.whatsapp, 'Olá! Gostaria de falar com a Paróquia Nossa Senhora Aparecida.')
    : null
  const contactFormEnabled = process.env.CONTACT_FORM_ENABLED === 'true'

  return (
    <div className="page">
      <div className={`container ${styles.page}`}>
        <div className={styles.centeredHeader}>
          <PageHeader
            eyebrow="Escuta e diálogo"
            title={page.title || 'Fale conosco'}
            intro={
              page.intro ||
              'Entre em contato com a paróquia pelos canais de atendimento para dúvidas, orientações, pastorais ou parcerias.'
            }
          />
        </div>

        <div className={styles.contactLayout}>
          <section className={styles.messagePanel} aria-labelledby="direct-message-title">
            <span className="eyebrow">Atendimento direto</span>
            <h2 id="direct-message-title">Envie sua mensagem pelos canais oficiais</h2>
            <p>
              {page.formIntro ||
                'Para garantir que sua solicitação seja acolhida com segurança, o atendimento é realizado diretamente pelos canais da secretaria paroquial.'}
            </p>
            <p>
              Você pode falar sobre sacramentos, participação nas comunidades, pastorais,
              comunicação ou propostas de parceria.
            </p>

            <div className={styles.actions}>
              {whatsappUrl && (
                <a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Conversar pelo WhatsApp <span aria-hidden="true">↗</span>
                </a>
              )}
              {settings.email && (
                <a className="button-secondary" href={emailHref(settings.email)}>
                  Enviar e-mail <span aria-hidden="true">↗</span>
                </a>
              )}
              {settings.phone && (
                <a className="button-secondary" href={phoneHref(settings.phone)}>
                  Ligar para a secretaria
                </a>
              )}
              <Link className="button-secondary" href="/secretaria">
                Ver horários da secretaria <span aria-hidden="true">↗</span>
              </Link>
            </div>

            {!contactFormEnabled && (
              <p className={`notice ${styles.contactNote}`}>
                O formulário online permanece desativado até a definição operacional de atendimento e
                retenção pela paróquia. Nenhum dado pessoal é coletado por esta página.
              </p>
            )}
          </section>

          <aside className={styles.communitySidebar} aria-label="Orientações rápidas">
            <section className={styles.infoPanel}>
              <span className="eyebrow">Atendimento presencial</span>
              <h2>Secretaria paroquial</h2>
              <p>
                Para documentos, certidões, agendamentos pastorais e atendimento presencial, consulte
                a página exclusiva da secretaria.
              </p>
              <Link href="/secretaria">
                Acessar Secretaria paroquial <span aria-hidden="true">↗</span>
              </Link>
            </section>

            <section className={styles.infoPanel}>
              <span className="eyebrow">Sacramentos</span>
              <h2>Batismo, catequese e matrimônio</h2>
              <p>
                Veja os requisitos e orientações iniciais antes de procurar a equipe paroquial.
              </p>
              <Link href="/vida">
                Orientações sobre sacramentos <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </aside>
        </div>

        <section className={styles.section} aria-labelledby="contact-channels-title">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">Canais publicados</span>
            <h2 id="contact-channels-title">Endereço, telefone e e-mail</h2>
          </div>
          <ContactCards settings={settings} />
        </section>

        <Callout
          eyebrow="Celebrações e comunidades"
          title="Procurando horários de missa ou endereço de uma capela?"
          body="Consulte a programação semanal das comunidades e os avisos para datas especiais."
          href="/horarios"
          linkLabel="Ver horários de missa"
        />
      </div>
    </div>
  )
}
