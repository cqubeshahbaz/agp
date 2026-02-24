'use client'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { Text, TextLink } from '@/components/text'
import { getStrapiUrl } from '@/lib/strapi'
import { getStoredToken } from '@/lib/strapi-auth'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type OrderItem = {
  productHandle: string
  name: string
  price: number
  quantity: number
  imageSrc: string
  imageAlt: string
  size?: string | null
}

type OrderSummary = {
  number: string
  status: string
  products: Array<
    OrderItem & {
      id: string
      handle: string
    }
  >
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

function normalizeOrders(payload: any): OrderSummary[] {
  const rows = Array.isArray(payload?.data) ? payload.data : []
  return rows
    .map((entry: any) => (entry?.attributes ? { ...entry.attributes, documentId: entry.documentId } : entry))
    .map((row: any) => {
      const items = Array.isArray(row?.items) ? row.items : []
      const products = items.map((item: any, index: number) => ({
        id: `${row?.orderNumber || 'order'}-${index}`,
        handle: String(item?.productHandle || ''),
        productHandle: String(item?.productHandle || ''),
        name: String(item?.name || ''),
        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
        imageSrc: String(item?.imageSrc || '/placeholder.webp'),
        imageAlt: String(item?.imageAlt || 'Product image'),
        size: item?.size || null,
      }))

      return {
        number: String(row?.orderNumber || ''),
        status: toTitleCase(String(row?.orderStatus || row?.status || 'pending')),
        products,
      }
    })
    .filter((order: OrderSummary) => Boolean(order.number))
}

export default function OrdersClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<OrderSummary[]>([])

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setError('Please sign in to view your orders.')
      setLoading(false)
      return
    }

    const run = async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          sort: 'createdAt:desc',
          'pagination[pageSize]': '50',
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
          const message = payload?.error?.message || payload?.error || payload?.message || 'Unable to load orders.'
          throw new Error(message)
        }

        setOrders(normalizeOrders(payload))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load orders.'
        setError(message)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [])

  if (loading) {
    return (
      <div className="mt-12">
        <Text className="text-zinc-500">Loading your orders...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-12">
        <Text className="text-red-600">{error}</Text>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="mt-12">
        <Text className="text-zinc-500">No orders found yet.</Text>
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-20 sm:mt-16">
      {orders.map((order) => (
        <section key={order.number} aria-labelledby={`${order.number}-heading`}>
          <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
            <h2 id={`${order.number}-heading`} className="text-lg font-medium text-zinc-900 md:shrink-0">
              Order #{order.number}
            </h2>
            <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
              <Text className="text-xs text-zinc-500">{order.status}</Text>
              <div className="flex items-center text-sm font-medium">
                <TextLink href={'/orders/' + order.number} className="text-zinc-950 underline">
                  Order details
                  <span aria-hidden="true" className="font-light">
                    {' '}
                    &rarr;
                  </span>
                </TextLink>
              </div>
            </div>
          </div>

          <div className="mt-6 -mb-6 flow-root divide-y divide-zinc-200 border-t border-zinc-200">
            {order.products.map((product) => (
              <div key={product.id} className="py-6 sm:flex">
                <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                  <div className="relative aspect-3/4 w-20 flex-none sm:w-40">
                    <Image
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      fill
                      className="rounded-md object-cover"
                      sizes="(min-width: 640px) 10rem, 100vw"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5 sm:pt-0">
                    <h3 className="text-sm font-medium text-zinc-900 uppercase">
                      <Link href={'/products/' + product.handle} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </Link>
                    </h3>
                    {product.size ? <Text className="truncate text-xs text-zinc-500">{product.size}</Text> : null}
                    <Text className="text-xs text-zinc-500">Qty {product.quantity}</Text>
                    <Text className="mt-auto font-medium text-zinc-900">{toCurrency(product.price)}</Text>
                  </div>
                </div>
                <div className="mt-6 max-w-48 space-y-2 sm:mt-0 sm:ml-6 sm:w-40 sm:flex-none">
                  <Button type="button" className="w-full" outline>
                    Shop similar
                  </Button>
                  <Button className="w-full" type="button">
                    Buy again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
