'use client'

import { Input } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'

export const indiaRegions = [
  'Delhi',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Punjab',
]

export function Address({
  addressLine1,
  city,
  region,
  postalCode,
  onChange,
}: {
  addressLine1: string
  city: string
  region: string
  postalCode: string
  onChange: (next: { addressLine1?: string; city?: string; region?: string; postalCode?: string }) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Input
        aria-label="Street Address"
        name="address"
        placeholder="Street Address"
        className="col-span-2"
        value={addressLine1}
        onChange={(event) => onChange({ addressLine1: event.target.value })}
      />
      <Input
        aria-label="City"
        name="city"
        placeholder="City"
        className="col-span-2"
        value={city}
        onChange={(event) => onChange({ city: event.target.value })}
      />
      <Listbox aria-label="State" name="region" placeholder="State" value={region} onChange={(value) => onChange({ region: value as string })}>
        {indiaRegions.map((regionOption) => (
          <ListboxOption key={regionOption} value={regionOption}>
            <ListboxLabel>{regionOption}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      <Input
        aria-label="Postal code"
        name="postal_code"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(event) => onChange({ postalCode: event.target.value })}
      />
      <Input aria-label="Country" name="country" value="India" readOnly className="col-span-2" />
    </div>
  )
}
