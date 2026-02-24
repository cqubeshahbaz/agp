'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

interface TImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

type PropType = {
  media: TImage[]
  className?: string
}

const ProductImageCarousel = ({ media, className }: PropType) => {
  const images = useMemo(() => (media ?? []).filter((item) => item?.src), [media])
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return null
  }

  const active = images[Math.min(activeIndex, images.length - 1)]

  const goPrev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const goNext = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <section className={clsx('flex flex-col gap-5 xl:flex-row xl:gap-6', className)}>
      <div className="relative min-w-0 flex-1">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={active.src}
            alt={active.alt || 'Product image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 text-zinc-900 shadow-sm"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 text-zinc-900 shadow-sm"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4 border-zinc-200 xl:w-20 xl:border-r xl:pr-4 2xl:w-24">
        <div className="hidden h-px w-full bg-zinc-200 xl:block" />
        <div className="flex gap-2.5 xl:flex-col xl:overflow-y-auto xl:pr-1">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'relative aspect-3/4 w-16 overflow-hidden rounded-md border xl:w-full',
                index === activeIndex ? 'border-zinc-900' : 'border-transparent'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.alt || 'Product thumbnail'}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductImageCarousel
