import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your data.',
}

const sections = [
  {
    title: 'Information We Collect',
    body:
      'We collect information you provide at checkout or account creation, such as name, email, phone number, and shipping address. We also collect order history and support messages to provide better service.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'We use your information to process orders, deliver products, send order updates, and provide customer support. We may also send product updates if you opt in.',
  },
  {
    title: 'Payments',
    body:
      'Payments are handled by trusted third‑party processors. We do not store full card details on our servers.',
  },
  {
    title: 'Sharing Your Information',
    body:
      'We only share data with shipping carriers and payment providers necessary to fulfill your order. We do not sell personal information.',
  },
  {
    title: 'Data Retention',
    body:
      'We keep account and order information for as long as your account is active or as needed to comply with legal obligations.',
  },
  {
    title: 'Your Choices',
    body:
      'You can update your profile and address details in Account Settings. You can also request data deletion by contacting support.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="container">
      <div className="mx-auto max-w-3xl py-16 sm:py-24">
        <Heading level={1} bigger>
          Privacy <span data-slot="italic">Policy</span>
        </Heading>
        <Text className="mt-2 text-zinc-500">
          We respect your privacy and are committed to protecting your personal data.
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
