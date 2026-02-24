import { Text } from '@/components/text'
import { BoatIcon, FavouriteIcon, MoneyReceiveCircleIcon, Plant03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'

const data = [
  {
    title: '30 Days Return',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: MoneyReceiveCircleIcon,
  },
  {
    title: 'Free Shipping',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: BoatIcon,
  },
  {
    title: '100% Quality Guarantee',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: FavouriteIcon,
  },
  {
    title: 'Vegan & Cruelty Free',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: Plant03Icon,
  },
]

const FeaturedSection = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4', className)}>
      {data.map((item, index) => {
        return (
          <div key={item.title} className="flex flex-col items-center justify-start gap-5 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
              <HugeiconsIcon icon={item.icon} size={28} color="currencyColor" strokeWidth={1} />
            </div>
            <Text className="max-w-xs text-center leading-snug text-zinc-600">{item.title}</Text>
          </div>
        )
      })}
    </div>
  )
}

export default FeaturedSection
