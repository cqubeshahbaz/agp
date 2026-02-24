import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Choose a new password for your account.',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
