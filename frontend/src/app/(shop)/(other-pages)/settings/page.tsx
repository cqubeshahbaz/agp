import AuthGate from '@/components/auth-gate'
import type { Metadata } from 'next'
import SettingsForm from './settings-form'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings.',
}

export default function Settings() {
  return (
    <AuthGate>
      <SettingsForm />
    </AuthGate>
  )
}
