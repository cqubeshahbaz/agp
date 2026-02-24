import { getStrapiUrl } from './strapi'

const TOKEN_KEY = 'agp_strapi_jwt'

type StrapiAuthUser = {
  id: number
  username?: string
  email?: string
  phone?: string
  country?: string
}

type StrapiAuthResponse = {
  jwt: string
  user: StrapiAuthUser
}

function getHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function getNetworkErrorMessage() {
  return 'Unable to connect to auth server. Check backend/CORS or disable conflicting browser extensions.'
}

function mapLoginErrorMessage(message?: string) {
  const normalized = String(message || '').toLowerCase()
  if (normalized.includes('invalid identifier or password')) {
    return 'User not found.'
  }
  return message || 'Unable to sign in.'
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null, remember = true) {
  if (typeof window === 'undefined') return
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.removeItem(TOKEN_KEY)
    return
  }

  if (remember) {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.sessionStorage.removeItem(TOKEN_KEY)
    return
  }

  window.sessionStorage.setItem(TOKEN_KEY, token)
  window.localStorage.removeItem(TOKEN_KEY)
}

export async function strapiLogin(input: { email: string; password: string }) {
  try {
    const response = await fetch(`${getStrapiUrl()}/api/auth/local`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier: input.email, password: input.password }),
    })

    const data = (await response.json().catch(() => ({}))) as Partial<StrapiAuthResponse> & {
      error?: { message?: string }
    }
    if (!response.ok || !data.jwt || !data.user) {
      return { ok: false as const, error: mapLoginErrorMessage(data.error?.message) }
    }

    return { ok: true as const, jwt: data.jwt, user: data.user }
  } catch {
    return { ok: false as const, error: getNetworkErrorMessage() }
  }
}

export async function strapiRegister(input: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  try {
    const response = await fetch(`${getStrapiUrl()}/api/auth/local/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: input.name,
        email: input.email,
        password: input.password,
        phone: input.phone,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as Partial<StrapiAuthResponse> & {
      error?: { message?: string }
    }
    if (!response.ok || !data.jwt || !data.user) {
      return { ok: false as const, error: data.error?.message || 'Unable to create account.' }
    }

    return { ok: true as const, jwt: data.jwt, user: data.user }
  } catch {
    return { ok: false as const, error: getNetworkErrorMessage() }
  }
}

export async function strapiMe(token: string) {
  try {
    const response = await fetch(`${getStrapiUrl()}/api/account/me`, {
      method: 'GET',
      headers: getHeaders(token),
    })

    if (response.ok) {
      return (await response.json()) as StrapiAuthUser
    }

    const fallback = await fetch(`${getStrapiUrl()}/api/users/me`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    if (!fallback.ok) return null
    return (await fallback.json()) as StrapiAuthUser
  } catch {
    return null
  }
}

export async function strapiForgotPassword(email: string) {
  try {
    const response = await fetch(`${getStrapiUrl()}/api/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    })
    const data = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    if (!response.ok) {
      return { ok: false as const, error: data.error?.message || 'Unable to send reset link.' }
    }
    return { ok: true as const }
  } catch {
    return { ok: false as const, error: getNetworkErrorMessage() }
  }
}

export async function strapiResetPassword(token: string, password: string) {
  try {
    const response = await fetch(`${getStrapiUrl()}/api/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        code: token,
        password,
        passwordConfirmation: password,
      }),
    })
    const data = (await response.json().catch(() => ({}))) as { error?: { message?: string } }
    if (!response.ok) {
      return { ok: false as const, error: data.error?.message || 'Unable to reset password.' }
    }
    return { ok: true as const }
  } catch {
    return { ok: false as const, error: getNetworkErrorMessage() }
  }
}
