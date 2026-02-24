import { getBlogPosts } from '@/data'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPostCartProps {
  post: Awaited<ReturnType<typeof getBlogPosts>>[number]
  className?: string
}

export const metadata: Metadata = {
  title: 'Blog post',
  description:
    'Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS tricks articles.',
}

const BlogPostCart = ({ post, className }: BlogPostCartProps) => {
  return (
    <article key={post.id} className={clsx('relative flex flex-col items-start justify-between', className)}>
      <div className="relative aspect-square w-full">
        {post.featuredImage.src && (
          <Image
            alt={post.featuredImage.alt || post.title}
            src={post.featuredImage}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Category Label */}
        <div className="absolute top-3 left-3">
          <div className="rounded-full bg-white px-3.5 py-1.5 text-xs leading-none text-zinc-900 uppercase">
            {post.category.title}
          </div>
        </div>

        {/* Shopping Bag Icon */}
        <div className="absolute top-3 right-3">
          <div className="rounded-full bg-white p-1.5">
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} color="currentColor" strokeWidth={1} />
          </div>
        </div>
      </div>
      <div className="max-w-xl">
        <div className="group">
          <h3 className="mt-6 text-base font-semibold text-zinc-900 uppercase group-hover:text-zinc-600">
            <Link href={'/blog/' + post.handle}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
        </div>
        <div className="mt-2.5 flex items-center gap-x-4 text-sm">
          <time dateTime={post.date}>{post.date}</time>
          <span>/</span>
          <span>{post.timeToRead}</span>
        </div>
      </div>
    </article>
  )
}

export default BlogPostCart
