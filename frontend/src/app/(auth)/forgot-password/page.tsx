import type { Metadata } from 'next'
import { Suspense } from 'react'
import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your password to regain access to your account.',
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
