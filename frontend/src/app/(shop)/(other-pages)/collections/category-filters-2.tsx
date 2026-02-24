'use client'

import { useAside } from '@/components/aside'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Fieldset, Label } from '@/components/fieldset'
import { Text } from '@/components/text'
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { ArrowDown01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'rings', label: 'Rings' },
      { value: 'necklaces', label: 'Necklaces' },
      { value: 'bracelets', label: 'Bracelets' },
      { value: 'earrings', label: 'Earrings' },
      { value: 'pendants', label: 'Pendants' },
      { value: 'bridal-sets', label: 'Bridal Sets' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    options: [
      { value: 'royal-gold', label: 'Royal Gold' },
      { value: 'heritage-jewels', label: 'Heritage Jewels' },
      { value: 'diamond-craft', label: 'Diamond Craft' },
      { value: 'noor-collection', label: 'Noor Collection' },
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
]

interface Props {
  className?: string
}

export default function CategoryFilters2({ className }: Props) {
  const { open: openAside } = useAside()
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
    <div className={className}>
      <button
        type="button"
        onClick={() => openAside('category-filters')}
        className="inline-flex items-center sm:hidden"
      >
        <span className="text-sm font-medium text-zinc-700 uppercase">Filters</span>
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-5 shrink-0 text-zinc-400"
          size={16}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>

      <PopoverGroup className="hidden sm:flex sm:items-baseline sm:space-x-8">
        {filters.map((section, sectionIdx) => {
          const bage = searchParams.get(section.id) ? 1 : 0
          return (
            <Popover key={section.name} id="menu" className="relative inline-block text-left">
              <div>
                <PopoverButton className="group inline-flex items-center justify-center focus-visible:outline-none">
                  <Text>{section.name}</Text>
                  {bage ? (
                    <span className="ml-1 text-xs font-semibold text-zinc-950 tabular-nums underline">({bage})</span>
                  ) : null}

                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="-mr-1 ml-1 size-5 shrink-0 text-zinc-400 group-hover:text-zinc-500"
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </PopoverButton>
              </div>

              <PopoverPanel
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <Fieldset>
                  <CheckboxGroup className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <CheckboxField key={option.value}>
                        <Checkbox
                          value={option.value}
                          checked={searchParams.get(section.id) === option.value}
                          name={`${section.id}[]`}
                          onChange={(checked) => setFilter(section.id, checked ? option.value : undefined)}
                        />
                        <Label>
                          <Text>{option.label}</Text>
                        </Label>
                      </CheckboxField>
                    ))}
                  </CheckboxGroup>
                </Fieldset>
              </PopoverPanel>
            </Popover>
          )
        })}
      </PopoverGroup>
    </div>
  )
}
