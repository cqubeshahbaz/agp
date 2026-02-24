import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { Button } from '../button'
import { Heading } from '../heading'
import StarSvg from '../star-svg'
import { Text } from '../text'

interface HeroSection2Props {
  className?: string
}

const HeroSection2 = ({ className }: HeroSection2Props) => {
  return (
    <div className={className}>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-between bg-[#e1a659b8] sm:flex-row">
        <div className="flex-3/5 self-end py-16 pr-6 pl-container xl:pb-20">
          <div className="max-w-2xl">
            <StarSvg width={48} height={48} />
            <Heading fontSize="text-5xl/none md:text-6xl/none lg:text-7xl/none font-semibold" className="mt-8">
              <span data-slot="italic">Diamonds</span> & Jewellery  <span data-slot="italic">Collection.</span>
            </Heading>
            <Text className="mt-8 max-w-sm">
              Give a contemporary spin on classic diamonds this season.
              Crafted to shine with you.
            </Text>
            <Button
              href={'/collections/all'}
              color="white"
              className="mt-16 w-full max-w-4xl cursor-pointer border-white py-5 font-medium tracking-wide underline sm:py-6"
            >
              Explore all Collection
              <div className="absolute right-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white sm:h-12 sm:w-12">
                <ArrowUpRightIcon className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>

        <div className="relative flex-2/5">
          <Image
            src={'/images/jewelry/hero-banner.jpg'}
            alt="hero"
            className="object-cover object-center sm:absolute sm:h-full sm:w-full"
            width={815}
            height={987}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 50vw"
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection2


