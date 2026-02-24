import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import AuthGate from '@/components/auth-gate'
import type { Metadata } from 'next'
import OrdersClient from './orders-client'

export const metadata: Metadata = {
  title: 'Your Orders',
  description: 'Check the status of recent orders, manage returns, and discover similar products.',
}

export default function Page() {
  return (
    <AuthGate>
      <div className="container">
        <div className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="max-w-xl">
            <Heading level={1} id="your-orders-heading" bigger>
              Your <span data-slot="italic">Orders</span>
            </Heading>
            <Text className="mt-2 text-zinc-500">
              Check the status of recent orders, manage returns, and discover similar products.
            </Text>
          </div>
          <OrdersClient />
        </div>
        <Divider />
      </div>
    </AuthGate>
  )
}
