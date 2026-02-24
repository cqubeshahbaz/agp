'use client'

import { useAside } from '@/components/aside'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Fieldset, Label, Legend } from '@/components/fieldset'
import { Text } from '@/components/text'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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

const CategoryFilters1 = () => {
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
    <aside>
      <h2 className="sr-only">Filters</h2>

      <button
        type="button"
        onClick={() => openAside('category-filters')}
        className="inline-flex items-center lg:hidden"
      >
        <span className="text-sm font-medium text-gray-700 uppercase">Filters</span>
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-5 shrink-0 text-gray-400"
          size={16}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>

      <div className="hidden lg:block">
        <form className="divide-y divide-gray-200">
          {filters.map((section) => (
            <div key={section.name} className="py-10 first:pt-0 last:pb-0">
              <Fieldset>
                <Legend className="block">
                  <Text className="font-medium">{section.name}</Text>
                </Legend>
                <div className="space-y-3 pt-6">
                  <CheckboxGroup>
                    {section.options.map((option, optionIdx) => (
                      <CheckboxField key={option.value}>
                        <Checkbox
                          name={`${section.id}[]`}
                          value={option.value}
                          checked={searchParams.get(section.id) === option.value}
                          onChange={(checked) => setFilter(section.id, checked ? option.value : undefined)}
                        />
                        <Label>
                          <Text className="text-zinc-600">{option.label}</Text>
                        </Label>
                      </CheckboxField>
                    ))}
                  </CheckboxGroup>
                </div>
              </Fieldset>
            </div>
          ))}
        </form>
      </div>
    </aside>
  )
}

export default CategoryFilters1
