'use client'

import { TProductItem } from '@/data'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useAside } from './aside'
import { ButtonCircle } from './button'
import { Text, TextLink } from './text'

interface ProductCardProps {
  product: TProductItem
  className?: string
  imageRatio?: string
}

export default function ProductCardHorizontal({ product, className, imageRatio = 'aspect-[1/1]' }: ProductCardProps) {
  const { open: openAside } = useAside()

  const { title, price, selected_options, featured_image, handle, images } = product
  const primaryImage = images?.[0]?.src ?? featured_image?.src ?? '/placeholder.webp'

  // find the product size
  const size = selected_options.find((option) => option.name === 'Size')?.value

  return (
    <div className={clsx('group/prd relative flex w-full justify-between', className)}>
      {/* Product Image */}
      <div className="flex gap-4">
        <div className={clsx('relative w-24', imageRatio)}>
          <Image
            src={primaryImage}
            alt={title}
            fill
            className="z-0 rounded-lg object-cover"
            sizes="6rem"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <TextLink className="leading-tight sm:leading-6" href={`/products/${handle}`} target="_blank" rel="noopener noreferrer">
            <span className="absolute inset-0"></span>
            {title}
          </TextLink>
          <Text className="mt-0.5 text-xs text-zinc-500">{size ?? ''}</Text>
          <Text className="mt-auto leading-tight sm:leading-6">${price.toFixed(2)}</Text>
        </div>
      </div>

      <div className="relative self-center">
        <ButtonCircle className="!sm:p-3 p-2.5" onClick={() => openAside('cart')}>
          <span className="sr-only">Add to cart</span>
          <HugeiconsIcon icon={PlusSignIcon} size={20} color="currencyColor" strokeWidth={1} />
        </ButtonCircle>
      </div>
    </div>
  )
}
