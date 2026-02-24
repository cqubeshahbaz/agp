import clsx from 'clsx'
import Link from 'next/link'

const demoBreadcrumbs = [{ id: 1, name: 'Home', href: '/' }]

interface BreadcrumbProps {
  className?: string
  breadcrumbs?: { id: number; name: string; href: string }[]
  currentPage?: string
}

const Breadcrumb = ({ breadcrumbs = demoBreadcrumbs, className, currentPage = 'current page' }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={clsx('text-xs/6 font-medium', className)}>
      <ol role="list" className="flex flex-wrap items-center gap-2">
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.id}>
            <div className="flex items-center gap-x-2">
              <Link href={breadcrumb.href} className="text-zinc-900 uppercase">
                {breadcrumb.name}
              </Link>
              <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-zinc-300">
                <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
              </svg>
            </div>
          </li>
        ))}
        <li>
          <span aria-current="page" className="text-zinc-500 uppercase hover:text-zinc-600">
            {currentPage}
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumb
