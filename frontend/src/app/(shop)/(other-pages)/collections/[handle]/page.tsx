import Breadcrumb from '@/components/breadcrumb'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Pagination, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import ProductCard from '@/components/product-card'
import StarSvg from '@/components/star-svg'
import { Text } from '@/components/text'
import { getCollectionByHandle } from '@/data'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import CategoryFilters1 from '../category-filters-1'
import ProductSortDropdown from '../product-sort-dropdown'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) {
    return {
      title: 'Collection not found',
      description: 'The collection you are looking for does not exist.',
    }
  }
  const { title, description } = collection
  return { title, description }
}

export default async function Collection({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams?: Promise<{ page?: string; category?: string; purity?: string; price?: string; sort?: string }>
}) {
  const { handle } = await params
  const query = (await searchParams) || {}
  const collection = await getCollectionByHandle(handle)
  if (!collection) {
    return redirect('/collections/all')
  }
  const category = (query.category || '').toLowerCase()
  const purity = (query.purity || '').toLowerCase()
  const price = (query.price || '').toLowerCase()
  const sort = (query.sort || '').toLowerCase()

  let filteredProducts = [...collection.products]

  if (category && category !== 'all-jewelry') {
    filteredProducts = filteredProducts.filter((product) => {
      const haystack = `${product.title} ${product.vendor} ${product.collections.map((c) => c.title).join(' ')}`.toLowerCase()
      return haystack.includes(category.replace('-', ' '))
    })
  }

  if (purity) {
    filteredProducts = filteredProducts.filter((product) => {
      const haystack = `${product.tags.join(' ')} ${product.selected_options.map((o) => o.value).join(' ')}`.toLowerCase()
      return haystack.includes(purity)
    })
  }

  if (price) {
    filteredProducts = filteredProducts.filter((product) => {
      if (price === 'under-10000') return product.price < 10000
      if (price === '10000-30000') return product.price >= 10000 && product.price <= 30000
      if (price === '30000-70000') return product.price > 30000 && product.price <= 70000
      if (price === '70000-plus') return product.price > 70000
      return true
    })
  }

  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sort === 'title-asc') {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sort === 'title-desc') {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
  }

  const perPage = 9
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage))
  const currentPage = Math.min(
    Math.max(1, Number(query.page ?? '1')),
    totalPages
  )
  const startIndex = (currentPage - 1) * perPage
  const products = filteredProducts.slice(startIndex, startIndex + perPage)
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (purity) params.set('purity', purity)
    if (price) params.set('price', price)
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    return `?${params.toString()}`
  }
  const breadcrumbs = [{ id: 1, name: 'Home', href: '/' }]

  return (
    <div className="container">
      <div>
        <Breadcrumb breadcrumbs={breadcrumbs} currentPage={collection.title} className="py-3.5" />

        <Divider />

        <main className="">
          <div className="flex flex-col items-center py-14 text-center lg:py-20">
            <StarSvg />
            <Heading bigger level={1} className="mt-5">
              <span data-slot="dim">Collection</span>
              <br />
              <span data-slot="italic" className="underline">
                {collection.title}
              </span>
            </Heading>
            <Text className="mt-5 max-w-xl">{collection.description}</Text>
          </div>

          <div className="flex justify-between gap-4">
            <Text>{filteredProducts.length} products</Text>
            <Suspense fallback={null}>
              <ProductSortDropdown align="right" />
            </Suspense>
          </div>

          <Divider className="mt-5" />

          <div className="pt-10 pb-16 sm:pt-12 sm:pb-24">
            <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
              <Suspense fallback={null}>
                <CategoryFilters1 />
              </Suspense>

              <section aria-labelledby="product-heading" className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                <h2 id="product-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-7 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination className="mt-14 sm:mt-20">
                  <PaginationPrevious href={currentPage > 1 ? buildPageHref(currentPage - 1) : null} />
                  <PaginationList>
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1
                      return (
                        <PaginationPage key={page} href={buildPageHref(page)} current={page === currentPage}>
                          {page}
                        </PaginationPage>
                      )
                    })}
                  </PaginationList>
                  <PaginationNext href={currentPage < totalPages ? buildPageHref(currentPage + 1) : null} />
                </Pagination>
              </section>
            </div>
          </div>
        </main>
      </div>

      <Divider />
    </div>
  )
}

