import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStrapiUrl } from '@/lib/strapi'

const TAX_RATE = 0.08
export const runtime = 'nodejs'

type CheckoutItemInput = {
  productHandle?: string
  name?: string
  price?: number
  quantity?: number
  imageSrc?: string
  imageAlt?: string
  color?: string | null
  size?: string | null
}

type CheckoutPayload = {
  email?: string
  firstName?: string
  lastName?: string
  company?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  country?: string
  region?: string
  postalCode?: string
  phone?: string
  deliveryMethod?: string
  paymentMethod?: string
  items?: CheckoutItemInput[]
}

function toCents(value: number) {
  return Math.max(0, Math.round(value * 100))
}

function toAbsoluteHttpUrl(value: string, baseUrl: string) {
  if (!value) return ''
  try {
    const url = new URL(value, baseUrl)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    return url.toString()
  } catch {
    return ''
  }
}

function sanitizeItems(items: CheckoutItemInput[]) {
  return items
    .map((item) => ({
      productHandle: String(item.productHandle || ''),
      name: String(item.name || ''),
      price: Number(item.price || 0),
      quantity: Math.max(1, Number(item.quantity || 1)),
      imageSrc: String(item.imageSrc || ''),
      imageAlt: String(item.imageAlt || 'Product image'),
      color: item.color || null,
      size: item.size || null,
    }))
    .filter((item) => item.productHandle && item.name && item.price > 0)
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY.' }, { status: 500 })
    }

    const authorization = request.headers.get('authorization') || ''
    const token = authorization.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const raw = (await request.json()) as CheckoutPayload
    const items = sanitizeItems(raw.items || [])
    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }

    const email = String(raw.email || '').trim()
    const firstName = String(raw.firstName || '').trim()
    const lastName = String(raw.lastName || '').trim()
    const addressLine1 = String(raw.addressLine1 || '').trim()
    const city = String(raw.city || '').trim()
    const country = String(raw.country || '').trim()
    const postalCode = String(raw.postalCode || '').trim()
    if (!email || !firstName || !lastName || !addressLine1 || !city || !country || !postalCode) {
      return NextResponse.json({ error: 'Missing required checkout fields.' }, { status: 400 })
    }

    const deliveryMethod = String(raw.deliveryMethod || 'Standard').trim() || 'Standard'
    const paymentMethod = String(raw.paymentMethod || 'Card').trim() || 'Card'
    const shipping = deliveryMethod.toLowerCase() === 'express' ? 16 : 5
    const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
    const tax = Number((subtotal * TAX_RATE).toFixed(2))
    const total = Number((subtotal + shipping + tax).toFixed(2))

    const orderResponse = await fetch(`${getStrapiUrl()}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          orderStatus: 'pending',
          email,
          firstName,
          lastName,
          company: String(raw.company || '').trim(),
          addressLine1,
          addressLine2: String(raw.addressLine2 || '').trim(),
          city,
          country,
          region: String(raw.region || '').trim(),
          postalCode,
          phone: String(raw.phone || '').trim(),
          deliveryMethod,
          paymentMethod,
          subtotal,
          shipping,
          tax,
          total,
          items,
        },
      }),
    })

    const orderJson = await orderResponse.json().catch(() => ({}))
    if (!orderResponse.ok) {
      const message = orderJson?.error?.message || orderJson?.error || orderJson?.message || 'Unable to create order.'
      return NextResponse.json({ error: message }, { status: orderResponse.status })
    }

    const orderData = orderJson?.data || {}
    const orderDocumentId = String(orderData.documentId || orderData?.attributes?.documentId || '')
    const orderNumber = String(orderData.orderNumber || orderData?.attributes?.orderNumber || `AGP-${Date.now()}`)
    const requestOrigin = new URL(request.url).origin
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || requestOrigin || 'http://localhost:3000').replace(/\/$/, '')

    const stripe = new Stripe(stripeSecretKey)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      ...items.map((item) => {
        const imageUrl = toAbsoluteHttpUrl(item.imageSrc, `${appUrl}/`)
        return {
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: toCents(item.price),
            product_data: {
              name: item.name,
              description: item.size || undefined,
              images: imageUrl ? [imageUrl] : undefined,
            },
          },
        }
      }),
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: toCents(shipping),
          product_data: { name: `Shipping (${deliveryMethod})` },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: toCents(tax),
          product_data: { name: 'Tax' },
        },
      },
    ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      success_url: `${appUrl}/order-successful?order=${encodeURIComponent(orderNumber)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=1`,
      line_items: lineItems,
      metadata: {
        orderNumber,
        orderDocumentId,
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Unable to start Stripe checkout.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout session failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
