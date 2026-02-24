import { NextResponse } from 'next/server'
import { getProducts } from '@/data'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const products = await getProducts()
  const results = products
    .filter((product) => {
      const inTitle = product.title.toLowerCase().includes(query)
      const inVendor = product.vendor?.toLowerCase().includes(query)
      const inTags = product.tags?.some((tag) => tag.toLowerCase().includes(query))
      return inTitle || inVendor || inTags
    })
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.price,
      image: product.images?.[0]?.src ?? product.featured_image?.src ?? '/placeholder.webp',
    }))

  return NextResponse.json({ results })
}
