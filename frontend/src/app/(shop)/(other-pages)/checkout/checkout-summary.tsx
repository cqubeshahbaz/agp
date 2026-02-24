'use client'

import { Button } from '@/components/button'
import { useCart } from '@/components/cart-context'
import { Text, TextLink } from '@/components/text'
import { useToast } from '@/components/toast'
import { useSingleClick } from '@/hooks/use-single-click'
import { getStoredToken } from '@/lib/strapi-auth'
import Image from 'next/image'
import Link from 'next/link'

const formatPrice = (value: number) => `$${value.toFixed(2)}`
const STANDARD_SHIPPING = 5
const EXPRESS_SHIPPING = 16

export default function CheckoutSummary() {
  const { items, subtotal, loading } = useCart()
  const { toast } = useToast()
  const { pending: submitting, runAsync } = useSingleClick({ fallbackMs: 30000 })

  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = subtotal + STANDARD_SHIPPING + tax

  const getValue = (formData: FormData, key: string) => String(formData.get(key) || '').trim()

  const onConfirmOrder = async () => {
    if (!items.length || submitting) return

    const token = getStoredToken()
    if (!token) {
      toast('Please sign in to place your order.', { variant: 'error' })
      return
    }

    const form = document.getElementById('checkout-form') as HTMLFormElement | null
    if (!form) {
      toast('Checkout form not found.', { variant: 'error' })
      return
    }

    const formData = new FormData(form)
    const email = getValue(formData, 'email')
    const firstName = getValue(formData, 'first-name')
    const lastName = getValue(formData, 'last-name')
    const company = getValue(formData, 'company')
    const addressLine1 = getValue(formData, 'address')
    const addressLine2 = getValue(formData, 'apartment')
    const city = getValue(formData, 'city')
    const country = getValue(formData, 'country')
    const region = getValue(formData, 'region')
    const postalCode = getValue(formData, 'postal-code')
    const phone = getValue(formData, 'phone')
    const deliveryMethod = getValue(formData, 'delivery-method') || 'Standard'
    const paymentMethod = getValue(formData, 'payment-method') || 'Card'

    if (!email || !firstName || !lastName || !addressLine1 || !city || !country || !postalCode) {
      toast('Please fill all required checkout fields.', { variant: 'error' })
      return
    }

    await runAsync(async () => {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          company,
          addressLine1,
          addressLine2,
          city,
          country,
          region,
          postalCode,
          phone,
          deliveryMethod,
          paymentMethod,
          items: items.map((item) => ({
            productHandle: item.productHandle,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageSrc: item.imageSrc,
            imageAlt: item.imageAlt,
            size: item.size || null,
          })),
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = payload?.error?.message || payload?.error || payload?.message || 'Unable to place order.'
        throw new Error(message)
      }

      const url = String(payload?.url || '')
      if (!url) {
        throw new Error('Stripe checkout URL not returned.')
      }

      window.location.href = url
    }).catch((error) => {
      const message = error instanceof Error ? error.message : 'Unable to place order.'
      toast(message, { variant: 'error' })
    })
  }

  if (loading) {
    return <Text className="text-zinc-500">Loading your cart...</Text>
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <Text className="text-zinc-500">Your cart is empty.</Text>
        <div className="mt-4">
          <Button href="/collections/all">Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-lg border border-zinc-200 bg-white">
      <h3 className="sr-only">Items in your cart</h3>
      <ul role="list" className="divide-y divide-zinc-200">
        {items.map((product) => (
          <li key={product.id} className="flex px-4 py-6 sm:px-6">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md">
              <Image
                fill
                alt={product.imageAlt}
                src={product.imageSrc}
                className="size-full object-cover"
                sizes="(min-width: 640px) 10rem, 100vw"
              />
            </div>
            <div className="ms-4 flex flex-1 flex-col">
              <div className="flex justify-between font-medium">
                <h3 className="leading-tight">
                  <TextLink href={'/products/' + product.productHandle} target="_blank" rel="noopener noreferrer">
                    {product.name}
                  </TextLink>
                </h3>
                <Text className="ms-4">{formatPrice(product.price)}</Text>
              </div>
              <div className="mt-1 flex gap-1.5 text-xs text-zinc-500">
                {product.size ? <Text className="text-xs">{product.size}</Text> : null}
              </div>
              <Text className="mt-1 text-xs text-zinc-500">Qty {product.quantity}</Text>
            </div>
          </li>
        ))}
      </ul>
      <dl className="space-y-6 border-t border-zinc-200 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <dt className="text-sm uppercase">Subtotal</dt>
          <dd className="text-sm font-medium text-zinc-900">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm uppercase">Shipping</dt>
          <dd className="text-sm font-medium text-zinc-900">{formatPrice(STANDARD_SHIPPING)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm uppercase">Taxes</dt>
          <dd className="text-sm font-medium text-zinc-900">{formatPrice(tax)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
          <dt className="text-base font-medium uppercase">Total</dt>
          <dd className="text-base font-medium text-zinc-900">{formatPrice(total)}</dd>
        </div>
      </dl>

      <div className="border-t border-zinc-200 px-4 py-6 sm:px-6">
        <Button className="w-full font-medium" type="button" onClick={onConfirmOrder} disabled={submitting}>
          {submitting ? 'Placing order...' : 'Confirm order'}
        </Button>
        <div className="mt-4 flex justify-center text-center text-sm text-zinc-500">
          <span className="text-xs">
            or{' '}
            <span className="text-xs font-medium text-zinc-900 uppercase">
              <Link href="/collections/all">Continue Shopping</Link>
              <span aria-hidden="true"> &rarr;</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
