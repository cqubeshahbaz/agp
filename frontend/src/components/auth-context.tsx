'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getStoredToken,
  setStoredToken,
  strapiForgotPassword,
  strapiLogin,
  strapiMe,
  strapiRegister,
  strapiResetPassword,
} from '@/lib/strapi-auth'

export interface AuthUser {
  email: string
  name?: string
  country?: string
  phone?: string
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  login: (input: { email: string; password: string; remember: boolean }) => Promise<{ ok: boolean; error?: string }>
  register: (input: {
    email: string
    name: string
    password: string
    phone: string
    remember: boolean
  }) => Promise<{ ok: boolean; error?: string }>
  refresh: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string; token?: string }>
  resetPassword: (input: { token: string; password: string }) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'agp_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let ignore = false
    if (typeof window !== 'undefined') {
      const cached = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as AuthUser
          setUser(parsed)
          setStatus('authenticated')
        } catch {
          window.sessionStorage.removeItem(STORAGE_KEY)
        }
      }
    }
    const load = async () => {
      try {
        const token = getStoredToken()
        if (!token) {
          if (!ignore) {
            setUser(null)
            setStatus('unauthenticated')
          }
          return
        }
        const me = await strapiMe(token)
        if (!ignore) {
          if (me) {
            const mappedUser: AuthUser = {
              email: me.email || '',
              name: me.username,
              country: me.country,
              phone: me.phone,
            }
            setUser(mappedUser)
            setStatus('authenticated')
            if (typeof window !== 'undefined') {
              window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
            }
          } else {
            setUser(null)
            setStatus('unauthenticated')
            setStoredToken(null)
            if (typeof window !== 'undefined') {
              window.sessionStorage.removeItem(STORAGE_KEY)
            }
          }
        }
      } catch {
        if (!ignore) {
          setUser(null)
          setStatus('unauthenticated')
          setStoredToken(null)
          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(STORAGE_KEY)
          }
        }
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const token = getStoredToken()
      if (!token) {
        setUser(null)
        setStatus('unauthenticated')
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(STORAGE_KEY)
        }
        return
      }
      const me = await strapiMe(token)
      const mappedUser: AuthUser | null = me
        ? {
            email: me.email || '',
            name: me.username,
            country: me.country,
            phone: me.phone,
          }
        : null

      setUser(mappedUser)
      setStatus(mappedUser ? 'authenticated' : 'unauthenticated')
      if (typeof window !== 'undefined') {
        if (mappedUser) {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
        } else {
          window.sessionStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      setUser(null)
      setStatus('unauthenticated')
      setStoredToken(null)
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = useCallback(async ({ email, password, remember }: { email: string; password: string; remember: boolean }) => {
    if (!email.trim() || !password) {
      return { ok: false, error: 'Email and password are required.' }
    }

    const result = await strapiLogin({ email, password })
    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    setStoredToken(result.jwt, remember)
    const me = await strapiMe(result.jwt)
    const mappedUser: AuthUser = {
      email: me?.email || result.user.email || email.trim().toLowerCase(),
      name: me?.username || result.user.username,
      country: me?.country || result.user.country,
      phone: me?.phone || result.user.phone,
    }

    setUser(mappedUser)
    setStatus('authenticated')
    if (typeof window !== 'undefined') {
      if (remember) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
      } else {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
      }
    }
    return { ok: true }
  }, [])

  const register = useCallback(
    async ({
      email,
      name,
      password,
      phone,
      remember,
    }: {
      email: string
      name: string
      password: string
      phone: string
      remember: boolean
    }) => {
      if (!email.trim() || !name.trim() || !password || !phone.trim()) {
        return { ok: false, error: 'Please fill in all required fields.' }
      }

      const result = await strapiRegister({ email, name, password, phone })
      if (!result.ok) {
        return { ok: false, error: result.error }
      }

      setStoredToken(result.jwt, remember)
      const me = await strapiMe(result.jwt)
      const mappedUser: AuthUser = {
        email: me?.email || result.user.email || email.trim().toLowerCase(),
        name: me?.username || result.user.username || name,
        country: me?.country || result.user.country,
        phone: me?.phone || result.user.phone || phone,
      }

      setUser(mappedUser)
      setStatus('authenticated')
      if (typeof window !== 'undefined') {
        if (remember) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
        } else {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser))
        }
      }
      return { ok: true }
    },
    []
  )

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) {
      return { ok: false, error: 'Email is required.' }
    }

    const result = await strapiForgotPassword(email)
    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    return { ok: true }
  }, [])

  const resetPassword = useCallback(async ({ token, password }: { token: string; password: string }) => {
    if (!token || !password) {
      return { ok: false, error: 'Token and new password are required.' }
    }

    const result = await strapiResetPassword(token, password)
    if (!result.ok) {
      return { ok: false, error: result.error }
    }

    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setUser(null)
    setStatus('unauthenticated')
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, refresh, requestPasswordReset, resetPassword, logout }),
    [user, status, login, register, refresh, requestPasswordReset, resetPassword, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
