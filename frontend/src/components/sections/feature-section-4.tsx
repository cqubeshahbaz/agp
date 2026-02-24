import { AiIdeaIcon, BoatIcon, CoinsDollarIcon, Mailbox01Icon, Plant03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { Text } from '../text'

const data = [
  {
    id: 1,
    title: 'CRAFTED TO LAST A LIFETIME',
    description:
      'Expertly handcrafted using certified precious metals and stones, designed to be cherished for generations.',
    icon: AiIdeaIcon,
  },
  {
    id: 2,
    title: 'SECURE WORLDWIDE DELIVERY',
    description:
      'Insured, trackable shipping to your doorstep with careful packaging for complete peace of mind.',
    icon: BoatIcon,
  },
  {
    id: 3,
    title: 'PERSONAL JEWELRY CARE',
    description:
      'Our specialists are always here to help. Reach us at <span class="underline">support@bitpan.com</span>.',
    icon: Mailbox01Icon,
  },
  {
    id: 4,
    title: 'EASY & FLEXIBLE PAYMENTS',
    description:
      'Split your purchase into easy installments with ShopPay or Afterpay — zero hidden charges.',
    icon: CoinsDollarIcon,
  },
  {
    id: 5,
    title: 'ETHICALLY SOURCED',
    description:
      'Responsibly sourced materials and sustainable practices — beauty that respects the planet.',
    icon: Plant03Icon,
  },
]

interface FeatureSection4Props {
  className?: string
}

const FeatureSection4 = ({ className }: FeatureSection4Props) => {
  return (
    <div className={clsx('grid grid-cols-1 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5', className)}>
      {data.map((item, index, arr) => (
        <div
          key={item.id}
          className={clsx(
            'flex-col gap-2 border border-zinc-100 border-l-transparent px-4 py-5 sm:px-8 sm:py-10',
            index === arr.length - 1 ? 'sm:border-r-transparent' : 'bg-white'
          )}
        >
          <Text className="text-zinc-500">({index + 1})</Text>
          <Text className="mt-2 font-medium">{item.title}</Text>
          <HugeiconsIcon icon={item.icon} size={40} className="mt-10 text-zinc-700 sm:mt-14" strokeWidth={1} />
          <Text
            className="mt-4 line-clamp-3 text-zinc-500"
            dangerouslySetInnerHTML={{ __html: item.description }}
          ></Text>
        </div>
      ))}
    </div>
  )
}

export default FeatureSection4
