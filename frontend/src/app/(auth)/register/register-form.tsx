'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { useAuth } from '@/components/auth-context'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError(null)

    if (password !== confirmPassword) {
      setSubmitting(false)
      setError('Passwords do not match')
      return
    }

    if (phone.length !== 10) {
      setSubmitting(false)
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    const result = await register({
      name,
      email,
      phone,
      password,
      remember: true,
    })

    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Unable to create account')
      return
    }

    const redirect = searchParams.get('redirect')?.startsWith('/') ? searchParams.get('redirect') : '/'
    router.push(redirect || '/')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <Logo className="mx-auto h-8 sm:h-9" />
          <Text className="mt-2 text-xs text-zinc-500 sm:text-sm">
            Create an account to access rewards and exclusive content
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <Label>Full name</Label>
            <Input className="h-10" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>

          <Field>
            <Label>Email</Label>
            <Input className="h-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
        </div>

        <Field className="mt-4">
          <Label>Mobile number</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">+91</span>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              className="h-10 pl-12"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit number"
              required
            />
          </div>
        </Field>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <Label>Password</Label>
            <div className="relative">
              <Input
                className="h-10"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>

          <Field>
            <Label>Confirm</Label>
            <div className="relative">
              <Input
                className="h-10"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <Button type="submit" className="mt-6 h-11 w-full rounded-xl" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create account'}
        </Button>

        <Text className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <TextLink href="/login">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </div>
  )
}
