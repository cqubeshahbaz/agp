'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { useAuth } from '@/components/auth-context'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    if (!token) {
      setSubmitting(false)
      setError('Reset token is missing.')
      return
    }

    if (password.length < 6) {
      setSubmitting(false)
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setSubmitting(false)
      setError('Passwords do not match.')
      return
    }

    const result = await resetPassword({ token, password })
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Unable to reset password.')
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 1200)
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <h1 className="sr-only">Reset your password</h1>
      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">Choose a new password for your account.</Text>
      </div>
      <Field>
        <Label>New password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </Field>
      <Field>
        <Label>Confirm new password</Label>
        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            name="confirm"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-900"
          >
            {showConfirm ? 'Hide' : 'Show'}
          </button>
        </div>
      </Field>
      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
      {success ? <Text className="text-sm text-emerald-600">Password updated. Redirecting to login...</Text> : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Saving...' : 'Reset password'}
      </Button>
      <Text>
        Remembered your password?{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
