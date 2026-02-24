import AsideSidebarCart from '@/components/aside-sidebar-cart'
import AsideSidebarNavigation from '@/components/aside-sidebar-navigation'
import Footer from '@/components/footer'
import Header from '@/components/header/header'
import FeatureSection4 from '@/components/sections/feature-section-4' 
import React, { ReactNode } from 'react'
interface ComponentProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

const ApplicationLayout: React.FC<ComponentProps> = ({ children, header, footer }) => {
  return (
    <div>
      {/* HEADER */}
      {header ? header : <Header />}

      {/* MAIN CONTENT */}
      {children}
     
      <FeatureSection4 className="container mt-16 sm:mt-28 lg:mt-40" />

      {/* FOOTER */}
      {footer ? footer : <Footer className="container mt-16 sm:mt-28 lg:mt-32" />}

      {/* ASIDES */}
      <AsideSidebarNavigation />
      <AsideSidebarCart />
    </div>
  )
}

export { ApplicationLayout }