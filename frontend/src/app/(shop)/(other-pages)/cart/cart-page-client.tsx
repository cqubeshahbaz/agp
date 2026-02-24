'use client'

import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import InputNumber from '@/components/input-number'
import { Link } from '@/components/link'
import { Text } from '@/components/text'
import { useCart } from '@/components/cart-context'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { HelpCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useState } from 'react'

const formatPrice = (value: number) => `$${value.toFixed(2)}`

export default function CartPageClient() {
  const { items, subtotal, loading, updateItemQuantity, removeItem } = useCart()
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set())
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set())

  const handleRemove = async (id: number) => {
    if (removingIds.has(id)) return
    setRemovingIds((prev) => new Set(prev).add(id))
    try {
      await removeItem(id)
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (updatingIds.has(id) || removingIds.has(id)) return
    setUpdatingIds((prev) => new Set(prev).add(id))
    try {
      await updateItemQuantity(id, quantity)
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <div className="container">
      <div className="mx-auto max-w-7xl pt-16">
        <Heading level={1}>
          Shopping {` `}
          <span data-slot="italic">Cart</span>
        </Heading>

        {loading ? (
          <Text className="mt-8 text-zinc-500">Loading your cart...</Text>
        ) : items.length === 0 ? (
          <div className="mt-8">
            <Text className="text-zinc-500">Your cart is empty.</Text>
            <div className="mt-6">
              <Button href="/collections/all">Start shopping</Button>
            </div>
          </div>
        ) : (
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-14">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul role="list" className="divide-y divide-zinc-900/10 border-t border-b border-zinc-900/10">
                {items.map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="shrink-0">
                      <div className="relative aspect-3/4 w-24 sm:w-40">
                        <Image
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          sizes="(min-width: 640px) 220px, 140px"
                          className="rounded-lg object-cover"
                          fill
                        />
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={'/products/' + product.productHandle}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium uppercase"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1.5 flex gap-2 text-sm">
                            {product.size ? <Text className="text-zinc-500">{product.size}</Text> : null}
                          </div>

                          <Text className="mt-1.5">{formatPrice(product.price)}</Text>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="grid w-full grid-cols-1">
                            <InputNumber
                              defaultValue={product.quantity}
                              className=""
                              disabled={removingIds.has(product.id) || updatingIds.has(product.id)}
                              onChange={(value) => handleQuantityChange(product.id, value)}
                            />
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              onClick={() => handleRemove(product.id)}
                              disabled={removingIds.has(product.id)}
                              className="data-disabled:cursor-not-allowed data-disabled:opacity-60 -m-2 inline-flex p-2 text-zinc-400 hover:text-zinc-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon aria-hidden="true" className="size-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2 text-zinc-700">
                        <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                        <Text className="text-xs">In stock</Text>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg border border-zinc-900/10 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                <span data-slot="italic">Order</span> summary
              </Heading>

              <dl className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-zinc-600 uppercase">Subtotal</dt>
                  <dd className="text-sm font-medium text-zinc-900">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-sm text-zinc-600">
                    <Text>Shipping estimate</Text>
                    <span className="ml-2 shrink-0 text-zinc-400">
                      <span className="sr-only">Shipping estimate</span>
                      <HugeiconsIcon icon={HelpCircleIcon} size={16} color="currentColor" strokeWidth={1.5} />
                    </span>
                  </dt>
                  <dd className="text-sm font-medium text-zinc-900">$5.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center text-sm text-zinc-600">
                    <Text>Tax estimate</Text>
                    <span className="ml-2 shrink-0 text-zinc-400">
                      <span className="sr-only">Tax estimate</span>
                      <HugeiconsIcon icon={HelpCircleIcon} size={16} color="currentColor" strokeWidth={1.5} />
                    </span>
                  </dt>
                  <dd className="text-sm font-medium text-zinc-900 uppercase">$8.32</dd>
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-zinc-900 uppercase">Order total</dt>
                  <dd className="text-base font-medium text-zinc-900 uppercase">{formatPrice(subtotal + 13.32)}</dd>
                </div>
              </dl>

              <div className="mt-10">
                <Button type="submit" className="w-full font-medium" href={'/checkout'}>
                  Checkout
                </Button>
                <div className="mt-4 flex justify-center text-center text-sm text-zinc-500">
                  <span className="text-xs">
                    or{' '}
                    <span className="text-xs font-medium text-zinc-900 uppercase">
                      <Link href="/collections/all">Continue Shopping</Link>
                      <span aria-hidden="true"> â†’</span>
                    </span>
                  </span>
                </div>
              </div>
            </section>
          </form>
        )}
      </div>
    </div>
  )
}

