import type { Metadata } from 'next'
import RegisterForm from './register-form'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to start shopping.',
}

export default function RegisterPage() {
  return <RegisterForm />
}
