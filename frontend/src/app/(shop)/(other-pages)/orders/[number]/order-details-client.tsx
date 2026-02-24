'use client'

import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { getStrapiUrl } from '@/lib/strapi'
import { getStoredToken } from '@/lib/strapi-auth'
import Image from 'next/image'
import Link from 'next/link'
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
  number: string
  status: string
  createdAt: string
  email: string
  phone: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  postalCode: string
  country: string
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  products: OrderItem[]
}

function toCurrency(value: number) {
  return `$${Number(value || 0).toFixed(2)}`
}

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function getStatusMessage(status: string) {
  const normalized = status.toLowerCase()
  if (normalized === 'cancelled') return 'This order has been cancelled.'
  if (normalized === 'delivered') return 'This order has been delivered.'
  if (normalized === 'shipped') return 'This order has been shipped and is on the way.'
  if (normalized === 'processing') return 'This order is being processed.'
  return 'This order is pending.'
}

function normalizeOrder(payload: any): OrderData | null {
  const entry = Array.isArray(payload?.data) ? payload.data[0] : null
  if (!entry) return null
  const row = entry?.attributes ? entry.attributes : entry
  const items = Array.isArray(row?.items) ? row.items : []

  return {
    number: String(row?.orderNumber || ''),
    status: String(row?.orderStatus || row?.status || 'pending'),
    createdAt: String(row?.createdAt || ''),
    email: String(row?.email || ''),
    phone: String(row?.phone || ''),
    firstName: String(row?.firstName || ''),
    lastName: String(row?.lastName || ''),
    addressLine1: String(row?.addressLine1 || ''),
    addressLine2: String(row?.addressLine2 || ''),
    city: String(row?.city || ''),
    region: String(row?.region || ''),
    postalCode: String(row?.postalCode || ''),
    country: String(row?.country || ''),
    paymentMethod: String(row?.paymentMethod || 'Card'),
    subtotal: Number(row?.subtotal || 0),
    shipping: Number(row?.shipping || 0),
    tax: Number(row?.tax || 0),
    total: Number(row?.total || 0),
    products: items.map((item: any) => ({
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

export default function OrderDetailsClient({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setError('Please sign in to view this order.')
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
        if (!normalized) throw new Error('Order not found.')

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

  const orderDate = useMemo(() => {
    if (!order?.createdAt) return 'Order date unavailable'
    const dt = new Date(order.createdAt)
    if (Number.isNaN(dt.getTime())) return 'Order date unavailable'
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }, [order?.createdAt])

  const orderDateTime = useMemo(() => {
    if (!order?.createdAt) return undefined
    const dt = new Date(order.createdAt)
    if (Number.isNaN(dt.getTime())) return undefined
    return dt.toISOString()
  }, [order?.createdAt])

  const statusText = toTitleCase(order?.status || 'pending')
  const statusMessage = getStatusMessage(order?.status || 'pending')
  const fullName = `${order?.firstName || ''} ${order?.lastName || ''}`.trim()

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-7xl">
        <Text className="text-zinc-500">Loading your order...</Text>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-7xl">
        <Text className="text-red-600">{error || 'Order not found.'}</Text>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-7xl">
      <div className="space-y-4 sm:flex sm:items-end sm:justify-between sm:space-y-0 sm:px-0">
        <div>
          <Text className="mb-1">
            <time dateTime={orderDateTime}>{orderDate}</time>
          </Text>
          <Heading level={1} className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            <span data-slot="italic">Order</span> #{order.number}
          </Heading>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="sr-only">Products purchased</h2>
        <div className="space-y-10">
          {order.products.map((product, index) => (
            <div
              key={`${product.productHandle || product.name}-${index}`}
              className="border-t border-b border-zinc-200 bg-white sm:rounded-lg sm:border"
            >
              <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                <div className="sm:flex lg:col-span-7">
                  <div className="relative aspect-square w-full shrink-0 rounded-lg object-cover sm:size-40">
                    <Image
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(min-width: 640px) 10rem, 100vw"
                    />
                  </div>

                  <div className="mt-6 flex flex-col sm:mt-0 sm:ml-6">
                    <h3 className="text-base font-medium text-zinc-900 uppercase">
                      <Link href={`/products/${product.productHandle}`} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </Link>
                    </h3>
                    <Text className="mt-2 text-sm text-zinc-500">Qty {product.quantity}</Text>
                    {product.size ? <Text className="mt-1 text-xs text-zinc-500">{product.size}</Text> : null}
                    <Text className="mt-auto text-sm font-medium text-zinc-900">{toCurrency(product.price)}</Text>
                  </div>
                </div>

                <div className="mt-6 lg:col-span-5 lg:mt-0">
                  <dl className="grid grid-cols-2 gap-x-6 text-sm">
                    <div>
                      <dt className="font-medium text-zinc-900 uppercase">Delivery address</dt>
                      <dd className="mt-3 text-zinc-500 uppercase">
                        <span className="block">{fullName || '-'}</span>
                        <span className="block">{order.addressLine1 || '-'}</span>
                        {order.addressLine2 ? <span className="block">{order.addressLine2}</span> : null}
                        <span className="block">
                          {[order.city, order.region, order.postalCode].filter(Boolean).join(', ')}
                        </span>
                        <span className="block">{order.country || '-'}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-zinc-900 uppercase">Shipping updates</dt>
                      <dd className="mt-3 space-y-3 text-zinc-500 uppercase">
                        <p>{order.email || '-'}</p>
                        <p>{order.phone || '-'}</p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-zinc-200 px-4 py-6 sm:px-6 lg:p-8">
                <h4 className="sr-only">Status</h4>
                <Text className="text-sm font-medium uppercase text-zinc-900">{statusText}</Text>
                <Text className="mt-2 text-sm text-zinc-500">{statusMessage}</Text>
                <Text className="mt-1 text-xs text-zinc-500">
                  Updated on <time dateTime={orderDateTime}>{orderDate}</time>
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="sr-only">Billing Summary</h2>

        <div className="bg-zinc-50 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
          <dl className="grid grid-cols-2 gap-6 text-sm uppercase sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <div>
              <dt className="font-medium text-zinc-900">Billing address</dt>
              <dd className="mt-3 text-zinc-500">
                <span className="block">{fullName || '-'}</span>
                <span className="block">{order.addressLine1 || '-'}</span>
                {order.addressLine2 ? <span className="block">{order.addressLine2}</span> : null}
                <span className="block">{[order.city, order.region, order.postalCode].filter(Boolean).join(', ')}</span>
                <span className="block">{order.country || '-'}</span>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-900">Payment information</dt>
              <dd className="mt-3 text-zinc-500">
                <p className="text-zinc-900">{order.paymentMethod || 'Card'}</p>
              </dd>
            </div>
          </dl>

          <dl className="mt-8 space-y-5 text-sm uppercase lg:col-span-5 lg:mt-0">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-600">Subtotal</dt>
              <dd className="font-medium text-zinc-900">{toCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-600">Shipping</dt>
              <dd className="font-medium text-zinc-900">{toCurrency(order.shipping)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-600">Tax</dt>
              <dd className="font-medium text-zinc-900">{toCurrency(order.tax)}</dd>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <dt className="font-medium text-zinc-900">Order total</dt>
              <dd className="font-medium text-zinc-950">{toCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
