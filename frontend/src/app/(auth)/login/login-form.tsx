'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { useAuth } from '@/components/auth-context'
import { Field, Label } from '@/components/fieldset'
import { useSingleClick } from '@/hooks/use-single-click'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/toast'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const { pending, runAsync, beginNavigation } = useSingleClick({ resetOnRouteChange: true, fallbackMs: 15000 })
  const redirectParam = searchParams.get('redirect')
  const redirectTo = useMemo(
    () => (redirectParam && redirectParam.startsWith('/') ? redirectParam : '/'),
    [redirectParam]
  )

  useEffect(() => {
    router.prefetch(redirectTo)
  }, [router, redirectTo])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    setError(null)
    const result = await runAsync(async () => login({ email, password, remember }))
    if (!result) return

    if (!result.ok) {
      setError(result.error ?? 'Unable to sign in.')
      toast(result.error ?? 'Unable to sign in.', { variant: 'error' })
      return
    }

    toast('Signed in successfully.', { variant: 'success' })
    setRedirecting(true)
    beginNavigation(() => router.replace(redirectTo))
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <h1 className="sr-only">Login to your account</h1>

      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">
          Login to your account to access your order history and other personalized features.
        </Text>
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
      <Field>
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
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
      <div className="flex flex-wrap items-center justify-between gap-1">
        <CheckboxField>
          <Checkbox name="remember" checked={remember} onChange={setRemember} />
          <Label>Remember me</Label>
        </CheckboxField>
        <TextLink href="/forgot-password">
          <span className="text-sm font-medium">Forgot password?</span>
        </TextLink>
      </div>
      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
      {redirecting ? <Text className="text-sm text-zinc-500">Redirecting...</Text> : null}
      <Button type="submit" className="w-full" disabled={pending || redirecting} aria-disabled={pending || redirecting}>
        {pending ? 'Processing...' : redirecting ? 'Redirecting...' : 'Login'}
      </Button>
      <Text>
        Don&apos;t have an account?{' '}
        <TextLink href="/register">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
