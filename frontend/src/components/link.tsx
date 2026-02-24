'use client'

import * as Headless from '@headlessui/react'
import { useSingleClick } from '@/hooks/use-single-click'
import NextLink, { type LinkProps } from 'next/link'
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const closeHeadless = Headless.useClose()
  const { pending, beginNavigation } = useSingleClick({ resetOnRouteChange: true, fallbackMs: 15000 })

  return (
    <Headless.DataInteractive>
      <NextLink
        {...props}
        prefetch={props.prefetch ?? true}
        ref={ref}
        aria-disabled={pending}
        tabIndex={pending ? -1 : props.tabIndex}
        className={[props.className, pending ? 'pointer-events-none opacity-60' : ''].filter(Boolean).join(' ')}
        onMouseEnter={props.onMouseEnter}
        onFocus={props.onFocus}
        onClick={(e) => {
          if (pending) {
            e.preventDefault()
            e.stopPropagation()
            return
          }

          if (props.onClick) {
            props.onClick(e)
          }

          if (e.defaultPrevented) {
            return
          }

          if (props.target && props.target !== '_self') {
            return
          }

          const isModifierClick =
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || ('button' in e && typeof e.button === 'number' && e.button !== 0)
          if (isModifierClick) {
            return
          }

          if (props.href && typeof props.href === 'string' && props.href.startsWith('#')) {
            return
          }

          if (props['data-no-click-lock'] !== undefined) {
            closeHeadless()
            return
          }

          const started = beginNavigation(() => {
            closeHeadless()
          })
          if (!started) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      />
    </Headless.DataInteractive>
  )
})
