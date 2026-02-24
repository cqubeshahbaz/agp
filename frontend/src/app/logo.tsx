import Image from 'next/image'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt' | 'width' | 'height'>

export function Logo({ className = '', ...props }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={160}
      height={100}
      priority
      className={`h-20 w-auto object-contain md:h-20 ${className}`}
      {...props}
    />
  )
}
