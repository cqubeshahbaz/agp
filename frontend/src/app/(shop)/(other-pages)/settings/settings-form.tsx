'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-context'
import { useToast } from '@/components/toast'
import { getStoredToken } from '@/lib/strapi-auth'
import { getStrapiUrl } from '@/lib/strapi'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'

const normalizePhone = (value?: string) => String(value || '').replace(/\D/g, '').slice(0, 10)

export default function SettingsForm() {
  const { user, refresh } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setPhone(normalizePhone(user?.phone))
  }, [user?.name, user?.email, user?.phone])

  const onReset = () => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setPhone(normalizePhone(user?.phone))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    if (phone.length !== 10) {
      toast('Please enter a valid 10-digit mobile number.', { variant: 'error' })
      return
    }

    const token = getStoredToken()
    if (!token) {
      toast('Please sign in again.', { variant: 'error' })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${getStrapiUrl()}/api/account/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          phone,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = payload?.error?.message || payload?.error || payload?.message || 'Unable to save settings.'
        throw new Error(message)
      }

      await refresh()
      toast('Account settings saved.', { variant: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save settings.'
      toast(message, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl py-20">
        <Heading>
          Account <span data-slot="italic">Details</span>
        </Heading>
        <Text className="mt-2 text-zinc-500">Update your profile information.</Text>
        <Divider className="my-10" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Text className="font-medium">Personal information</Text>
            {/* <Text className="text-zinc-500">This data comes from your account.</Text> */}
          </div>

          <div className="space-y-4">
            <Field>
              <Label>Full name</Label>
              <Input
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>

            <Field>
              <Label>Mobile number</Label>
              <Input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(event) => setPhone(normalizePhone(event.target.value))}
                minLength={10}
                maxLength={10}
                required
              />
              <Text className="mt-1 text-xs text-zinc-500">Enter 10 digits without spaces or symbols.</Text>
            </Field>
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-2.5">
          <Button type="button" outline onClick={onReset}>
            Reset
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Save changes'}
          </Button>
        </div>
      </form>

      <Divider />
    </div>
  )
}
