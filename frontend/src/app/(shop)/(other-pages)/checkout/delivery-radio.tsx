'use client'

import { Radio as UIRadio, RadioGroup as UIRadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]

const DeliveryRadio = () => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])

  return (
    <div>
      <input type="hidden" name="delivery-method" value={selectedDeliveryMethod.title} />
      <UIRadioGroup
        value={selectedDeliveryMethod}
        onChange={setSelectedDeliveryMethod}
        className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      >
        {deliveryMethods.map((deliveryMethod) => (
          <UIRadio
            key={deliveryMethod.id}
            value={deliveryMethod}
            aria-label={deliveryMethod.title}
            aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
            className="group relative flex cursor-pointer rounded-lg border border-zinc-300 bg-white p-4 focus:outline-hidden data-checked:border-transparent data-focus:ring-2 data-focus:ring-zinc-900"
          >
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-zinc-900">{deliveryMethod.title}</span>
                <span className="mt-1 flex items-center text-sm text-zinc-500">{deliveryMethod.turnaround}</span>
                <span className="mt-6 text-sm font-medium text-zinc-900">{deliveryMethod.price}</span>
              </span>
            </span>
            <CheckCircleIcon aria-hidden="true" className="size-5 text-zinc-900 group-not-data-checked:hidden" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-zinc-900 group-data-focus:border"
            />
          </UIRadio>
        ))}
      </UIRadioGroup>
    </div>
  )
}

export default DeliveryRadio
