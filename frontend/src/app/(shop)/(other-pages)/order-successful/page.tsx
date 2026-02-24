import ClearCartOnce from './clear-cart-once'
import OrderSuccessfulClient from './order-successful-client'

export const metadata = {
  title: 'Order Successful',
  description: 'Your order has been successfully placed.',
}

export default function Page() {
  return (
    <>
      <ClearCartOnce />
      <OrderSuccessfulClient />
    </>
  )
}
