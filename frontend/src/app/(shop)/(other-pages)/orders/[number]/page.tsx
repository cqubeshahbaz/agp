import { Divider } from '@/components/divider'
import AuthGate from '@/components/auth-gate'
import type { Metadata } from 'next'
import OrderDetailsClient from './order-details-client'

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View your order details and status updates.',
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params

  return (
    <AuthGate>
      <div className="container">
        <OrderDetailsClient orderNumber={number} />
        <Divider />
      </div>
    </AuthGate>
  )
}
