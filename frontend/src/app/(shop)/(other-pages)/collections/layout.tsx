import AsideCategoryFilters from '@/components/aside-category-filters'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <AsideCategoryFilters />
    </>
  )
}

export default Layout