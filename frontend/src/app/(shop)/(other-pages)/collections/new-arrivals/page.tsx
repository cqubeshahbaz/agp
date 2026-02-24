import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { getProducts } from '@/data'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Discover the latest jewelry pieces added to our store.',
}

export default async function NewArrivalsPage() {
  const arrivals = await getProducts(12)
  const spotlight = arrivals[0]
  const sidePicks = arrivals.slice(1, 3)
  const gridPicks = arrivals.slice(3)

  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-linear-to-br from-amber-50 via-white to-rose-50 px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-rose-200/40 blur-3xl" />

        {/* <Text className="text-xs uppercase tracking-[0.2em] text-zinc-600">Fresh Drop</Text> */}
        <Heading className="mt-4" bigger>
          New <span data-slot="italic">Arrivals</span>
        </Heading>
        <Text className="mt-4 max-w-2xl text-zinc-600">
          Latest pieces, limited stock, updated automatically from your newest products.
        </Text>
      </div>

      <Divider className="my-10" />

      {!spotlight ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center">
          <Text className="text-zinc-600">No new arrivals yet. Add products in Strapi and they will appear here.</Text>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3">
          <Link
            href={`/products/${spotlight.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl lg:col-span-2"
          >
            <div className="relative aspect-16/10 w-full">
              <Image
                src={spotlight.featured_image?.src || '/placeholder.webp'}
                alt={spotlight.featured_image?.alt || spotlight.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/75 via-zinc-950/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <Text className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs uppercase text-zinc-900">
                Spotlight
              </Text>
              <Text className="mt-3 text-xl text-white sm:text-2xl">{spotlight.title}</Text>
              <Text className="mt-1 text-sm text-zinc-200">${spotlight.price.toFixed(2)}</Text>
            </div>
          </Link>

          <div className="space-y-6">
            {sidePicks.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-zinc-200 p-4"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.featured_image?.src || '/placeholder.webp'}
                    alt={item.featured_image?.alt || item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <Text className="mt-3 line-clamp-1 text-zinc-900">{item.title}</Text>
                <Text className="mt-1 text-sm text-zinc-500">${item.price.toFixed(2)}</Text>
              </Link>
            ))}
          </div>
        </section>
      )}

      {gridPicks.length > 0 ? (
        <>
          <Divider className="my-10" />
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gridPicks.map((item, index) => (
              <Link
                key={item.id}
                href={`/products/${item.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group rounded-2xl border border-zinc-200 p-3 ${index % 5 === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div className={`relative w-full overflow-hidden rounded-xl ${index % 5 === 0 ? 'aspect-video' : 'aspect-4/5'}`}>
                  <Image
                    src={item.featured_image?.src || '/placeholder.webp'}
                    alt={item.featured_image?.alt || item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <Text className="mt-3 line-clamp-1 text-zinc-900">{item.title}</Text>
                <div className="mt-1 flex items-center justify-between">
                  <Text className="text-sm text-zinc-500">{item.vendor}</Text>
                  <Text className="text-sm text-zinc-900">${item.price.toFixed(2)}</Text>
                </div>
              </Link>
            ))}
          </section>

          <div className="mt-10 flex justify-center">
            <Button href="/collections/all" outline>
              View All Products
            </Button>
          </div>
        </>
      ) : null}

      <Divider className="mt-12" />
    </div>
  )
}
