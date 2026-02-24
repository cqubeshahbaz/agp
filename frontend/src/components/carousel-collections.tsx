'use client'

import { TCollection } from '@/data'
import clsx from 'clsx'
import { EmblaViewportRefType } from 'embla-carousel-react'
import CollectionCard from './collection-card'

interface CarouselCollectionsProps {
  collections: TCollection[]
  className?: string
  emblaRef: EmblaViewportRefType
}

const CarouselCollections = ({ className, collections, emblaRef }: CarouselCollectionsProps) => {
  return (
    <div className={clsx('embla', className)} ref={emblaRef}>
      <div className="-ms-5 embla__container">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="embla__slide basis-[86%] ps-5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/4"
          >
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarouselCollections
