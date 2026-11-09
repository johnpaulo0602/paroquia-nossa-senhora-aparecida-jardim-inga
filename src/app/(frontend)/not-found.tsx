import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container page page-header">
      <p className="eyebrow">Página não encontrada</p>
      <h1>Não foi possível encontrar este conteúdo.</h1>
      <p>O endereço pode ter mudado ou o conteúdo ainda não foi publicado.</p>
      <div className="grid">
        <Link className="button" href="/">
          Voltar ao início
        </Link>
        <Link className="button-secondary" href="/contato">
          Falar com a paróquia
        </Link>
      </div>
    </section>
  )
}
