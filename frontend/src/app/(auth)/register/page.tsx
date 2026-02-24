import type { Metadata } from 'next'
import { Suspense } from 'react'
import RegisterForm from './register-form'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to start shopping.',
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
