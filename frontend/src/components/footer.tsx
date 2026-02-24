import { Logo } from '@/app/logo'
import clsx from 'clsx'
import Link from 'next/link'
import { Text } from './text'

const footerLinks = {
  shop: [
    { name: 'All Collections', href: '/collections/all' },
    { name: 'New Arrivals', href: '/collections/new-arrivals' },
    { name: 'Best Sellers', href: '/collections/all?sort=best-selling' },
    { name: 'Track Order', href: '/orders' },
  ],
  help: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping & Returns', href: '/faqs' },
    { name: 'My Account', href: '/settings' },
  ],
  company: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ],
}

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={clsx('bg-white pb-8', className)}>
      <div className="grid gap-10 border-t border-zinc-900/10 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <Text className="mt-4 max-w-sm text-zinc-600">
            Fine jewelry crafted for everyday elegance and special moments. Secure checkout and trusted delivery.
          </Text>
          <div className="mt-5 space-y-1.5 text-sm text-zinc-600 uppercase">
            <p>Email: support@bitpan.com</p>
            <p>Phone: +1 (800) 123-4567</p>
            <p>Mon - Sat: 10:00 AM - 7:00 PM</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          <div>
            <Text className="text-sm/6 font-medium">Shop</Text>
            <ul role="list" className="mt-4 space-y-2.5">
              {footerLinks.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm/6 text-zinc-600 uppercase hover:text-zinc-900">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Text className="text-sm/6 font-medium">Help</Text>
            <ul role="list" className="mt-4 space-y-2.5">
              {footerLinks.help.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm/6 text-zinc-600 uppercase hover:text-zinc-900">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Text className="text-sm/6 font-medium">Company</Text>
            <ul role="list" className="mt-4 space-y-2.5">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm/6 text-zinc-600 uppercase hover:text-zinc-900">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-900/10 pt-6 md:flex md:items-center md:justify-between">
        <Text className="text-xs text-zinc-600 uppercase">
          Secure payments with major cards and trusted checkout.
        </Text>
        <Text className="mt-2 text-xs text-zinc-600 uppercase md:mt-0">
          &copy; {currentYear} BitPan. All rights reserved.
        </Text>
      </div>
    </footer>
  )
}
