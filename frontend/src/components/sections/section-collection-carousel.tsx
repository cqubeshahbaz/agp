'use client'

import NextPrevButtons from '@/components/next-prev-btns'
import { getGroupCollections } from '@/data'
import { useCarouselArrowButtons } from '@/hooks/use-carousel-arrow-buttons'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useState } from 'react'
import { Button } from '../button'
import CarouselCollections from '../carousel-collections'
import { Divider } from '../divider'
import { Heading } from '../heading'
import { Text } from '../text'

interface SectionCollectionCarouselProps {
  emblaOptions?: EmblaOptionsType
  className?: string
  sectonTitle?: string
  groupCollections: Awaited<ReturnType<typeof getGroupCollections>>
}

// example data
const ex_group_collections = [
  {
    name: 'Most Popular',
    handle: 'most-popular',
    collections: [
      // list your collection data
    ],
  },
  // ...
]

const SectionCollectionCarousel = ({
  emblaOptions = {
    slidesToScroll: 'auto',
  },
  className,
  sectonTitle = 'Find your own <span data-slot="italic">unique collection,</span> Ultimate Jewelry  <br /> Collective.',
  groupCollections,
}: SectionCollectionCarouselProps) => {
  // Tạo ref để truy cập các phương thức của carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)
  const [groupSelected, setGroupSelected] = useState<string>(groupCollections?.[0]?.handle || '')
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = useCarouselArrowButtons(emblaApi)

  return (
    <div className={className}>
      <div className="flex flex-col justify-between gap-8 lg:flex-row">
        <div className="flex-2/3">
          <Heading className="max-w-2xl" bigger dangerouslySetInnerHTML={{ __html: sectonTitle || '' }} />
        </div>

        <div className="flex-1/3">
          <Text>Find Your Glow, Pick Your choice</Text>
          <Button outline href={'/collections/all'} className="mt-4">
            SHOP NOW
          </Button>
        </div>

        <Divider className="block lg:hidden" />
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-end gap-5">

        <NextPrevButtons
          className="ms-auto xl:ms-0"
          onNextClick={onNextButtonClick}
          onPrevClick={onPrevButtonClick}
          nextBtnDisabled={nextBtnDisabled}
          prevBtnDisabled={prevBtnDisabled}
        />
      </div>

      <CarouselCollections
        className="mt-10"
        emblaRef={emblaRef}
        collections={groupCollections?.find((group) => group.handle === groupSelected)?.collections || []}
      />
    </div>
  )
}

export default SectionCollectionCarousel

