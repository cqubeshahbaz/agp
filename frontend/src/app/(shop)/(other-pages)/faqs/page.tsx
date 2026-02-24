import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import ProductFaqsSection from '../products/product-faqs-section'

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about orders, shipping, and returns.',
}

const faqs = [
  {
    question: 'What is the delivery time?',
    answer: 'Orders usually arrive within 3–7 business days, depending on your location.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Go to My Account → Orders to view tracking updates and order status.',
  },
  {
    question: 'Can I cancel or change my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placing them.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 7 days of delivery in original condition.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, COD is available for most locations in India.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Use the Contact page or email us at support@example.com.',
  },
]

export default function FaqsPage() {
  return (
    <div className="container">
      <div className="mx-auto max-w-5xl py-16 sm:py-24">
        <Heading level={1} bigger>
          Frequently Asked <span data-slot="italic">Questions</span>
        </Heading>
        <Text className="mt-2 text-zinc-500">
          Quick answers to help you shop with confidence.
        </Text>

        <Divider className="my-10" />

        <ProductFaqsSection faqs={faqs} imageSrc="/images/jewelry/feature-6.webp" imageAlt="faqs" />
      </div>
      <Divider />
    </div>
  )
}

