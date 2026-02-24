'use client'

import type { TCollection, TProductItem } from '@/data'
import { TImage } from '@/type'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import CollectionCard from '../collection-card'
import { Text, TextLink } from '../text'

export interface MegaMenuPopoverProps {
  megamenu: { name: string; href: string; children: { name: string; href: string }[] }[]
  children: React.ReactNode | string
  rightImage?: TImage
  featuredCollections?: TCollection[]
  featuredProducts?: TProductItem[]
  variant?: 'right-collection' | 'right-image'
}

const MegaMenuPopover = ({
  megamenu,
  children,
  rightImage,
  featuredCollections,  
  featuredProducts,
  variant = 'right-collection',
}: MegaMenuPopoverProps) => {
  return (
    <Popover>
      <PopoverButton className="flex cursor-pointer items-center gap-x-0.5 focus-visible:outline-0">
        <Text>{children}</Text>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="bitpan-popover-full-panel absolute inset-x-0 top-0 -z-10 bg-white pt-[5.1rem] text-zinc-950 shadow-xl transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        <div className="flex justify-between gap-x-8 px-8 py-20 2xl:container dark:border-white/10">
          <div className="flex max-w-xl flex-wrap gap-x-[clamp(1.5rem,5vw,5rem)] gap-y-8">
            {megamenu.map((group) => {
              return (
                <div key={group.name}>
                  <Text className="text-sm/6 font-medium">{group.name}</Text>
                  <ul role="list" className="mt-5 space-y-2.5">
                    {group.children.map((item, index) => (
                      <li key={index}>
                        <TextLink
                          href={item.href}
                          className="text-sm/6 text-zinc-600 uppercase hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          {item.name}
                        </TextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Featured Products */}
          {variant === 'right-collection' && featuredProducts?.length ? (
            <div className="flex max-w-3/5 grow justify-end">
              <div className="grid w-full max-w-3xl grid-cols-2 gap-3">
                {featuredProducts.slice(0, 4).map((product) => (
                  <TextLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={product.featured_image?.src || '/placeholder.webp'}
                        alt={product.featured_image?.alt || product.title}
                        fill
                        className="object-cover"
                        sizes="4rem"
                      />
                    </div>
                    <div className="min-w-0">
                      <Text className="truncate text-sm/5 font-medium text-zinc-900">{product.title}</Text>
                      <Text className="mt-1 text-xs text-zinc-500">${Number(product.price || 0).toFixed(2)}</Text>
                    </div>
                  </TextLink>
                ))}
              </div>
            </div>
          ) : null}

          {/* Featured Collections */}
          {variant === 'right-collection' && !featuredProducts?.length && featuredCollections ? (
            <div className="flex max-w-3/5 grow justify-end">
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                {featuredCollections?.map((collection) => (
                  <div className="w-60 shrink-0" key={collection.id}>
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* OR Featrued Image */}
          {variant === 'right-image' && rightImage ? (
            <div className="w-1/3 ps-8">
              <div className="relative aspect-video w-full">
                <Image
                  src={rightImage?.src || '/placeholder.webp'}
                  alt={rightImage?.alt || 'Featured product'}
                  fill
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280) 50vw, 35vw"
                />
              </div>
            </div>
          ) : null}
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default MegaMenuPopover
