import Link from 'next/link'

type Role = 'admin' | 'editor' | 'contributor' | 'secretary'
type Shortcut = { href: string; title: string; description: string; roles: Role[] }

const content: Role[] = ['admin', 'editor', 'contributor']
const service: Role[] = ['admin', 'secretary']

const shortcuts: Shortcut[] = [
  {
    href: '/admin/collections/posts/create',
    title: 'Publicar uma notícia',
    description: 'Notícia, artigo, álbum de fotos ou vídeo.',
    roles: content,
  },
  {
    href: '/admin/collections/events/create',
    title: 'Criar um evento',
    description: 'Festa, encontro, retiro ou reunião na Agenda.',
    roles: content,
  },
  {
    href: '/admin/collections/celebration-exceptions/create',
    title: 'Avisar mudança de missa',
    description: 'Cancelamento, troca de horário ou celebração extra.',
    roles: content,
  },
  {
    href: '/admin/collections/notices/create',
    title: 'Colocar um aviso no site',
    description: 'Uma faixa de recado no topo das páginas.',
    roles: content,
  },
  {
    href: '/admin/collections/highlights',
    title: 'Trocar os banners',
    description: 'As imagens grandes do topo da página inicial.',
    roles: content,
  },
  {
    href: '/admin/collections/celebrations',
    title: 'Ver os horários de missa',
    description: 'Os horários fixos de cada igreja e comunidade.',
    roles: content,
  },
  {
    href: '/admin/collections/contact-messages',
    title: 'Ler as mensagens recebidas',
    description: 'O que os visitantes enviaram pelo site.',
    roles: service,
  },
  {
    href: '/admin/globals/site-settings',
    title: 'Atualizar telefone e horário da secretaria',
    description: 'Dados que aparecem no rodapé e na página Secretaria.',
    roles: ['admin', 'editor'],
  },
]

/** Greeting and task shortcuts shown above the panel dashboard. */
export function Welcome({ user }: { user?: { name?: string | null; role?: Role } | null }) {
  const role = user?.role
  const visible = shortcuts.filter((shortcut) => !role || shortcut.roles.includes(role))
  const firstName = user?.name?.trim().split(/\s+/)[0]

  return (
    <section aria-labelledby="welcome-title" style={{ marginBottom: 'calc(var(--base) * 2)' }}>
      <h2 id="welcome-title" style={{ marginBottom: 'calc(var(--base) / 4)' }}>
        {firstName ? `Olá, ${firstName}.` : 'Olá.'} O que você quer fazer?
      </h2>
      <p style={{ marginBottom: 'var(--base)', color: 'var(--theme-elevation-600)' }}>
        Toda alteração pode ser salva como rascunho e conferida no botão de prévia antes de
        publicar. <a href="/" rel="noopener noreferrer" target="_blank">Abrir o site</a>
      </p>
      <ul
        style={{
          display: 'grid',
          gap: 'calc(var(--base) / 2)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {visible.map((shortcut) => (
          <li key={shortcut.href}>
            <Link
              href={shortcut.href}
              style={{
                background: 'var(--theme-elevation-50)',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 'var(--style-radius-m)',
                display: 'block',
                height: '100%',
                padding: 'calc(var(--base) * 0.75)',
                textDecoration: 'none',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 4 }}>{shortcut.title}</strong>
              <span style={{ color: 'var(--theme-elevation-600)' }}>{shortcut.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
