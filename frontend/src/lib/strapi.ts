const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') || 'http://127.0.0.1:1337'

export function getStrapiMediaUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${STRAPI_URL}${path}`
}

type FetchStrapiOptions = {
  token?: string
  next?: { revalidate?: number; tags?: string[] }
  cache?: RequestCache
}

export async function fetchStrapi<T>(endpoint: string, options: FetchStrapiOptions = {}): Promise<T> {
  const token = options.token ?? process.env.STRAPI_API_TOKEN
  const url = `${STRAPI_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: options.cache,
    next: options.next,
  })

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export function getStrapiUrl() {
  return STRAPI_URL
}