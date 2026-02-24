'use client'

import { Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAside } from '../aside'

const HamburgerIconMenu = () => {
  const { open: openAside } = useAside()

  return (
    <button
      type="button"
      onClick={() => openAside('sidebar-navigation')}
      className="-m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5 lg:hidden"
    >
      <span className="sr-only">Open main menu</span>
      <HugeiconsIcon icon={Menu01Icon} size={24} color="currentColor" strokeWidth={1} />
    </button>
  )
}

export default HamburgerIconMenu
