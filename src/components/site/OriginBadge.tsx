type Origin = 'official' | 'research' | 'archive' | 'demonstration' | null | undefined

const labels: Partial<Record<NonNullable<Origin>, { label: string; title: string }>> = {
  demonstration: {
    label: 'Demonstração',
    title: 'Conteúdo de exemplo, visível só em desenvolvimento.',
  },
  research: {
    label: 'Em confirmação',
    title: 'Informação de pesquisa externa, ainda não confirmada pela paróquia.',
  },
  archive: {
    label: 'Acervo',
    title: 'Registro histórico do acervo.',
  },
}

/**
 * Small tag derived from the record's `origin` field. Use it instead of writing
 * "(fictício)" or "confirmação pendente" into titles and descriptions. Official
 * content renders nothing.
 */
export function OriginBadge({ origin, className }: { origin: Origin; className?: string }) {
  const entry = origin ? labels[origin] : undefined
  if (!entry) return null

  return (
    <span className={`origin-badge ${className ?? ''}`} data-origin={origin} title={entry.title}>
      {entry.label}
    </span>
  )
}
