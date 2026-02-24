import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our website and services.',
}

const sections = [
  {
    title: 'Overview',
    body:
      'By accessing our website or placing an order, you agree to these Terms of Service. If you do not agree, please do not use the site.',
  },
  {
    title: 'Orders & Payments',
    body:
      'All orders are subject to availability and confirmation. Prices may change without notice. Payment must be completed before orders ship.',
  },
  {
    title: 'Shipping & Delivery',
    body:
      'We aim to deliver orders within the estimated time shown at checkout. Delays may occur due to carrier or operational issues.',
  },
  {
    title: 'Returns & Refunds',
    body:
      'Items can be returned within 7 days of delivery in original condition. Refunds are processed after inspection.',
  },
  {
    title: 'Account Responsibility',
    body:
      'You are responsible for maintaining the confidentiality of your account and password.',
  },
  {
    title: 'Limitation of Liability',
    body:
      'We are not liable for indirect or consequential damages arising from the use of our products or services.',
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="container">
      <div className="mx-auto max-w-3xl py-16 sm:py-24">
        <Heading level={1} bigger>
          Terms <span data-slot="italic">of Service</span>
        </Heading>
        <Text className="mt-2 text-zinc-500">
          Please read these terms carefully before using our services.
        </Text>

        <Divider className="my-10" />

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <Heading level={2} className="text-lg">
                {section.title}
              </Heading>
              <Text className="mt-3 text-zinc-600">{section.body}</Text>
            </section>
          ))}
        </div>

        <Divider className="my-10" />

        <Text className="text-xs text-zinc-500">
          Last updated: February 10, 2026.
        </Text>
      </div>
    </div>
  )
}
