'use client'

import { Button } from '@/components/button'
import CarouselProducts from '@/components/carousel-products'
import { Heading } from '@/components/heading'
import NextPrevButtons from '@/components/next-prev-btns'
import { Text } from '@/components/text'
import { VectorArrowDown } from '@/components/vector-arrow-down'
import { TProductItem } from '@/data'
import { useCarouselArrowButtons } from '@/hooks/use-carousel-arrow-buttons'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

interface SectionProductCarouselProps {
  products?: TProductItem[]
  emblaOptions?: EmblaOptionsType
  className?: string
  collectionHandle?: string
  collectionTitle?: string
  collectionDescription?: string
}

const SectionProductCarousel = ({
  products,
  emblaOptions = {
    slidesToScroll: 'auto',
  },
  className,
  collectionHandle,
  collectionTitle,
  collectionDescription,
}: SectionProductCarouselProps) => {
  // Tạo ref để truy cập các phương thức của carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = useCarouselArrowButtons(emblaApi)

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Button outline href={collectionHandle ? `/collections/${collectionHandle}` : '#'}>
          EXPLORE COLLECTION
        </Button>

        <div className="relative">
          <Heading>
            <span data-slot="dim">Explore</span> <br />
            <span data-slot="italic">{collectionTitle || 'Collection'}</span>
          </Heading>
          <div className="absolute top-[35%] left-2/3 hidden lg:block">
            <VectorArrowDown />
          </div>
        </div>

        <Text className="max-w-xs lg:max-w-sm">{collectionDescription}</Text>

        <NextPrevButtons
          className="ms-auto xl:ms-0"
          onNextClick={onNextButtonClick}
          onPrevClick={onPrevButtonClick}
          nextBtnDisabled={nextBtnDisabled}
          prevBtnDisabled={prevBtnDisabled}
        />
      </div>

      {products ? <CarouselProducts className="mt-16" emblaRef={emblaRef} products={products} /> : null}
    </div>
  )
}

export default SectionProductCarousel
