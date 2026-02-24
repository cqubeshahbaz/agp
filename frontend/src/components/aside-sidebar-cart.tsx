'use client'

import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Aside } from './aside/aside'
import { Button } from './button'
import { useCart } from './cart-context'
import { Text, TextLink } from './text'
import InputNumber from './input-number'
import { useAuth } from './auth-context'

interface Props {
  className?: string
}

const formatPrice = (value: number) => `$${value.toFixed(2)}`

const AsideSidebarCart = ({ className = '' }: Props) => {
  const { status } = useAuth()
  const { items, subtotal, loading, updateItemQuantity, removeItem } = useCart()

  return (
    <Aside openFrom="right" type="cart" heading="Shopping Cart">
      <div className={clsx('flex h-full flex-col', className)}>
        {/* CONTENT */}

        <div className="flex-1 overflow-x-hidden overflow-y-auto py-6 hidden-scrollbar">
          <div className="flow-root">
            {status !== 'authenticated' ? (
              <Text className="text-zinc-500">Sign in to use your cart.</Text>
            ) : loading ? (
              <Text className="text-zinc-500">Loading your cart...</Text>
            ) : items.length === 0 ? (
              <Text className="text-zinc-500">Your cart is empty.</Text>
            ) : (
              <ul role="list" className="-my-6 divide-y divide-zinc-900/10">
                {items.map((product) => (
                  <CartProductItem
                    key={product.id}
                    product={product}
                    onRemove={() => removeItem(product.id)}
                    onQuantityChange={(value) => updateItemQuantity(product.id, value)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* FOOTER  */}
        <section
          aria-labelledby="summary-heading"
          className="mt-auto grid shrink-0 gap-4 border-t border-zinc-900/10 py-6"
        >
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>
          <div className="">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <Text className="font-medium">Subtotal</Text>
              <Text className="font-medium">{formatPrice(subtotal)}</Text>
            </div>
            <Text className="mt-0.5 text-xs text-zinc-500">Shipping and taxes calculated at checkout.</Text>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button outline href={'/cart'}>
                View cart
              </Button>
              <Button href={'/checkout'}>Check out</Button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-zinc-500">
              <Text className="text-xs">
                or{' '}
                <TextLink href={'/collections/all'} className="text-xs font-medium text-zinc-900 uppercase">
                  Continue Shopping<span aria-hidden="true"> →</span>
                </TextLink>
              </Text>
            </div>
          </div>
        </section>
      </div>
    </Aside>
  )
}

export const CartProductItem = ({
  product,
  className,
  onRemove,
  onQuantityChange,
}: {
  className?: string
  product: {
    id: number
    productHandle: string
    name: string
    price: number
    quantity: number
    imageSrc: string
    imageAlt: string
    color?: string | null
    size?: string | null
  }
  onRemove?: () => void
  onQuantityChange?: (value: number) => void
}) => {
  return (
    <li key={product.id} className={clsx(className, 'flex py-6')}>
      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md">
        <Image
          fill
          alt={product.imageAlt}
          src={product.imageSrc}
          className="size-full object-cover"
          sizes="(min-width: 640px) 10rem, 100vw"
        />
      </div>

      <div className="ms-4 flex flex-1 flex-col">
        <div className="flex justify-between font-medium">
          <h3 className="leading-tight">
            <TextLink href={'/products/' + product.productHandle} target="_blank" rel="noopener noreferrer">
              {product.name}
            </TextLink>
          </h3>
          <Text className="ms-4">{formatPrice(product.price)}</Text>
        </div>
        <div className="mt-1 flex gap-1.5 text-xs text-zinc-500">
          {product.size ? <Text className="text-xs">{product.size}</Text> : null}
        </div>
        <Text className="mt-1 text-xs text-zinc-500">{formatPrice(product.price)}</Text>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <InputNumber defaultValue={product.quantity} onChange={onQuantityChange} className="w-24 justify-between" />

          <button
            type="button"
            onClick={onRemove}
            className="-m-2 cursor-pointer p-2 font-medium"
            title="Remove item from cart"
          >
            <span className="sr-only">Remove</span>
            <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1} />
          </button>
        </div>
      </div>
    </li>
  )
}

export default AsideSidebarCart

