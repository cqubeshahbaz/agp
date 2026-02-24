'use client'

import AuthGate from '@/components/auth-gate'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Text } from '@/components/text'
import { useAuth } from '@/components/auth-context'
import { getStrapiUrl } from '@/lib/strapi'
import { getStoredToken } from '@/lib/strapi-auth'
import { useEffect, useState } from 'react'

type OrderListResponse = {
  data?: Array<{
    orderNumber?: string
    attributes?: { orderNumber?: string }
  }>
}

const formatPhone = (value?: string) => {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length !== 10) return '-'
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

export default function AccountPage() {
  const { user } = useAuth()
  const [latestOrderNumber, setLatestOrderNumber] = useState('')

  useEffect(() => {
    const token = getStoredToken()
    if (!token) return

    const run = async () => {
      try {
        const params = new URLSearchParams({
          sort: 'createdAt:desc',
          'pagination[pageSize]': '1',
        })
        const response = await fetch(`${getStrapiUrl()}/api/orders?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) return
        const payload = (await response.json().catch(() => ({}))) as OrderListResponse
        const first = Array.isArray(payload?.data) ? payload.data[0] : null
        const number = String(first?.orderNumber || first?.attributes?.orderNumber || '')
        if (number) setLatestOrderNumber(number)
      } catch {
        setLatestOrderNumber('')
      }
    }

    void run()
  }, [])

  return (
    <AuthGate>
      <div className="container">
        <div className="mx-auto max-w-4xl py-16 sm:py-24">
          <div className="max-w-2xl">
            <Heading level={1} bigger>
              My <span data-slot="italic">Account</span>
            </Heading>
            <Text className="mt-2 text-zinc-500">
              Manage your profile, track orders, and keep your account up to date.
            </Text>
          </div>

          <Divider className="my-10" />

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-6">
              <Text className="text-xs uppercase text-zinc-500">Profile</Text>
              <Text className="mt-3 text-lg font-medium text-zinc-900">{user?.name || '-'}</Text>
              <Text className="mt-3 text-xs uppercase text-zinc-500">Email</Text>
              <Text className="mt-1 text-sm text-zinc-700">{user?.email || '-'}</Text>
              <Text className="mt-3 text-xs uppercase text-zinc-500">Mobile</Text>
              <Text className="mt-1 text-sm text-zinc-700">{formatPhone(user?.phone)}</Text>
              <div className="mt-5 flex gap-3">
                <Button href="/settings">Edit Account</Button>
                <Button outline href="/wishlist">
                  View wishlist
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <Text className="text-xs uppercase text-zinc-500">Quick Actions</Text>
              <div className="mt-4 space-y-3 text-sm">
                <Link href="/orders" className="block underline">
                  View all orders
                </Link>
                {latestOrderNumber ? (
                  <Link href={`/orders/${latestOrderNumber}`} className="block underline">
                    Go to latest order details
                  </Link>
                ) : (
                  <Text className="block text-zinc-500">No orders yet</Text>
                )}
                <Link href="/settings" className="block underline">
                  Update account details
                </Link>
            
              </div>
            </div>
          </section>

          <Divider className="my-10" soft />
        </div>
      </div>
    </AuthGate>
  )
}
