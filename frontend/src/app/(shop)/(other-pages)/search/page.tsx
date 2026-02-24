import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { getProducts } from '@/data'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Search',
  description: 'Search products',
}

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = (searchParams?.q ?? '').trim().toLowerCase()
  const products = await getProducts()
  const results = query
    ? products.filter((product) => {
        const inTitle = product.title.toLowerCase().includes(query)
        const inVendor = product.vendor?.toLowerCase().includes(query)
        const inTags = product.tags?.some((tag) => tag.toLowerCase().includes(query))
        return inTitle || inVendor || inTags
      })
    : []

  return (
    <div className="container">
      <div className="mx-auto max-w-4xl py-16 sm:py-24">
        <Heading level={1} bigger>
          Search <span data-slot="italic">Results</span>
        </Heading>
        <Text className="mt-2 text-zinc-500">
          {query ? `Showing results for "${query}"` : 'Type something to search for products.'}
        </Text>

        <Divider className="my-10" />

        {!query ? (
          <Text className="text-zinc-500">Please enter a search term.</Text>
        ) : results.length === 0 ? (
          <Text className="text-zinc-500">No products found.</Text>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 hover:bg-zinc-50"
              >
                <div className="relative h-20 w-16 shrink-0">
                  <Image
                    src={product.images?.[0]?.src ?? product.featured_image?.src ?? '/placeholder.webp'}
                    alt={product.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="5rem"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <Text className="text-sm font-medium text-zinc-900">{product.title}</Text>
                  <Text className="mt-1 text-xs text-zinc-500">{product.vendor}</Text>
                  <Text className="mt-2 text-sm font-medium text-zinc-900">${product.price.toFixed(2)}</Text>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Divider />
    </div>
  )
}
