type PageHeaderProps = {
  eyebrow?: string
  title: string
  intro?: string
}

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="page-header container">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </header>
  )
}
