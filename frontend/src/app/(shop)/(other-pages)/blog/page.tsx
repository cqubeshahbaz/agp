import BlogPostCart from '@/components/blog-post-cart'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Pagination, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import { Text } from '@/components/text'
import { getBlogPosts } from '@/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS tricks articles.',
}

export default async function Page({ searchParams }: { searchParams?: { page?: string } }) {
  const posts = await getBlogPosts()
  const perPage = 6
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  const currentPage = Math.min(
    Math.max(1, Number(searchParams?.page ?? '1')),
    totalPages
  )
  const startIndex = (currentPage - 1) * perPage
  const pagedPosts = posts.slice(startIndex, startIndex + perPage)

  return (
    <div className="container">
      <div className="flex flex-col items-center py-14 text-center lg:py-20">
        <Heading bigger level={1} className="mt-5">
          <span>Clean</span>
          <br />
          <span data-slot="italic" className="underline">
            Journal.
          </span>
        </Heading>
        <Text className="mt-5 max-w-xl">
          Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS
          tricks articles.
        </Text>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:mx-0 xl:grid-cols-3">
        {pagedPosts.map((post) => (
          <BlogPostCart key={post.id} post={post} />
        ))}
      </div>

      <Pagination className="mx-auto mt-14 sm:mt-28">
        <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}` : null} />
        <PaginationList>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1
            return (
              <PaginationPage key={page} href={`?page=${page}`} current={page === currentPage}>
                {page}
              </PaginationPage>
            )
          })}
        </PaginationList>
        <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}` : null} />
      </Pagination>

      <Divider className="mt-16 sm:mt-24 lg:mt-28" />
    </div>
  )
}
