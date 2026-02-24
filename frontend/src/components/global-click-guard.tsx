'use client'

import { useEffect } from 'react'

const LOCK_WINDOW_MS = 900

export default function GlobalClickGuard() {
  useEffect(() => {
    let lastElement: Element | null = null
    let lockedUntil = 0

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const clickable = target.closest('a,button,[role="button"]')
      if (!clickable) return
      if (clickable.hasAttribute('data-no-click-lock')) return

      const now = Date.now()
      if (lastElement === clickable && now < lockedUntil) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return
      }

      lastElement = clickable
      lockedUntil = now + LOCK_WINDOW_MS
    }

    document.addEventListener('click', onClickCapture, true)
    return () => {
      document.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  return null
}

