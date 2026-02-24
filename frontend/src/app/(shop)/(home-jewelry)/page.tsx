import FeatureSection1 from '@/components/sections/feature-section-1'
import FeatureSection2 from '@/components/sections/feature-section-2'
import FeatureSection5 from '@/components/sections/feature-section-5'
import HeroSection2 from '@/components/sections/hero-section-2'
import SectionCollectionCarousel from '@/components/sections/section-collection-carousel'
import SectionProductCarousel from '@/components/sections/section-product-carousel'
import { getCollections } from '@/data'
import clsx from 'clsx'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jewelry',
  description:
    'Discover handcrafted jewelry collections, signature pieces, and timeless designs.',
}

export const dynamic = 'force-static'
export const revalidate = 60

export default async function Home() {
  const collections = await getCollections('all')
  const groupCollections = collections.length
    ? [
        {
          id: 'strapi-group-1',
          title: 'Shop by Category',
          handle: 'all-categories',
          description: 'Collections from Strapi',
          collections,
        },
      ]
    : []

  return (
    <div>
      <HeroSection2 />

      <SectionCollectionCarousel className="container mt-20 sm:mt-28 lg:mt-28" groupCollections={groupCollections} />

      <FeatureSection1
        className="container mt-24 sm:mt-28 lg:mt-40"
        image1={{
          src: '/images/jewelry/feature-1.webp',
          width: 325,
          height: 335,
          alt: 'feature-1-1',
        }}
        image2={{
          src: '/images/jewelry/feature-6.webp',
          width: 495,
          height: 530,
          alt: 'feature-1-2',
        }}
        heading={`We Are here,<span data-slot="italic"> for you.</span>`}
      />

      <FeatureSection5 className="mt-24 sm:mt-28 lg:mt-40" />

      {collections?.map((collection, index) => (
          <SectionProductCarousel
            key={collection.handle}
            className={clsx('container', index === 0 ? 'mt-44' : 'mt-36')}
            products={collection.products}
            collectionTitle={collection?.title}
            collectionHandle={collection?.handle}
            collectionDescription={collection?.description}
          />
        ))}

      <FeatureSection2
        className="container mt-20 sm:mt-28 lg:mt-32"
        variant="up"
        heading={`Fine Craftsmanship <span data-slot="italic">Jewelry.</span>`}
        faqs={[
          {
            question: 'Radical Transparency',
            answer:
              "No black boxes, nothing to hide, we disclose our full formulas, so you will never have to guess what's in it and how much.",
          },
          {
            question: 'Clean, Beyond Reproach',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
          {
            question: 'Conscious & Responsible',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
          {
            question: 'Potent & Multi Tasking',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
        ]}
        image={{
          src: '/images/jewelry/feature-3.png',
          width: 662,
          height: 653,
          alt: 'jewelry-feature-3',
        }}
      />
    </div>
  )
}

