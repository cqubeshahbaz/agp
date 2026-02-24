'use client'

import { Dialog } from '@headlessui/react'
import { ViewfinderCircleIcon } from '@heroicons/react/24/outline'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface TImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery2({ media, className }: { media: TImage[]; className?: string }) {
  const [isOpenModal, setOpenModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const closeModal = () => {
    setOpenModal(false)
    setActiveIndex(0)
  }

  if (!media.length) {
    return null
  }

  return (
    <>
      <div className={`swimlane hidden-scrollbar lg:grid-flow-row lg:grid-cols-2 lg:overflow-x-hidden ${className}`}>
        {media.map((image, i) => {
          return (
            <div
              className="group relative aspect-3/4 w-72 shrink-0 cursor-pointer snap-center bg-gray-100 sm:w-96 lg:w-full"
              key={i + '--image'}
              onClick={() => {
                setOpenModal(true)
                setActiveIndex(i)
              }}
            >
              <Image
                src={image.src}
                alt={image.alt || 'Product images'}
                sizes={'(min-width: 48em) 30vw, 90vw'}
                fill
                className="h-full w-full object-cover"
                priority
              />

              <button
                className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-100"
                type="button"
              >
                <span className="sr-only">View image</span>
                <ViewfinderCircleIcon className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="">
        <Dialog
          open={isOpenModal}
          transition
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <>
            <span className="dr inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <button
              type="button"
              onClick={closeModal}
              className="fixed top-2 left-2 z-50 -m-2.5 cursor-pointer p-2.5 sm:top-5 sm:left-5"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={32} color="currencyColor" strokeWidth={1} />
            </button>

            <div className="inline-block w-full overflow-hidden bg-white text-left align-middle text-neutral-900 shadow-xl">
              <div className="container">
                <ModalImageGallery media={media} indexActive={activeIndex} />
              </div>
            </div>
          </>
        </Dialog>
      </div>
    </>
  )
}

function ModalImageGallery({ media, indexActive }: { media: TImage[]; indexActive: number }) {
  useEffect(() => {
    if (!indexActive) return
    const image = document.getElementById('image' + indexActive)
    if (image) {
      image.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      })
    }
  }, [indexActive])

  return (
    <div className="grid gap-5">
      {media.map((image, i) => {
        if (!image) return null
        return (
          <div key={i + '--image'} id={'image' + i}>
            <Image
              src={image.src}
              alt={image.alt || 'Product image'}
              sizes="(min-width: 48em) 60vw, 90vw"
              className="mx-auto"
              width={image.width}
              height={image.height}
            />
          </div>
        )
      })}
    </div>
  )
}
