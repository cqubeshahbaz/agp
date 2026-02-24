'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './auth-context'
import { useToast } from './toast'
import { getStoredToken } from '@/lib/strapi-auth'
import { getStrapiUrl } from '@/lib/strapi'

export type CartItem = {
  id: number
  documentId?: string
  productHandle: string
  name: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
  color?: string | null
  size?: string | null
}

type CartState = {
  items: CartItem[]
  subtotal: number
  loading: boolean
}

type AddToCartInput = {
  productHandle: string
  name: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
  color?: string | null
  size?: string | null
}

type CartContextValue = CartState & {
  refresh: () => Promise<void>
  addItem: (input: AddToCartInput) => Promise<{ ok: boolean; error?: string }>
  updateItemQuantity: (id: number, quantity: number) => Promise<{ ok: boolean; error?: string }>
  removeItem: (id: number) => Promise<{ ok: boolean; error?: string }>
  clearItems: () => Promise<{ ok: boolean; error?: string }>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const CART_STORAGE_KEY = 'agp_cart'

type StrapiRow = {
  id: number
  documentId?: string
  productHandle?: string
  product_handle?: string
  name?: string
  price?: number | string
  quantity?: number
  imageSrc?: string
  image_src?: string
  imageAlt?: string
  image_alt?: string
  color?: string | null
  size?: string | null
}

function mapRow(row: StrapiRow): CartItem {
  return {
    id: row.id,
    documentId: row.documentId,
    productHandle: row.productHandle || row.product_handle || '',
    name: row.name || '',
    price: Number(row.price ?? 0),
    quantity: Number(row.quantity ?? 1),
    imageSrc: row.imageSrc || row.image_src || '',
    imageAlt: row.imageAlt || row.image_alt || 'Product image',
    color: row.color ?? null,
    size: row.size ?? null,
  }
}

type StrapiListEntry = StrapiRow & { attributes?: StrapiRow; id?: number; documentId?: string }
type StrapiListPayload = { data?: StrapiListEntry[] } | StrapiRow[] | null | undefined

function extractRows(payload: StrapiListPayload): StrapiRow[] {
  if (!payload) return []
  if (!Array.isArray(payload) && Array.isArray(payload.data)) {
    return payload.data.map((entry: StrapiListEntry) => {
      const attrs = entry.attributes ? entry.attributes : entry
      return { ...attrs, id: entry.id ?? attrs.id, documentId: entry.documentId ?? attrs.documentId }
    })
  }
  if (Array.isArray(payload)) return payload
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const persistCart = useCallback((nextItems: CartItem[], nextSubtotal: number) => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: nextItems, subtotal: nextSubtotal }))
  }, [])

  const refresh = useCallback(async () => {
    if (status !== 'authenticated' || !getStoredToken()) {
      setLoading(false)
      return
    }

    setLoading((current) => (items.length > 0 ? false : current))
    try {
      const data = await strapiFetch('/api/cart-items?sort=id:desc')
      const parsed = extractRows(data).map(mapRow)
      const nextSubtotal = parsed.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setItems(parsed)
      setSubtotal(nextSubtotal)
      persistCart(parsed, nextSubtotal)
    } catch {
      setItems([])
      setSubtotal(0)
    } finally {
      setLoading(false)
    }
  }, [status, items.length, persistCart])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem(CART_STORAGE_KEY)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { items: CartItem[]; subtotal: number }
          setItems(parsed.items ?? [])
          setSubtotal(parsed.subtotal ?? 0)
          setLoading(false)
        } catch {
          window.sessionStorage.removeItem(CART_STORAGE_KEY)
        }
      }
    }
    refresh()
  }, [refresh])

  const addItem = useCallback(
    async (input: AddToCartInput) => {
      if (status !== 'authenticated' || !getStoredToken()) {
        const existing = items.find(
          (item) =>
            item.productHandle === input.productHandle &&
            (item.color || null) === (input.color || null) &&
            (item.size || null) === (input.size || null)
        )

        let nextItems: CartItem[]
        if (existing) {
          nextItems = items.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + input.quantity } : item
          )
        } else {
          nextItems = [
            {
              id: Date.now(),
              productHandle: input.productHandle,
              name: input.name,
              price: input.price,
              quantity: input.quantity,
              imageSrc: input.imageSrc,
              imageAlt: input.imageAlt,
              color: input.color ?? null,
              size: input.size ?? null,
            },
            ...items,
          ]
        }

        const nextSubtotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setItems(nextItems)
        setSubtotal(nextSubtotal)
        persistCart(nextItems, nextSubtotal)
        toast('Added to cart.', { variant: 'success' })
        return { ok: true }
      }

      try {
        const filters = new URLSearchParams({
          'filters[productHandle][$eq]': input.productHandle,
          'pagination[pageSize]': '50',
        })
        const existingRaw = await strapiFetch(`/api/cart-items?${filters.toString()}`)
        const existing = extractRows(existingRaw)
          .map(mapRow)
          .find((item) => (item.color || null) === (input.color || null) && (item.size || null) === (input.size || null))

        if (existing) {
          const idOrDocumentId = existing.documentId || String(existing.id)
          await strapiFetch(`/api/cart-items/${idOrDocumentId}`, {
            method: 'PUT',
            body: JSON.stringify({
              data: { quantity: existing.quantity + input.quantity },
            }),
          })
        } else {
          await strapiFetch('/api/cart-items', {
            method: 'POST',
            body: JSON.stringify({
              data: {
                productHandle: input.productHandle,
                name: input.name,
                price: input.price,
                quantity: input.quantity,
                imageSrc: input.imageSrc,
                imageAlt: input.imageAlt,
                color: input.color ?? null,
                size: input.size ?? null,
              },
            }),
          })
        }

        await refresh()
        toast('Added to cart.', { variant: 'success' })
        return { ok: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to add to cart.'
        toast(message, { variant: 'error' })
        return { ok: false, error: message }
      }
    },
    [status, items, refresh, toast, persistCart]
  )

  const updateItemQuantity = useCallback(
    async (id: number, quantity: number) => {
      if (status !== 'authenticated' || !getStoredToken()) {
        const nextItems = items.map((item) => (item.id === id ? { ...item, quantity } : item))
        const nextSubtotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setItems(nextItems)
        setSubtotal(nextSubtotal)
        persistCart(nextItems, nextSubtotal)
        toast('Cart updated.', { variant: 'success' })
        return { ok: true }
      }

      try {
        const target = items.find((item) => item.id === id)
        if (!target) {
          return { ok: false, error: 'Cart item not found.' }
        }
        const idOrDocumentId = target.documentId || String(target.id)
        await strapiFetch(`/api/cart-items/${idOrDocumentId}`, {
          method: 'PUT',
          body: JSON.stringify({ data: { quantity } }),
        })
        await refresh()
        toast('Cart updated.', { variant: 'success' })
        return { ok: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to update cart.'
        toast(message, { variant: 'error' })
        return { ok: false, error: message }
      }
    },
    [status, items, refresh, toast, persistCart]
  )

  const removeItem = useCallback(
    async (id: number) => {
      if (status !== 'authenticated' || !getStoredToken()) {
        const nextItems = items.filter((item) => item.id !== id)
        const nextSubtotal = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setItems(nextItems)
        setSubtotal(nextSubtotal)
        persistCart(nextItems, nextSubtotal)
        toast('Removed from cart.', { variant: 'success' })
        return { ok: true }
      }

      try {
        const target = items.find((item) => item.id === id)
        if (!target) {
          return { ok: false, error: 'Cart item not found.' }
        }
        const idOrDocumentId = target.documentId || String(target.id)
        await strapiFetch(`/api/cart-items/${idOrDocumentId}`, { method: 'DELETE' })
        await refresh()
        toast('Removed from cart.', { variant: 'success' })
        return { ok: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to remove item.'
        toast(message, { variant: 'error' })
        return { ok: false, error: message }
      }
    },
    [status, items, refresh, toast, persistCart]
  )

  const clearItems = useCallback(async () => {
    if (!items.length) return { ok: true }

    if (status !== 'authenticated' || !getStoredToken()) {
      setItems([])
      setSubtotal(0)
      persistCart([], 0)
      return { ok: true }
    }

    try {
      await Promise.all(
        items.map((item) => {
          const idOrDocumentId = item.documentId || String(item.id)
          return strapiFetch(`/api/cart-items/${idOrDocumentId}`, { method: 'DELETE' })
        })
      )
      setItems([])
      setSubtotal(0)
      persistCart([], 0)
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to clear cart.'
      toast(message, { variant: 'error' })
      return { ok: false, error: message }
    }
  }, [status, items, toast, persistCart])

  const value = useMemo<CartContextValue>(
    () => ({ items, subtotal, loading, refresh, addItem, updateItemQuantity, removeItem, clearItems }),
    [items, subtotal, loading, refresh, addItem, updateItemQuantity, removeItem, clearItems]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
