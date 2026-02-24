import CollectionPage from './[handle]/page'

const Collections = async ({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; category?: string; purity?: string; price?: string; sort?: string }>
}) => {
  return CollectionPage({
    params: Promise.resolve({ handle: 'all' }),
    searchParams,
  })
}

export default Collections