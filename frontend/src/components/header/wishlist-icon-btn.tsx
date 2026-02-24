'use client'

import Link from 'next/link'
import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useWishlist } from '../wishlist-context'

const WishlistIconBtn = () => {
  const { items } = useWishlist()
  const count = items.length

  return (
    <Link href="/wishlist" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
      <HugeiconsIcon icon={FavouriteIcon} size={24} color="currentColor" strokeWidth={1} />
      <span className="text-xs leading-none">({count})</span>
    </Link>
  )
}

export default WishlistIconBtn
