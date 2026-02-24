import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import {
  getProductByHandle,
  getRelatedProducts,
} from '@/data'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FeaturedSection from '../featured-section'
import ProductDetailContent from '../product-detail-content'
import { ProductForm } from '../product-form'
import { ProductGallery } from '../product-gallery'
import ProductRelatedSection from '../product-related-section'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) {
    return {
      title: 'Product not found',
      description: 'Product not found',
    }
  }

  const { title, description } = product
  return { title, description }
}

export default async function Product({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product?.id) {
    return notFound()
  }

  const relatedProducts = await getRelatedProducts(product.handle, 5)

  const { images, description } = product

  return (
    <div className={clsx('product-page relative space-y-12 sm:space-y-16')}>
      <div className="absolute inset-x-0 -top-px z-10 h-px bg-white"></div>

      <main className="container">
        <div className="lg:flex">
          {/* Galleries */}
          <div className="relative w-full lg:w-1/2">
            <div className="sticky top-0">
              <ProductGallery media={images} />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full pt-10 lg:w-1/2 lg:pt-16 lg:pl-10 xl:pl-14 2xl:pl-16">
            <div className="sticky top-16">
              {/* Heading, Price, Options,...  */}
              <ProductForm product={product} />

              {/* {combineProduct ? (
                <div className="mt-10 rounded-lg bg-zinc-100 p-5">
                  <Text className="mb-3 font-semibold">PAIR IT WITH</Text>
                  <ProductCardHorizontal product={combineProduct} />
                </div>
              ) : null} */}

              <FeaturedSection className="mt-10 lg:mt-16" />
            </div>
          </div>
        </div>

        <Divider className="my-16 sm:my-24 lg:my-28" />

        {/* THE CONTENT OF PRODUCT  */}
        <Heading bigger className="text-center">
          <span data-slot="italic">All about the</span> <br />
          <span>PRODUCT</span>
        </Heading>

        <div className="mt-14 lg:mt-16 xl:mt-20">
          <ProductDetailContent
            content={description}
            imageSrc={product.featured_image?.src}
          />
        </div>

        <Divider className="my-16 sm:my-24 lg:my-28" />

        {/* RELATED PRODUCT */}
        {relatedProducts ? <ProductRelatedSection products={relatedProducts} /> : null}
      </main>
    </div>
  )
}
