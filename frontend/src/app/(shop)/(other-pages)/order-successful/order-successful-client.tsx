'use client'

import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { getStrapiUrl } from '@/lib/strapi'
import { getStoredToken } from '@/lib/strapi-auth'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type OrderItem = {
  productHandle: string
  name: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
  size?: string | null
}

type OrderData = {
  orderNumber: string
  status: string
  email: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  region: string
  postalCode: string
  phone: string
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  items: OrderItem[]
}

function toCurrency(value: number) {
  return `$${Number(value || 0).toFixed(2)}`
}

function normalizeOrder(payload: any): OrderData | null {
  const entry = Array.isArray(payload?.data) ? payload.data[0] : null
  if (!entry) return null

  const raw = entry?.attributes ? entry.attributes : entry
  const items = Array.isArray(raw?.items) ? raw.items : []

  return {
    orderNumber: String(raw?.orderNumber || ''),
    status: String(raw?.orderStatus || raw?.status || 'pending'),
    email: String(raw?.email || ''),
    firstName: String(raw?.firstName || ''),
    lastName: String(raw?.lastName || ''),
    addressLine1: String(raw?.addressLine1 || ''),
    addressLine2: String(raw?.addressLine2 || ''),
    city: String(raw?.city || ''),
    country: String(raw?.country || ''),
    region: String(raw?.region || ''),
    postalCode: String(raw?.postalCode || ''),
    phone: String(raw?.phone || ''),
    paymentMethod: String(raw?.paymentMethod || 'Card'),
    subtotal: Number(raw?.subtotal || 0),
    shipping: Number(raw?.shipping || 0),
    tax: Number(raw?.tax || 0),
    total: Number(raw?.total || 0),
    items: items.map((item: any) => ({
      productHandle: String(item?.productHandle || ''),
      name: String(item?.name || ''),
      price: Number(item?.price || 0),
      quantity: Number(item?.quantity || 1),
      imageSrc: String(item?.imageSrc || '/placeholder.webp'),
      imageAlt: String(item?.imageAlt || 'Product image'),
      size: item?.size || null,
    })),
  }
}

export default function OrderSuccessfulClient() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const sessionId = searchParams.get('session_id') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const token = getStoredToken()
    if (!orderNumber) {
      setError('Order number is missing from the URL.')
      setLoading(false)
      return
    }
    if (!token) {
      setError('Please sign in to view your order details.')
      setLoading(false)
      return
    }

    const run = async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          'filters[orderNumber][$eq]': orderNumber,
          'pagination[pageSize]': '1',
        })

        const response = await fetch(`${getStrapiUrl()}/api/orders?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          const message = payload?.error?.message || payload?.error || payload?.message || 'Unable to load order.'
          throw new Error(message)
        }

        const normalized = normalizeOrder(payload)
        if (!normalized) {
          throw new Error('Order not found.')
        }

        setOrder(normalized)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load order.'
        setError(message)
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [orderNumber])

  const fullName = useMemo(() => {
    if (!order) return ''
    return `${order.firstName} ${order.lastName}`.trim()
  }, [order])

  return (
    <main className="container">
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl">
        <div className="flex w-fit items-center justify-center rounded-full border border-zinc-900 px-6 py-2.5 text-sm font-medium">
          <span className="text-xs uppercase">Thanks for ordering</span>
        </div>
        <Heading bigger className="mt-4">
          Payment <span data-slot="italic">successful!</span>
        </Heading>

        {loading ? <Text className="mt-2.5 text-sm text-zinc-500">Loading your order details...</Text> : null}
        {error ? <Text className="mt-2.5 text-sm text-red-600">{error}</Text> : null}

        {!loading && !error && order ? (
          <>
            <Text className="mt-2.5 text-sm text-zinc-500">
              We appreciate your order. We are currently processing it and will send confirmation updates soon.
            </Text>

            <dl className="mt-16 text-sm">
              <dt className="text-zinc-500 uppercase">Tracking number</dt>
              <dd className="mt-2 font-medium text-zinc-950"># {order.orderNumber}</dd>
            </dl>

            <ul
              role="list"
              className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200 text-sm font-medium text-zinc-500"
            >
              {order.items.map((product, idx) => (
                <li key={`${product.productHandle}-${idx}`} className="flex space-x-6 py-6">
                  <div className="relative aspect-3/4 w-24 flex-none">
                    <Image
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      fill
                      sizes="200px"
                      className="rounded-md bg-zinc-100 object-cover"
                    />
                  </div>
                  <div className="flex flex-auto flex-col space-y-1">
                    <h3 className="text-zinc-900 uppercase">
                      <Link href={'/products/' + product.productHandle} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center space-x-2 text-zinc-500">
                      {product.size ? <Text className="text-xs text-zinc-500">{product.size}</Text> : null}
                    </div>
                    <Text className="mt-auto text-xs text-zinc-500">Qty {product.quantity}</Text>
                  </div>
                  <p className="flex-none font-medium text-zinc-900">{toCurrency(product.price)}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-zinc-200 pt-6 text-sm font-medium text-zinc-500">
              <div className="flex justify-between">
                <dt className="uppercase">Subtotal</dt>
                <dd className="text-zinc-900">{toCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="uppercase">Shipping</dt>
                <dd className="text-zinc-900">{toCurrency(order.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="uppercase">Taxes</dt>
                <dd className="text-zinc-900">{toCurrency(order.tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-6 text-zinc-900">
                <dt className="text-base uppercase">Total</dt>
                <dd className="text-base">{toCurrency(order.total)}</dd>
              </div>
            </dl>

            <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-zinc-600">
              <div>
                <dt className="font-medium text-zinc-900 uppercase">Shipping Address</dt>
                <dd className="mt-2">
                  <address className="uppercase not-italic">
                    <span className="block">{fullName || '-'}</span>
                    <span className="block">{order.addressLine1 || '-'}</span>
                    {order.addressLine2 ? <span className="block">{order.addressLine2}</span> : null}
                    <span className="block">
                      {[order.city, order.region, order.postalCode].filter(Boolean).join(', ')}
                    </span>
                    <span className="block">{order.country || '-'}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-900 uppercase">Payment Information</dt>
                <dd className="mt-2 space-y-1 uppercase">
                  <p className="text-zinc-900">{order.paymentMethod || 'Card'}</p>
                  {sessionId ? <p className="text-zinc-500">Session {sessionId}</p> : null}
                  {order.email ? <p className="text-zinc-500">{order.email}</p> : null}
                </dd>
              </div>
            </dl>
          </>
        ) : null}

        <div className="mt-16 border-t border-zinc-200 py-6 text-right">
          <Link href="/collections/all" className="text-sm font-medium text-zinc-950 uppercase">
            Continue Shopping
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
      <Divider />
    </main>
  )
}
