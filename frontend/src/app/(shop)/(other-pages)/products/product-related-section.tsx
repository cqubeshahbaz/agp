'use client'

import CarouselProducts from '@/components/carousel-products'
import { Heading } from '@/components/heading'
import NextPrevButtons from '@/components/next-prev-btns'
import { TProductItem } from '@/data'
import { useCarouselArrowButtons } from '@/hooks/use-carousel-arrow-buttons'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

interface ProductRelatedSectionProps {
  products: TProductItem[]
  emblaOptions?: EmblaOptionsType
  className?: string
  collectionHandle?: string
  collectionTitle?: string
  collectionDescription?: string
}

const ProductRelatedSection = ({
  products,
  emblaOptions = {
    slidesToScroll: 'auto',
  },
  className,
}: ProductRelatedSectionProps) => {
  // Tạo ref để truy cập các phương thức của carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = useCarouselArrowButtons(emblaApi)

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Heading>
          <span>Take </span> <br />
          <span data-slot="italic">another look</span>
        </Heading>

        <NextPrevButtons
          className="ms-auto xl:ms-0"
          onNextClick={onNextButtonClick}
          onPrevClick={onPrevButtonClick}
          nextBtnDisabled={nextBtnDisabled}
          prevBtnDisabled={prevBtnDisabled}
        />
      </div>

      {products ? <CarouselProducts className="mt-10" emblaRef={emblaRef} products={products} /> : null}
    </div>
  )
}

export default ProductRelatedSection
