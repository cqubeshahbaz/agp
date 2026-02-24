'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  FavouriteIcon,
  Logout01Icon,
  Settings03Icon,
  ShoppingBasket01Icon,
  UserCircleIcon,
  UserListIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuth } from '../auth-context'
import { useSingleClick } from '@/hooks/use-single-click'
import { Text, TextLink } from '../text'
import { useRouter } from 'next/navigation'
import { useToast } from '../toast'

const signedInMenu = [
  { name: 'My account', href: '/account', icon: UserListIcon },
  { name: 'Account settings', href: '/settings', icon: Settings03Icon },
  { name: 'Orders', href: '/orders', icon: ShoppingBasket01Icon },
  { name: 'Wishlist', href: '/wishlist', icon: FavouriteIcon },
]

const signedOutMenu = [
  { name: 'Sign in', href: '/login', icon: UserCircleIcon },
  { name: 'Register', href: '/register', icon: UserListIcon },
]

export interface UserIconPopoverProps {}

const UserIconPopover = ({}: UserIconPopoverProps) => {
  const router = useRouter()
  const { status, user, logout } = useAuth()
  const { toast } = useToast()
  const { pending: loggingOut, beginNavigation } = useSingleClick({ resetOnRouteChange: true, fallbackMs: 15000 })
  const isAuthenticated = status === 'authenticated'
  const menu = isAuthenticated ? signedInMenu : signedOutMenu

  const handleLogout = () => {
    if (loggingOut) return
    beginNavigation(() => {
      logout()
      toast('Signed out.', { variant: 'success' })
      router.push('/')
    })
  }

  return (
    <Popover className="relative">
      <PopoverButton className="-m-2.5 flex cursor-pointer items-center justify-center p-2.5 focus-visible:outline-0">
        <HugeiconsIcon icon={UserCircleIcon} size={24} color="currentColor" strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute top-full -right-5 -z-10 mt-6 flex w-56 flex-col gap-y-0.5 bg-white px-2.5 pt-6 pb-5 text-zinc-950 shadow-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        {isAuthenticated && user?.email ? (
          <Text className="px-2 py-2 text-xs text-zinc-500">Signed in as {user.email}</Text>
        ) : null}
        {menu.map((item) => (
          <TextLink
            href={item.href}
            key={item.name}
            className="flex items-center gap-x-3.5 px-2 py-2 hover:bg-zinc-50 sm:gap-x-5 sm:px-3 dark:hover:bg-zinc-900"
          >
            <HugeiconsIcon icon={item.icon} size={20} color="currentColor" strokeWidth={1} />
            <Text>{item.name}</Text>
          </TextLink>
        ))}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-x-3.5 px-2 py-2 text-left text-sm/6 uppercase hover:bg-zinc-50 sm:gap-x-5 sm:px-3 dark:hover:bg-zinc-900 cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-60"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} color="currentColor" strokeWidth={1} />
            <Text>{loggingOut ? 'Signing out...' : 'Sign out'}</Text>
          </button>
        ) : null}
      </PopoverPanel>
    </Popover>
  )
}

export default UserIconPopover
