'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Text, TextLink } from '../text'

export interface DropdownMenuPopoverProps {
  dropdownMenu: { name: string; href: string }[]
  children: React.ReactNode | string
}

const DropdownMenuPopover = ({ dropdownMenu, children }: DropdownMenuPopoverProps) => {
  return (
    <Popover className="relative">
      <PopoverButton className="flex cursor-pointer items-center gap-x-1 focus-visible:outline-0">
        <Text>{children}</Text>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute top-full -left-8 -z-10 mt-6 w-56 bg-white px-2.5 pt-5 pb-4 text-zinc-950 shadow-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        {dropdownMenu.map((item) => (
          <TextLink
            key={item.name}
            href={item.href}
            className="block px-3 py-2 text-sm/6 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            {item.name}
          </TextLink>
        ))}
      </PopoverPanel>
    </Popover>
  )
}

export default DropdownMenuPopover
