import CollectionPage from '../collections/[handle]/page'

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; category?: string; purity?: string; price?: string; sort?: string }>
}) => {
  return CollectionPage({
    params: Promise.resolve({ handle: 'all' }),
    searchParams,
  })
}

export default Page

