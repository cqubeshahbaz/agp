import type { Metadata } from 'next'
import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Choose a new password for your account.',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
