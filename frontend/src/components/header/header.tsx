import { Logo } from '@/app/logo'
import { getProducts } from '@/data'
import clsx from 'clsx'
import Link from 'next/link'
import { TextLink } from '../text'
import CartIconBtn from './cart-icon-btn'
import DropdownMenuPopover from './dropdown-menu-popover'
import HamburgerIconMenu from './hamburger-icon-menu'
import MegaMenuPopover, { MegaMenuPopoverProps } from './mega-menu-popover'
import SearchIconPopover from './search-icon-popover'
import UserIconPopover from './user-icon-popover'

/* ------------------ MEGA MENU DATA ------------------ */

const mega_menus = [
  {
    name: 'Jewelry',
    href: '#',
    children: [
      { name: 'Rings', href: '/collections/rings' },
      { name: 'Necklaces', href: '/collections/necklaces' },
      { name: 'Bracelets', href: '/collections/bracelets' },
      { name: 'Earrings', href: '/collections/earrings' },
      { name: 'All Jewelry', href: '/collections/all' },
    ],
  },
  {
    name: 'Collections',
    href: '#',
    children: [
      { name: 'Bridal Collection', href: '/collections/bridal' },
      { name: '22K Gold Jewelry', href: '/collections/22k-gold' },
      { name: 'Diamond Jewelry', href: '/collections/diamond' },
      { name: 'Daily Wear', href: '/collections/daily-wear' },
    ],
  },
]

/* ------------------ HELP MENU ------------------ */

const help_menu = [
  { name: 'About Us', href: '/about-us' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Track Order', href: '/orders' },
]

/* ------------------ TYPES ------------------ */

interface HeaderProps {
  className?: string
  hasBottomBorder?: boolean
  variant?: 'default' | 'bg-transparent-text-white'
  megamenuVariant?: MegaMenuPopoverProps['variant']
}

/* ------------------ COMPONENT ------------------ */

const Header = async ({
  className,
  hasBottomBorder = true,
  variant = 'default',
  megamenuVariant,
}: HeaderProps) => {
  const featuredProducts = await getProducts(4)

  return (
    <header
      className={clsx(
        className,
        'group z-10 w-full',
        variant === 'default' && 'relative',
        variant === 'bg-transparent-text-white' &&
        'absolute inset-x-0 top-0 bg-transparent text-white transition-colors duration-300 has-[.bitpan-popover-full-panel]:text-zinc-950'
      )}
    >
      <nav aria-label="Global" className="container">
        <div
          className={clsx(
            'flex items-center justify-between border-zinc-950/10 py-6 dark:border-white/10 ',
            hasBottomBorder && ' ',
            !hasBottomBorder && 'has-[.bitpan-popover-full-panel]: '
          )}
        >
          {/* LOGO */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Jewelry Store</span>
              <Logo />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex lg:gap-x-8">
            <TextLink href="/">Home</TextLink>

            <MegaMenuPopover
              megamenu={mega_menus}
              featuredProducts={featuredProducts}
              rightImage={{
                src: '/images/menu-jewelry.webp',
                alt: 'Fine Jewelry Collection',
              }}
              variant={megamenuVariant}
            >
              Shop Jewelry
            </MegaMenuPopover>

            <TextLink href="/collections/new-arrivals">
              New Arrivals
            </TextLink>

            <DropdownMenuPopover dropdownMenu={help_menu}>
              Help
            </DropdownMenuPopover>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex flex-1 justify-end gap-x-2.5 md:gap-x-4 xl:gap-x-5">
            <HamburgerIconMenu />
            <SearchIconPopover />
            <UserIconPopover />
            <CartIconBtn />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header