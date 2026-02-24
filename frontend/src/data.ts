import { fetchStrapi, getStrapiMediaUrl } from '@/lib/strapi'
import { cache } from 'react'

export interface TProductImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface TProductItem {
  id: number
  title: string
  handle: string
  vendor: string
  tags: string[]
  price: number
  images: TProductImage[]
  featured_image: TProductImage
  options: Array<{
    name: string
    optionValues: Array<{
      name: string
      swatch: { color?: string | null; image?: null } | null
    }>
  }>
  selected_options: Array<{ name: string; value: string }>
  collections: Array<{ title: string; id: number | string; handle: string }>
  description: string
}

export interface TCollection {
  id: number | string
  title: string
  handle: string
  description: string
  updatedAt: string
  image: string
  products: TProductItem[]
}

type StrapiEntity<T> = T & { id: number; attributes?: T; documentId?: string }
type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  width?: number | null
  height?: number | null
}
type StrapiCategory = {
  id?: number
  title?: string | null
  slug?: string | null
  description?: string | null
  image?: StrapiMedia | { data?: StrapiEntity<StrapiMedia> | null } | null
}
type StrapiProduct = {
  title?: string | null
  slug?: string | null
  price?: number | string | null
  weight?: number | string | null
  purity?: string | null
  description?: string | null
  images?: StrapiMedia[] | { data?: Array<StrapiEntity<StrapiMedia>> } | null
  category?: StrapiCategory | { data?: StrapiEntity<StrapiCategory> | null } | null
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseDecimal(input: unknown, fallback = 0) {
  if (typeof input === 'number') return input
  if (typeof input === 'string') {
    const parsed = Number.parseFloat(input)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function unwrapEntity<T>(entity?: StrapiEntity<T> | T | null): (T & { id?: number }) | null {
  if (!entity) return null
  if (typeof entity === 'object' && 'attributes' in entity && entity.attributes) {
    return { ...(entity.attributes as T), id: (entity as StrapiEntity<T>).id }
  }
  return entity as T & { id?: number }
}

function normalizeMedia(media: StrapiProduct['images']) {
  if (!media) return []
  if (Array.isArray(media)) return media
  return (media.data ?? [])
    .map((item) => unwrapEntity(item))
    .filter((item): item is StrapiMedia => Boolean(item))
}

function normalizeCategory(category: StrapiProduct['category']): StrapiCategory | null {
  if (!category) return null
  if ('data' in category) return unwrapEntity(category.data)
  return category as StrapiCategory
}

function normalizeCategoryImage(image?: StrapiCategory['image']): StrapiMedia | null {
  if (!image) return null
  if ('data' in image) return unwrapEntity(image.data)
  return image as StrapiMedia
}

async function getStrapiProductsRaw(limit = 200) {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL) return []

  const pageSize = Math.max(1, Math.min(limit, 200))
  const response = await fetchStrapi<{ data?: Array<StrapiEntity<StrapiProduct>> }>(
    `/api/products?populate=images&populate=category&pagination[pageSize]=${pageSize}&sort=createdAt:desc`,
    { next: { revalidate: 30 } }
  )

  return response.data ?? []
}

async function getStrapiProductByHandleRaw(handle: string) {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL) return null
  const normalizedHandle = handle.trim().toLowerCase()
  if (!normalizedHandle) return null

  const endpoint = `/api/products?populate=images&populate=category&filters[slug][$eqi]=${encodeURIComponent(
    normalizedHandle
  )}&pagination[pageSize]=1`
  const response = await fetchStrapi<{ data?: Array<StrapiEntity<StrapiProduct>> }>(endpoint, {
    next: { revalidate: 30 },
  })
  const directMatch = response.data?.[0] ?? null
  if (directMatch) return directMatch

  // Fallback for products that have no slug stored in Strapi.
  const fallbackResponse = await fetchStrapi<{ data?: Array<StrapiEntity<StrapiProduct>> }>(
    '/api/products?populate=images&populate=category&pagination[pageSize]=200&sort=createdAt:desc',
    { next: { revalidate: 30 } }
  )
  const fallbackMatch = (fallbackResponse.data ?? []).find((entry) => {
    const row = unwrapEntity(entry)
    if (!row) return false
    const titleHandle = slugify(String(row.title || ''))
    return titleHandle === normalizedHandle
  })

  return fallbackMatch ?? null
}

function mapStrapiProduct(row: StrapiProduct & { id?: number }): TProductItem | null {
  const title = (row.title || 'Untitled product').trim()
  const handle = (row.slug || slugify(title)).trim()
  if (!handle) return null

  const category = normalizeCategory(row.category)
  const categoryTitle = (category?.title || 'Jewelry').trim()
  const categoryHandle = (category?.slug || slugify(categoryTitle)).trim()
  const purity = (row.purity || '').trim()
  const weight = parseDecimal(row.weight, 0)
  const sizeValue = weight > 0 ? `${weight}g` : 'Standard'

  const images = normalizeMedia(row.images)
    .map((image) => {
      const src = getStrapiMediaUrl(image.url ?? null)
      if (!src) return null
      return {
        src,
        alt: image.alternativeText || title,
        width: image.width ?? 1200,
        height: image.height ?? 1600,
      }
    })
    .filter((image): image is TProductImage => Boolean(image))

  const fallbackImage: TProductImage = {
    src: '/placeholder.webp',
    alt: title,
    width: 1200,
    height: 1600,
  }

  const gallery = images.length ? images : [fallbackImage]
  return {
    id: row.id ?? 0,
    title,
    handle,
    vendor: categoryTitle,
    tags: [purity, sizeValue].filter(Boolean),
    price: parseDecimal(row.price, 0),
    images: gallery,
    featured_image: gallery[0],
    options: [
      {
        name: 'Size',
        optionValues: [{ name: sizeValue, swatch: null }],
      },
    ],
    selected_options: [
      { name: 'Size', value: sizeValue },
    ],
    collections: [{ title: categoryTitle, id: category?.id ?? categoryHandle, handle: categoryHandle }],
    description: (row.description || '').trim() || 'No description available.',
  }
}

async function getStrapiCategoriesRaw() {
  if (!process.env.NEXT_PUBLIC_STRAPI_URL) return []

  const response = await fetchStrapi<{ data?: Array<StrapiEntity<StrapiCategory>> }>(
    '/api/categories?populate=image&pagination[pageSize]=200&sort=title:asc',
    { next: { revalidate: 30 } }
  )

  return response.data ?? []
}

export const getProducts = cache(async (limit = 200): Promise<TProductItem[]> => {
  try {
    const rows = await getStrapiProductsRaw(limit)

    return rows
      .map((row) => unwrapEntity(row))
      .filter((row): row is StrapiProduct & { id?: number } => Boolean(row))
      .map(mapStrapiProduct)
      .filter((product): product is TProductItem => Boolean(product))
  } catch {
    return []
  }
})

export const getCollections = cache(async (_theme: 'jewelry' | 'all' = 'all'): Promise<TCollection[]> => {
  try {
    const [products, categoriesRaw] = await Promise.all([getProducts(), getStrapiCategoriesRaw()])

    const categories = categoriesRaw
      .map((row) => unwrapEntity(row))
      .filter((row): row is StrapiCategory & { id?: number } => Boolean(row))

    const fromCategories = categories
      .map((category) => {
        const title = (category.title || '').trim()
        const handle = (category.slug || slugify(title)).trim()
        if (!title || !handle) return null

        const categoryProducts = products.filter((product) => product.collections[0]?.handle === handle)
        if (!categoryProducts.length) return null

        const media = normalizeCategoryImage(category.image)
        const image =
          getStrapiMediaUrl(media?.url ?? null) ?? categoryProducts[0]?.featured_image?.src ?? '/placeholder.webp'

        return {
          id: category.id ?? handle,
          title,
          handle,
          description: (category.description || '').trim() || `${title} collection`,
          updatedAt: new Date().toISOString(),
          image,
          products: categoryProducts,
        }
      })
      .filter((collection): collection is TCollection => Boolean(collection))

    if (fromCategories.length) return fromCategories

    const grouped = new Map<string, TProductItem[]>()
    products.forEach((product) => {
      const key = product.collections[0]?.handle || 'uncategorized'
      const current = grouped.get(key) || []
      current.push(product)
      grouped.set(key, current)
    })

    return Array.from(grouped.entries()).map(([handle, groupedProducts]) => ({
      id: handle,
      title: groupedProducts[0]?.collections[0]?.title || 'Uncategorized',
      handle,
      description: `${groupedProducts.length} products`,
      updatedAt: new Date().toISOString(),
      image: groupedProducts[0]?.featured_image?.src ?? '/placeholder.webp',
      products: groupedProducts,
    }))
  } catch {
    return []
  }
})

export async function getGroupCollections(_theme: 'jewelry' | 'all' = 'all') {
  const collections = await getCollections('all')
  return collections.length
    ? [
        {
          id: 'strapi-group-1',
          title: 'Shop by Category',
          handle: 'all-categories',
          description: 'Collections from Strapi',
          collections,
        },
      ]
    : []
}

export async function getCollectionById(id: string) {
  const collections = await getCollections('all')
  return collections.find((item) => String(item.id) === id)
}

export async function getCollectionByHandle(handle: string) {
  if (handle === 'all') {
    const products = await getProducts()
    return {
      id: 'all',
      title: 'All Products',
      handle: 'all',
      description: 'All products from Strapi',
      updatedAt: new Date().toISOString(),
      image: products[0]?.featured_image?.src ?? '/placeholder.webp',
      products,
    }
  }

  const collections = await getCollections('all')
  return collections.find((item) => item.handle === handle)
}

export const getProductByHandle = cache(async (handle: string) => {
  try {
    const raw = await getStrapiProductByHandleRaw(handle)
    const row = unwrapEntity(raw)
    if (!row) return null
    return mapStrapiProduct(row)
  } catch {
    return null
  }
})

export const getRelatedProducts = cache(async (currentHandle: string, limit = 5) => {
  try {
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) return []
    const endpoint = `/api/products?populate=images&populate=category&filters[slug][$ne]=${encodeURIComponent(
      currentHandle
    )}&pagination[pageSize]=${Math.max(1, limit)}&sort=createdAt:desc`
    const response = await fetchStrapi<{ data?: Array<StrapiEntity<StrapiProduct>> }>(endpoint, {
      next: { revalidate: 30 },
    })
    return (response.data ?? [])
      .map((entry) => unwrapEntity(entry))
      .filter((entry): entry is StrapiProduct & { id?: number } => Boolean(entry))
      .map(mapStrapiProduct)
      .filter((item): item is TProductItem => Boolean(item))
  } catch {
    return []
  }
})

export async function getJewelryCollections() {
  return getCollections('all')
}

export async function getJewelryGroupCollections() {
  return getGroupCollections('jewelry')
}

export async function getJewelryProducts() {
  return getProducts()
}

// Non-product pages keep working without demo product data.
export async function getOrder(_number: string) {
  return null
}

export async function getOrders() {
  return []
}

export function getCountries() {
  return []
}

export async function getShopData() {
  return {
    description: '',
    name: 'agp',
    termsOfService: { url: '#', title: '', id: '', handle: '', body: '' },
    subscriptionPolicy: { body: '', handle: '', id: '', title: '', url: '#' },
    shippingPolicy: { body: '', handle: '', id: '', title: '', url: '#' },
    refundPolicy: { body: '', handle: '', id: '', title: '', url: '#' },
    privacyPolicy: { body: '', handle: '', id: '', title: '', url: '#' },
    primaryDomain: { url: '' },
  }
}

export function getBlogPosts() {
  return []
}

export function getBlogPostsByHandle(handle: string) {
  return {
    id: 0,
    title: handle,
    handle,
    excerpt: '',
    featuredImage: {
      src: '/placeholder.webp',
      alt: handle,
      width: 1200,
      height: 675,
    },
    date: '',
    datetime: '',
    category: { title: '', href: '#' },
    timeToRead: '',
    content: '',
    author: { name: '' },
  }
}

export async function getCartProducts() {
  return []
}
