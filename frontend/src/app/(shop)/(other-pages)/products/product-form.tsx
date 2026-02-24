'use client'

import { useAside } from '@/components/aside'
import Breadcrumb from '@/components/breadcrumb'
import ButtonLargeWithIcon from '@/components/button-large-with-icon'
import { Heading } from '@/components/heading'
import InputNumber from '@/components/input-number'
import { Text } from '@/components/text'
import { useSingleClick } from '@/hooks/use-single-click'
import { TProductItem } from '@/data'
import { FavouriteIcon, ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'
import { useCart } from '@/components/cart-context'
import { useWishlist } from '@/components/wishlist-context'

export function ProductForm({ product }: { product: TProductItem }) {
  const { open: openAside } = useAside()
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addWishlistItem, removeByHandle } = useWishlist()
  const { options, selected_options, collections, title, price } = product

  const collection = collections[0]

  const [quantity, setQuantity] = useState(1)
  const [stateSelectedOption, setStateSelectedOption] = useState<{ name: string; value: string }[]>(
    selected_options.filter((opt) => opt.name !== 'Color')
  )
  const selectedSize = stateSelectedOption.find((opt) => opt.name === 'Size')?.value ?? null
  const { pending: addingToCart, runAsync: runCartAction } = useSingleClick()
  const { pending: wishlistProcessing, runAsync: runWishlistAction } = useSingleClick()
  const isWishlisted = wishlistItems.some((item) => item.productHandle === product.handle && item.size === selectedSize)

  const breadcrumbs = [
    { id: 1, name: 'Home', href: '/' },
    {
      id: 2,
      name: collection.title,
      href: '/collections/all',
    },
  ]

  return (
    <div>
      <div>
        <Breadcrumb breadcrumbs={breadcrumbs} currentPage={title} />

        <Heading level={1} className="mt-4" title={title} bigger>
          <span className="lowercase" data-slot="dim">
            {title}
          </span>
        </Heading>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="rounded-full bg-zinc-900 px-5 py-2">
            <Text className="text-xs text-white">{product.vendor}</Text>
          </div>
          <Text className="text-xl">${price.toFixed(2)}</Text>
        </div>
      </div>

      <form className="mt-10 block">
        <div className="flex flex-col gap-7">
          {options
            ?.filter(({ name }) => name !== 'Color')
            .map(({ name: optionName, optionValues }) => {
              return (
                <div key={optionName}>
                  <Text>{optionName}</Text>

                  <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {optionValues.map(({ name }, index) => {
                      const selected = stateSelectedOption.some((opt) => opt.name === optionName && opt.value === name)
                      const inStock = index !== 2

                      return (
                        <div
                          key={optionName + name}
                          className={clsx(
                            'block shrink-0',
                            inStock ? 'cursor-pointer' : 'cursor-not-allowed',
                            selected && ''
                          )}
                          aria-disabled={!inStock}
                          onClick={() => {
                            if (inStock) {
                              setStateSelectedOption((prev) => {
                                const newOptions = [...prev]
                                const optionIndex = newOptions.findIndex((opt) => opt.name === optionName)
                                if (optionIndex !== -1) {
                                  newOptions[optionIndex] = { name: optionName, value: name }
                                } else {
                                  newOptions.push({ name: optionName, value: name })
                                }
                                return newOptions
                              })
                            }
                          }}
                        >
                          <div
                            className={clsx(
                              inStock ? 'cursor-pointer focus:outline-hidden' : 'cursor-not-allowed opacity-25',
                              'flex items-center justify-center rounded-md bg-white px-3 py-3 hover:bg-zinc-50 data-focus:ring-offset-2 sm:flex-1',
                              selected ? 'ring-2 ring-zinc-900' : 'ring-1 ring-zinc-200'
                            )}
                            title={inStock ? name : 'Out of stock'}
                            aria-disabled={!inStock}
                            aria-label={name}
                          >
                            <Text className="font-medium">{name}</Text>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>

        <div className="mt-14 flex flex-col gap-5">
          <InputNumber className="gap-x-5" label="Qty" defaultValue={quantity} onChange={setQuantity} />
          <ButtonLargeWithIcon
            icon={<HugeiconsIcon icon={ShoppingBag03Icon} size={20} color="currentColor" strokeWidth={1.5} />}
            disabled={addingToCart}
            onClick={() =>
              runCartAction(async () => {
                const imageSrc = product.featured_image?.src ?? product.images?.[0]?.src ?? ''
                const imageAlt = product.featured_image?.alt ?? product.images?.[0]?.alt ?? product.title

                const result = await addItem({
                  productHandle: product.handle,
                  name: product.title,
                  price: Number(product.price),
                  quantity,
                  imageSrc,
                  imageAlt,
                  size: selectedSize,
                })

                if (result.ok) {
                  openAside('cart')
                }
              })
            }
          >
            {addingToCart ? 'Processing...' : 'Add to cart'}
          </ButtonLargeWithIcon>
          <button
            type="button"
            disabled={wishlistProcessing}
            onClick={() =>
              runWishlistAction(async () => {
                const imageSrc = product.featured_image?.src ?? product.images?.[0]?.src ?? ''
                const imageAlt = product.featured_image?.alt ?? product.images?.[0]?.alt ?? product.title

                if (isWishlisted) {
                  await removeByHandle(product.handle, null, selectedSize)
                  return
                }

                await addWishlistItem({
                  productHandle: product.handle,
                  name: product.title,
                  price: Number(product.price),
                  imageSrc,
                  imageAlt,
                  size: selectedSize,
                })
              })
            }
            className={clsx(
              'flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm uppercase',
              wishlistProcessing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
              isWishlisted ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-900/20 text-zinc-900'
            )}
          >
            <HugeiconsIcon icon={FavouriteIcon} size={18} color="currentColor" strokeWidth={1.5} />
            {wishlistProcessing ? 'Processing...' : isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
          </button>
        </div>
      </form>
    </div>
  )
}

