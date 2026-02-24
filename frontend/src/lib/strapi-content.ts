import { fetchStrapi, getStrapiMediaUrl } from './strapi'

type StrapiMedia = {
  url?: string
}

type StrapiGlobalResponse = {
  data?: {
    siteName?: string
    siteDescription?: string
    favicon?: StrapiMedia | null
  }
}

export async function getGlobalSettings() {
  try {
    const response = await fetchStrapi<StrapiGlobalResponse>('/api/global?populate=favicon', {
      next: { revalidate: 60 },
    })

    const global = response?.data
    if (!global) return null

    return {
      siteName: global.siteName ?? null,
      siteDescription: global.siteDescription ?? null,
      faviconUrl: getStrapiMediaUrl(global.favicon?.url ?? null),
    }
  } catch {
    return null
  }
}
