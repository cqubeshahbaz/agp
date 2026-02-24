'use client'

import AuthGate from '@/components/auth-gate'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Text } from '@/components/text'
import { useWishlist } from '@/components/wishlist-context'
import Image from 'next/image'
import { useState } from 'react'

export default function WishlistPage() {
  const { items, loading, removeItem } = useWishlist()
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set())

  const getItemKey = (productHandle: string, size?: string | null) => `${productHandle}::${size ?? 'none'}`

  return (
    <AuthGate>
      <div className="container">
        <div className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="max-w-xl">
            <Heading level={1} id="your-wishlist-heading" bigger>
              Your <span data-slot="italic">Wishlist</span>
            </Heading>
            <Text className="mt-2 text-zinc-500">Save items you love and come back anytime.</Text>
          </div>

          {loading ? (
            <div className="mt-10">
              <Text className="text-zinc-500">Loading your wishlist...</Text>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-10">
              <Text className="text-zinc-500">Your wishlist is empty.</Text>
              <div className="mt-6">
                <Button href="/collections/all">Continue shopping</Button>
              </div>
            </div>
          ) : (
            <div className="mt-12 space-y-6 sm:mt-16">
              {items.map((item) => {
                const itemKey = getItemKey(item.productHandle, item.size ?? null)
                const isRemoving = removingKeys.has(itemKey)

                return (
                  <div
                    key={`${item.id}-${item.productHandle}-${item.size ?? 'none'}`}
                    className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0">
                        <Image
                          alt={item.imageAlt}
                          src={item.imageSrc || '/placeholder.webp'}
                          fill
                          className="rounded-md object-cover"
                          sizes="5rem"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/products/${item.productHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium uppercase"
                        >
                          {item.name}
                        </Link>
                        {item.size ? <Text className="mt-1 text-xs text-zinc-500">{item.size}</Text> : null}
                        <Text className="mt-auto text-sm font-medium text-zinc-900">${item.price.toFixed(2)}</Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        outline
                        type="button"
                        disabled={isRemoving}
                        onClick={async () => {
                          if (isRemoving) return

                          setRemovingKeys((prev) => {
                            const next = new Set(prev)
                            next.add(itemKey)
                            return next
                          })

                          try {
                            await removeItem(item.id)
                          } finally {
                            setRemovingKeys((prev) => {
                              const next = new Set(prev)
                              next.delete(itemKey)
                              return next
                            })
                          }
                        }}
                      >
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </Button>
                      <Button href={`/products/${item.productHandle}`} target="_blank" rel="noopener noreferrer">
                        View
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  )
}

