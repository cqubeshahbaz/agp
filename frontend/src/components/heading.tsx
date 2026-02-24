import clsx from 'clsx'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  fontSize?: string
  bigger?: boolean
} & React.ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

export function Heading({
  className,
  fontSize = 'text-[2rem] sm:text-4xl xl:text-[2.5rem] leading-none',
  bigger = false,
  level = 2,
  ...props
}: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        bigger ? 'text-3xl leading-none sm:text-4xl xl:text-5xl/none' : fontSize,
        'text font-medium *:data-[slot=dim]:text-zinc-300 *:data-[slot=italic]:font-serif *:data-[slot=italic]:font-normal *:data-[slot=italic]:italic *:data-[slot=dim]:dark:text-zinc-500'
      )}
    />
  )
}

export function Subheading({ className, fontSize = 'text-xl/8', level = 3, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        fontSize,
        'font-medium *:data-[slot=dim]:text-zinc-300 *:data-[slot=italic]:font-serif *:data-[slot=italic]:font-normal *:data-[slot=italic]:italic *:data-[slot=dim]:dark:text-zinc-500'
      )}
    />
  )
}
