'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { useAuth } from '@/components/auth-context'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState } from 'react'

export default function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    setResetToken(null)

    const result = await requestPasswordReset(email)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Unable to send reset link.')
      return
    }

    setSuccess(true)
    setResetToken(result.token ?? null)
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <h1 className="sr-only">Reset your password</h1>
      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">Enter your email and we&apos;ll send you a link to reset your password.</Text>
      </div>
      <Field>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
      {success ? (
        <div className="space-y-2">
          <Text className="text-sm text-emerald-600">Reset link created.</Text>
          {resetToken ? (
            <Text className="text-xs text-zinc-500">
              Use this link (dev only):{' '}
              <TextLink href={`/reset-password?token=${encodeURIComponent(resetToken)}`}>
                <Strong>Reset password</Strong>
              </TextLink>
            </Text>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        Reset password
      </Button>
      <Text>
        Don&apos;t have an account?{' '}
        <TextLink href="/register">
          <Strong>Sign up</Strong>
        </TextLink>{' '}
        or{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
