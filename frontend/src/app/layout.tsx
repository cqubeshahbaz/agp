import Aside from '@/components/aside'
import { AuthProvider } from '@/components/auth-context'
import { CartProvider } from '@/components/cart-context'
import { ToastProvider } from '@/components/toast'
import { WishlistProvider } from '@/components/wishlist-context'
import { getGlobalSettings } from '@/lib/strapi-content'
import '@/styles/tailwind.css'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'

const dm_sans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-dm-sans',
})
const playfair_display = Playfair_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  style: 'italic',
  variable: '--font-playfair-display',
})

const fallbackMetadata: Metadata = {
  title: {
    template: '%s - Bitpan',
    default: 'Bitpan',
  },
  description:
    'Bitpan is a modern and elegant template for Next.js, Tailwind CSS, and TypeScript. It is designed to be simple and easy to use, with a focus on performance and accessibility.',
  keywords: [
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
    'Bipan',
    'Headless UI',
    'Fashion',
    'Hijab',
    'Skincare',
    'E-commerce',
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobalSettings()
  if (!global) return fallbackMetadata

  return {
    ...fallbackMetadata,
    title: {
      template: `%s - ${global.siteName || 'Bitpan'}`,
      default: global.siteName || 'Bitpan',
    },
    description: global.siteDescription || fallbackMetadata.description,
    icons: global.faviconUrl ? { icon: global.faviconUrl } : undefined,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        'text-zinc-950 antialiased dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950',
        dm_sans.variable,
        playfair_display.variable
      )}
    >
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Aside.Provider>{children}</Aside.Provider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
