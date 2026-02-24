import { getStrapiUrl } from '@/lib/strapi'
import Stripe from 'stripe'

export const runtime = 'nodejs'

async function updateOrderStatus(orderDocumentId: string, status: 'pending' | 'processing' | 'cancelled') {
  const strapiApiToken = process.env.STRAPI_API_TOKEN
  if (!strapiApiToken || !orderDocumentId) return

  await fetch(`${getStrapiUrl()}/api/orders/${orderDocumentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${strapiApiToken}`,
    },
    body: JSON.stringify({ data: { orderStatus: status } }),
  })
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecretKey || !webhookSecret) {
    return new Response('Missing Stripe webhook config.', { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey)
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header.', { status: 400 })
  }

  const body = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature.'
    return new Response(message, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderDocumentId = String(session.metadata?.orderDocumentId || '')
      const paid = session.payment_status === 'paid'
      await updateOrderStatus(orderDocumentId, paid ? 'processing' : 'pending')
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderDocumentId = String(session.metadata?.orderDocumentId || '')
      await updateOrderStatus(orderDocumentId, 'cancelled')
    }

    return new Response('ok', { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed.'
    return new Response(message, { status: 500 })
  }
}
