import type { Metadata } from 'next'
import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your password to regain access to your account.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
