import { TProductItem } from '@/data'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import { Text, TextLink } from './text'

interface ProductCardProps {
  product: TProductItem
  className?: string
  imageRatio?: string
}

export default function ProductCard({ product, className, imageRatio = 'aspect-3/4' }: ProductCardProps) {
  const { id, title, price, featured_image, handle, images, tags, vendor, selected_options } = product
  const primaryImage = images?.[0]?.src ?? featured_image?.src ?? '/placeholder.webp'
  const secondaryImage = images?.[1]?.src

  // find the product size
  const size = selected_options.find((option) => option.name === 'Size')?.value

  return (
    <div className={clsx('group/prd relative w-full', className)}>
      {/* Product Image */}
      <div className={clsx('relative w-full', imageRatio)}>
        <Image
          src={primaryImage}
          alt={title}
          fill
          className="z-0 rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
          priority
        />
        {secondaryImage ? (
          <Image
            src={secondaryImage}
            alt={title}
            fill
            className="z-0 rounded-lg object-cover opacity-0 transition-opacity duration-300 group-hover/prd:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
          />
        ) : null}
      </div>

      {/* Category Label */}
      <div className="absolute top-3 left-3">
        <div className="rounded-full bg-white px-3.5 py-1.5 text-xs leading-none text-zinc-900 uppercase">{vendor}</div>
      </div>

      {/* Shopping Bag Icon */}
      <div className="absolute top-3 right-3">
        <div className="rounded-full bg-white p-1.5 text-zinc-500">
          <ShoppingBagIcon className="h-4 w-4" />
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-3">
        <div className="flex justify-between">
          <TextLink href={`/products/${handle}`} target="_blank" rel="noopener noreferrer">
            <span className="absolute inset-0"></span>
            {title}
          </TextLink>
          <Text className="">${price.toFixed(2)}</Text>
        </div>
        <Text className="mt-0.5 text-xs text-zinc-500">{size ?? ''}</Text>
      </div>
    </div>
  )
}
