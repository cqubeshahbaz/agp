import { Text } from '@/components/text'
import { VectorArrowDown3 } from '@/components/vector-arrow-down'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'

const demo_faqs = [
  {
    question: 'Soft Cleaning Only',
    answer:
      'Use a soft, dry cloth to clean your jewelry after each use. Avoid harsh chemicals and abrasive materials.',
  },
  {
    question: 'Store Pieces Separately',
    answer:
      'Keep each item in a separate pouch or box to avoid scratches and preserve surface shine.',
  },
  {
    question: 'Keep Away from Moisture',
    answer: 'Avoid direct contact with perfumes, water, and lotions for better longevity.',
  },
  {
    question: 'Professional Polish',
    answer: 'For deep restoration, get periodic professional polishing and inspection.',
  },
]

interface ProductUsageSectionProps {
  className?: string
  imageSrc?: string
  imageAlt?: string
  faqs?: {
    question: string
    answer: string
  }[]
}

const ProductUsageSection = ({ className, imageAlt, imageSrc, faqs = demo_faqs }: ProductUsageSectionProps) => {
  return (
    <div className={clsx('flex flex-col-reverse justify-between gap-8 lg:flex-row', className)}>
      <div className="relative flex-1/2 2xl:flex-3/7">
        <Image
          src={imageSrc || '/placeholder.webp'}
          width={662}
          height={653}
          alt={imageAlt || 'product-faqs'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />
        <VectorArrowDown3 className="absolute start-full top-full hidden -translate-x-1/5 -translate-y-full lg:block xl:top-[96%]" />
      </div>

      <div className="relative flex flex-1/2 justify-center 2xl:flex-4/7">
        <div className="w-full max-w-lg self-start">
          <dl className="divide-y divide-zinc-900/10">
            {faqs.map((faq, index) => (
              <Disclosure defaultOpen={index === 0} key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full justify-between text-start">
                    <Text className="font-medium">{faq.question}</Text>
                    <span className="ms-6 self-center text-zinc-600 dark:text-zinc-400">
                      <PlusIcon aria-hidden="true" className="size-4 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-4 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-3">
                  <Text className="max-w-md text-zinc-600" dangerouslySetInnerHTML={{ __html: faq.answer }}></Text>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default ProductUsageSection
