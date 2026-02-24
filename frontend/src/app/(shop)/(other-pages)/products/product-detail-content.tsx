import { Heading } from '@/components/heading'
import clsx from 'clsx'
import Image from 'next/image'

interface ProductDetailContentProps {
  className?: string
  content: string
  imageSrc?: string
  imageAlt?: string
}

const ProductDetailContent = ({ content, className, imageAlt, imageSrc }: ProductDetailContentProps) => {
  return (
    <div className={clsx('max-w-none', className)}>
      <div className="flex flex-col-reverse justify-between gap-14 lg:flex-row lg:gap-12 xl:gap-20 2xl:gap-32">
        <div className="flex flex-3/7">
          <Image
            src={imageSrc || '/placeholder.webp'}
            width={494}
            height={529}
            alt={imageAlt || 'product-detail-content'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="w-full object-cover"
          />
        </div>

        <div className="flex flex-4/7 flex-col gap-5 lg:gap-10 2xl:gap-14">
          <Heading>
            <span>Details &</span>
            <br />
            <span data-slot="italic">features</span>
          </Heading>

          <div className="max-w-xl leading-relaxed">
            <div className="space-y-8">
              <div>
                <p>
                  Every jewelry piece is crafted for lasting brilliance. We focus on premium finishing, balanced
                  proportions, and everyday comfort so your signature pieces feel as good as they look.
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm text-zinc-500 uppercase">Product Details</p>
                <ul className="list-inside list-disc *:marker:text-zinc-300">
                  <li>Crafted with high-precision jewelry finishing.</li>
                  <li>Durable design suitable for regular wear.</li>
                  <li>Comfort-focused fit and balanced weight.</li>
                  <li>Ideal for gifting or personal collections.</li>
                  <li>Easy maintenance with proper care.</li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-sm text-zinc-500 uppercase">Product Features</p>
                <ul className="list-inside list-disc *:marker:text-zinc-300">
                  <li>Clean polish and refined handcrafted details.</li>
                  <li>Timeless styling for formal and daily looks.</li>
                  <li>Secure and comfortable fit.</li>
                  <li>Built to retain shine with proper storage.</li>
                  <li>Available in multiple designs and categories.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailContent
