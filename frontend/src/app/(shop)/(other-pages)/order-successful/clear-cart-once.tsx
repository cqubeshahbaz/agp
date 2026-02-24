'use client'

import { useCart } from '@/components/cart-context'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ClearCartOnce() {
  const { clearItems } = useCart()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return

    const key = `agp_cart_cleared_${sessionId}`
    if (window.sessionStorage.getItem(key)) return

    clearItems().finally(() => {
      window.sessionStorage.setItem(key, '1')
    })
  }, [searchParams, clearItems])

  return null
}
