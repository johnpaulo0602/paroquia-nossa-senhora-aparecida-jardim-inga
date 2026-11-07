import type { ComponentProps } from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type RichTextProps = {
  content: ComponentProps<typeof LexicalRichText>['data'] | null | undefined
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  return <LexicalRichText className={className} data={content} />
}
