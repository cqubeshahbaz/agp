import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'
import { Button } from './button'

interface ButtonLargeWithIconProps {
  className?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
}

const ButtonLargeWithIcon = ({ className = '', children, icon, ...props }: ButtonLargeWithIconProps) => {
  return (
    <Button
      outline
      className={clsx('w-full max-w-4xl cursor-pointer py-5 font-medium tracking-wide underline sm:py-6', className)}
      {...props}
    >
      {children}
      <div className="absolute right-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white sm:h-12 sm:w-12">
        {icon ? icon : <ArrowUpRightIcon className="h-4 w-4" />}
      </div>
    </Button>
  )
}

export default ButtonLargeWithIcon
