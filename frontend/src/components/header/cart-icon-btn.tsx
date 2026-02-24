'use client'

import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAside } from '../aside'
import { useCart } from '../cart-context'

const CartIconBtn = () => {
  const { open: openAside } = useAside()
  const { items } = useCart()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <button
      type="button"
      className="-m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5"
      onClick={() => openAside('cart')}
    >
      <HugeiconsIcon icon={ShoppingBag03Icon} size={24} color="currentColor" strokeWidth={1} />
      <span className="text-xs leading-none">({count})</span>
    </button>
  )
}

export default CartIconBtn
