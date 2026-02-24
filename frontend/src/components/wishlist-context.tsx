'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './auth-context'
import { useToast } from './toast'
import { getStoredToken } from '@/lib/strapi-auth'
import { getStrapiUrl } from '@/lib/strapi'

export type WishlistItem = {
  id: number
  documentId?: string
  productHandle: string
  name: string
  price: number
  imageSrc: string
  imageAlt: string
  color?: string | null
  size?: string | null
}

type WishlistState = {
  items: WishlistItem[]
  loading: boolean
}

type AddWishlistInput = {
  productHandle: string
  name: string
  price: number
  imageSrc: string
  imageAlt: string
  color?: string | null
  size?: string | null
}

type WishlistContextValue = WishlistState & {
  refresh: () => Promise<void>
  addItem: (input: AddWishlistInput) => Promise<{ ok: boolean; error?: string }>
  removeItem: (id: number) => Promise<{ ok: boolean; error?: string }>
  removeByHandle: (productHandle: string, color?: string | null, size?: string | null) => Promise<{ ok: boolean; error?: string }>
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)
const WISHLIST_STORAGE_KEY = 'agp_wishlist'

type StrapiRow = {
  id: number
  documentId?: string
  productHandle?: string
  product_handle?: string
  name?: string
  price?: number | string
  imageSrc?: string
  image_src?: string
  imageAlt?: string
  image_alt?: string
  color?: string | null
  size?: string | null
}

function mapRow(row: StrapiRow): WishlistItem {
  return {
    id: row.id,
    documentId: row.documentId,
    productHandle: row.productHandle || row.product_handle || '',
    name: row.name || '',
    price: Number(row.price ?? 0),
    imageSrc: row.imageSrc || row.image_src || '',
    imageAlt: row.imageAlt || row.image_alt || 'Product image',
    color: row.color ?? null,
    size: row.size ?? null,
  }
}

type StrapiEntry = {
  id?: number
  documentId?: string
  attributes?: Record<string, unknown>
} & Record<string, unknown>

function extractRows(payload: unknown): StrapiRow[] {
  if (!payload) return []
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const data = (payload as { data?: unknown }).data
    if (Array.isArray(data)) {
      return data.map((entry: StrapiEntry) => {
        const attrs = (entry.attributes ?? entry) as StrapiEntry
        return {
          ...(attrs as StrapiRow),
          id: Number(entry.id ?? attrs.id ?? 0),
          documentId: (entry.documentId ?? attrs.documentId) as string | undefined,
        }
      })
    }
  }
  if (Array.isArray(payload)) {
    return payload as StrapiRow[]
  }
  return []
}
async function strapiFetch(path: string, init?: RequestInit) {
  const token = getStoredToken()
  if (!token) throw new Error('Missing auth token')

  const response = await fetch(`${getStrapiUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const msg = data?.error?.message || 'Request failed'
    throw new Error(msg)
  }
  return data
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const persistWishlist = useCallback((nextItems: WishlistItem[]) => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ items: nextItems }))
  }, [])

  const refresh = useCallback(async () => {
    if (status !== 'authenticated' || !getStoredToken()) {
      setLoading(false)
      return
    }

    setLoading((current) => (items.length > 0 ? false : current))
    try {
      const data = await strapiFetch('/api/wishlist-items?sort=id:desc')
      const parsed = extractRows(data).map(mapRow)
      setItems(parsed)
      persistWishlist(parsed)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [status, items.length, persistWishlist])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem(WISHLIST_STORAGE_KEY)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { items: WishlistItem[] }
          setItems(parsed.items ?? [])
          setLoading(false)
        } catch {
          window.sessionStorage.removeItem(WISHLIST_STORAGE_KEY)
        }
      }
    }
    refresh()
  }, [refresh])

  const addItem = useCallback(
    async (input: AddWishlistInput) => {
      if (status !== 'authenticated' || !getStoredToken()) {
        const existing = items.find(
          (item) =>
            item.productHandle === input.productHandle &&
            (item.color || null) === (input.color || null) &&
            (item.size || null) === (input.size || null)
        )
        if (existing) {
          toast('Already in wishlist.', { variant: 'success' })
          return { ok: true }
        }

        const nextItems = [
          {
            id: Date.now(),
            productHandle: input.productHandle,
            name: input.name,
            price: input.price,
            imageSrc: input.imageSrc,
            imageAlt: input.imageAlt,
            color: input.color ?? null,
            size: input.size ?? null,
          },
          ...items,
        ]
        setItems(nextItems)
        persistWishlist(nextItems)
        toast('Added to wishlist.', { variant: 'success' })
        return { ok: true }
      }

      try {
        const filters = new URLSearchParams({
          'filters[productHandle][$eq]': input.productHandle,
          'pagination[pageSize]': '50',
        })
        const existingRaw = await strapiFetch(`/api/wishlist-items?${filters.toString()}`)
        const existing = extractRows(existingRaw)
          .map(mapRow)
          .find((item) => (item.color || null) === (input.color || null) && (item.size || null) === (input.size || null))

        if (!existing) {
          await strapiFetch('/api/wishlist-items', {
            method: 'POST',
            body: JSON.stringify({
              data: {
                productHandle: input.productHandle,
                name: input.name,
                price: input.price,
                imageSrc: input.imageSrc,
                imageAlt: input.imageAlt,
                color: input.color ?? null,
                size: input.size ?? null,
              },
            }),
          })
          await refresh()
        }
        toast('Added to wishlist.', { variant: 'success' })
        return { ok: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to add to wishlist.'
        toast(message, { variant: 'error' })
        return { ok: false, error: message }
      }
    },
    [status, items, refresh, toast, persistWishlist]
  )

  const removeByHandle = useCallback(
    async (productHandle: string, color?: string | null, size?: string | null) => {
      const matchingLocalItems = items.filter(
        (item) =>
          item.productHandle === productHandle &&
          (item.color || null) === (color || null) &&
          (item.size || null) === (size || null)
      )

      if (status !== 'authenticated' || !getStoredToken()) {
        const nextItems = items.filter((item) => !matchingLocalItems.some((match) => match.id === item.id))
        setItems(nextItems)
        persistWishlist(nextItems)
        toast('Removed from wishlist.', { variant: 'success' })
        return { ok: true }
      }

      try {
        const nextItems = items.filter((item) => !matchingLocalItems.some((match) => match.id === item.id))
        setItems(nextItems)
        persistWishlist(nextItems)

        if (matchingLocalItems.length > 0) {
          await Promise.all(
            matchingLocalItems.map((item) => {
              const idOrDocumentId = item.documentId || String(item.id)
              return strapiFetch(`/api/wishlist-items/${idOrDocumentId}`, { method: 'DELETE' })
            })
          )
        } else {
          const filters = new URLSearchParams({
            'filters[productHandle][$eq]': productHandle,
            'pagination[pageSize]': '50',
          })
          const existingRaw = await strapiFetch(`/api/wishlist-items?${filters.toString()}`)
          const existingMatches = extractRows(existingRaw)
            .map(mapRow)
            .filter((item) => (item.color || null) === (color || null) && (item.size || null) === (size || null))

          if (existingMatches.length > 0) {
            await Promise.all(
              existingMatches.map((item) => {
                const idOrDocumentId = item.documentId || String(item.id)
                return strapiFetch(`/api/wishlist-items/${idOrDocumentId}`, { method: 'DELETE' })
              })
            )
          }
          await refresh()
        }

        toast('Removed from wishlist.', { variant: 'success' })
        return { ok: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to remove item.'
        toast(message, { variant: 'error' })
        return { ok: false, error: message }
      }
    },
    [status, items, refresh, toast, persistWishlist]
  )

  const removeItem = useCallback(
    async (id: number) => {
      const target = items.find((item) => item.id === id)
      if (!target) {
        return { ok: false, error: 'Wishlist item not found.' }
      }
      return removeByHandle(target.productHandle, target.color ?? null, target.size ?? null)
    },
    [items, removeByHandle]
  )

  const value = useMemo<WishlistContextValue>(
    () => ({ items, loading, refresh, addItem, removeItem, removeByHandle }),
    [items, loading, refresh, addItem, removeItem, removeByHandle]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
