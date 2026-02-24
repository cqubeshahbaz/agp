'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type UseSingleClickOptions = {
  resetOnRouteChange?: boolean
  fallbackMs?: number
}

export function useSingleClick(options: UseSingleClickOptions = {}) {
  const { resetOnRouteChange = false, fallbackMs = 15000 } = options
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams])

  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const startedRouteKeyRef = useRef<string | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const unlock = useCallback(() => {
    pendingRef.current = false
    setPending(false)
    startedRouteKeyRef.current = null
    clearTimer()
  }, [clearTimer])

  const lock = useCallback(() => {
    if (pendingRef.current) return false
    pendingRef.current = true
    setPending(true)
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      unlock()
    }, fallbackMs)
    return true
  }, [clearTimer, fallbackMs, unlock])

  const runAsync = useCallback(
    async <T,>(action: () => Promise<T>) => {
      if (!lock()) return undefined
      try {
        return await action()
      } finally {
        unlock()
      }
    },
    [lock, unlock]
  )

  const beginNavigation = useCallback(
    (navigate?: () => void) => {
      if (!lock()) return false
      startedRouteKeyRef.current = routeKey
      try {
        navigate?.()
        return true
      } catch (error) {
        unlock()
        throw error
      }
    },
    [lock, routeKey, unlock]
  )

  useEffect(() => {
    if (!resetOnRouteChange) return
    if (!pendingRef.current) return
    if (!startedRouteKeyRef.current) return
    if (routeKey !== startedRouteKeyRef.current) {
      unlock()
    }
  }, [resetOnRouteChange, routeKey, unlock])

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return { pending, runAsync, beginNavigation, unlock }
}

