'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Aside } from './aside/aside'
import { Checkbox, CheckboxField, CheckboxGroup } from './checkbox'
import { Fieldset, Label, Legend } from './fieldset'
import { Text } from './text'

const filters = [ 
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'all-jewelry', label: 'All Jewelry' },
      { value: 'rings', label: 'Rings' },
      { value: 'necklaces', label: 'Necklaces' },
      { value: 'bracelets', label: 'Bracelets' },
      { value: 'earrings', label: 'Earrings' },
    ],
  },
  {
    id: 'purity',
    name: 'Purity',
    options: [
      { value: '18k', label: '18K' },
      { value: '22k', label: '22K' },
      { value: '24k', label: '24K' },
      { value: '925', label: '925 Sterling' },
    ],
  },
  {
    id: 'price',
    name: 'Price Range',
    options: [
      { value: 'under-10000', label: 'Under 10,000' },
      { value: '10000-30000', label: '10,000 - 30,000' },
      { value: '30000-70000', label: '30,000 - 70,000' },
      { value: '70000-plus', label: '70,000+' },
    ],
  },
]
interface Props {
  className?: string
}

const AsideCategoryFilters = ({ className = '' }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) params.delete(key)
    else params.set(key, value)
    params.delete('page')
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <Aside openFrom="right" type="category-filters" heading="Filters" contentMaxWidthClassName="max-w-sm">
      <div className={clsx('flex h-full flex-col', className)}>
        {/* CONTENT */}

        <div className="flex-1 overflow-x-hidden overflow-y-auto hidden-scrollbar">
          <div className="flow-root">
            {/* Filters */}
            <form className="">
              {filters.map((section) => (
                <Disclosure key={section.name} as="div" className="border-b border-zinc-200 pt-4 pb-4">
                  <Fieldset>
                    <Legend className="w-full">
                      <DisclosureButton className="group flex w-full items-center justify-between p-2 text-zinc-400 hover:text-zinc-500">
                        <Text className="text-sm font-medium text-zinc-900">{section.name}</Text>
                        <span className="ms-6 flex h-7 items-center">
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            className="size-5 shrink-0 group-data-open:-rotate-180"
                            size={16}
                            color="currentColor"
                            strokeWidth={1.5}
                          />
                        </span>
                      </DisclosureButton>
                    </Legend> 
                  </Fieldset>
                </Disclosure>
              ))}
            </form>
          </div>
        </div>
      </div>
    </Aside>
  )
}

export default AsideCategoryFilters