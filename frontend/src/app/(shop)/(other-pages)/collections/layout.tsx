import { Suspense } from 'react'
import AsideCategoryFilters from '@/components/aside-category-filters'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <AsideCategoryFilters />
      </Suspense>
    </>
  )
}

export default Layout
