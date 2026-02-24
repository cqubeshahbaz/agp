'use client'

import { useAuth } from './auth-context'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './button'
import { Text } from './text'

export default function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const redirectTarget = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(redirectTarget)
    }
  }, [status, router, redirectTarget])

  if (status === 'loading') {
    return (
      <div className="container py-16">
        <Text className="text-zinc-500 text-center">Loading your account...</Text>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container py-16 vh-100 flex flex-col items-center justify-center text-center">
        <Text className="text-zinc-500">Please sign in to view this page.</Text>
        <div className="mt-6">
          <Button href={redirectTarget}>Sign in</Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}``