import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ReflectionArticle } from '@/components/life/ReflectionArticle'
import styles from '@/components/life/life.module.css'
import { getReflectionBySlug } from '@/components/life/queries'

type ReflectionPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ReflectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getReflectionBySlug(slug)

  if (!post) return { title: 'Reflexão não encontrada' }

  return {
    title: post.title,
    description: post.summary,
  }
}

export default async function ReflectionPage({ params }: ReflectionPageProps) {
  const { slug } = await params
  const post = await getReflectionBySlug(slug)

  if (!post) notFound()

  return (
    <div className="page">
      <div className={`container ${styles.pageInner}`}>
        <ReflectionArticle post={post} />
      </div>
    </div>
  )
}
