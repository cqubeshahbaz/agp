'use client'

import ProductCard from '@/components/product-card'
import { TProductItem } from '@/data'
import clsx from 'clsx'
import { EmblaViewportRefType } from 'embla-carousel-react'

interface CarouselProductsProps {
  products: TProductItem[]
  className?: string
  emblaRef: EmblaViewportRefType
}

const CarouselProducts = ({ className, products, emblaRef }: CarouselProductsProps) => {
  return (
    <div className={clsx('embla', className)} ref={emblaRef}>
      <div className="-ms-5 embla__container">
        {products.map((product) => (
          <div
            key={product.id}
            className="embla__slide basis-[86%] ps-5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/4"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarouselProducts
