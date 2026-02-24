import type { Metadata } from 'next'
import AuthGate from '@/components/auth-gate'
import CartPageClient from './cart-page-client'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Your shopping cart page description goes here.',
}

export default function Page() {
  return (
    <AuthGate>
      <CartPageClient />
    </AuthGate>
  )
}
