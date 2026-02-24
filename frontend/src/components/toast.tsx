'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type ToastVariant = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (message: string, options?: { variant?: ToastVariant; durationMs?: number }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

function createToastId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutsRef = useRef(new Map<string, number>())

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      window.clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message: string, options?: { variant?: ToastVariant; durationMs?: number }) => {
      const id = createToastId()
      const variant = options?.variant ?? 'info'
      const durationMs = options?.durationMs ?? 2600

      setToasts((current) => [...current, { id, message, variant }])

      const timeout = window.setTimeout(() => {
        removeToast(id)
      }, durationMs)
      timeoutsRef.current.set(id, timeout)
    },
    [removeToast]
  )

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout))
      timeouts.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={clsx(
              'pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
              toastItem.variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
              toastItem.variant === 'error' && 'border-rose-200 bg-rose-50 text-rose-950',
              toastItem.variant === 'info' && 'border-zinc-200 bg-white text-zinc-900'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="leading-5">{toastItem.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toastItem.id)}
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:text-zinc-900"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
