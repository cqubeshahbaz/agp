'use client'

import { Logo } from '@/app/logo'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { createContext, type ReactNode, useContext, useState } from 'react'

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Aside({
  heading,
  logoOnHeading = false,
  openFrom = 'right',
  children,
  type,
  contentMaxWidthClassName = 'max-w-lg',
}: {
  heading?: string
  logoOnHeading?: boolean
  openFrom: 'right' | 'left'
  children: React.ReactNode
  type: AsideType
  contentMaxWidthClassName?: string
}) {
  const { type: activeType, close } = useAside()
  const open = type === activeType

  const onClose = close

  const hasHeading = !!heading || logoOnHeading

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={open}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/50 duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className={clsx('fixed inset-y-0 flex max-w-full', openFrom === 'right' && 'right-0')}>
            <DialogPanel
              transition
              className={clsx(
                contentMaxWidthClassName,
                'h-screen w-screen translate-x-0 overflow-hidden bg-white text-start align-middle shadow-xl ease-out data-leave:duration-300 data-leave:data-closed:translate-x-full',
                openFrom === 'left' && 'data-enter:duration-100 data-enter:data-closed:-translate-x-full',
                openFrom === 'right' && 'data-enter:duration-100 data-enter:data-closed:translate-x-full'
              )}
            >
              <div className="flex h-full flex-col px-4 md:px-8">
                <header
                  className={`flex h-16 flex-shrink-0 items-center border-b border-zinc-900/10 md:h-20 ${
                    hasHeading ? 'justify-between' : 'justify-end'
                  }`}
                >
                  {hasHeading && (
                    <>
                      {!!heading && !logoOnHeading && (
                        <DialogTitle>
                          <span className="font-serif text-2xl font-medium">{heading}</span>
                        </DialogTitle>
                      )}
                      {logoOnHeading && <Logo />}
                    </>
                  )}

                  <button type="button" className="group -m-4 cursor-pointer p-4" onClick={onClose}>
                    <HugeiconsIcon
                      className="transition-transform duration-200 group-hover:rotate-90"
                      icon={Cancel01Icon}
                      size={24}
                      strokeWidth={1}
                    />
                  </button>
                </header>
                <div className="flex-1 overflow-hidden">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

/* Use for associating arialabelledby with the title*/
Aside.Title = DialogTitle

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault)

  function openDrawer() {
    setIsOpen(true)
  }

  function closeDrawer() {
    setIsOpen(false)
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  }
}

type AsideType = 'search' | 'cart' | 'mobile' | 'closed' | 'sidebar-navigation' | 'category-filters'
type AsideContextValue = {
  type: AsideType
  open: (mode: AsideType) => void
  close: () => void
}
//
const AsideContext = createContext<AsideContextValue | null>(null)

export function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed')

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  )
}

export function useAside() {
  const aside = useContext(AsideContext)
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider')
  }
  return aside
}
