'use client'

import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Divider } from '../divider'
import { TextLink } from '../text'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SearchIconPopover = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<
    { id: number; title: string; handle: string; price: number; image: string }[]
  >([])
  const [loading, setLoading] = useState(false)
  const trimmed = useMemo(() => query.trim(), [query])

  useEffect(() => {
    if (!trimmed) {
      setResults([])
      return
    }
    let active = true
    const timeout = setTimeout(async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const data = (await response.json()) as { results: typeof results }
        if (active) {
          setResults(data.results ?? [])
        }
      } finally {
        if (active) setLoading(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [trimmed])

  return (
    <Popover>
      <PopoverButton className="-m-2.5 flex cursor-pointer items-center justify-center rounded-md p-2.5 focus-visible:outline-0">
        <HugeiconsIcon icon={Search01Icon} size={24} color="currentColor" strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="bitpan-popover-full-panel absolute inset-x-0 top-0 -z-10 bg-white pt-[5.1rem] text-zinc-950 shadow-xl transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-100 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        <div className="container flex justify-center py-4">
          <div className="flex w-full max-w-xl flex-col">
            <div className="flex w-full items-center">
              <HugeiconsIcon icon={Search01Icon} size={26} color="currentColor" strokeWidth={1} />
              <input
                data-autofocus
                autoFocus
                type="text"
                className="w-full border-none px-4 py-2 text-sm/6 uppercase ring-0 focus-visible:outline-none"
                name="q"
                aria-label="Search for products"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-autocomplete="list"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    if (trimmed) {
                      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
                    }
                  }
                }}
              />
              <CloseButton className="-m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5 transition-transform duration-300 hover:rotate-90">
                <HugeiconsIcon icon={Cancel01Icon} size={24} color="currentColor" strokeWidth={1} />
              </CloseButton>
            </div>
            <Divider className="my-4 block md:hidden" />
            {trimmed ? (
              <div className="mt-4 space-y-3">
                {loading ? (
                  <div className="text-xs uppercase text-zinc-500">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="text-xs uppercase text-zinc-500">No results found.</div>
                ) : (
                  results.map((result) => (
                    <TextLink
                      key={result.id}
                      href={`/products/${result.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-50"
                    >
                      <div className="relative h-12 w-10 shrink-0">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="rounded-md object-cover"
                          sizes="3rem"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium text-zinc-900">{result.title}</span>
                        <span className="text-xs text-zinc-500">${result.price.toFixed(2)}</span>
                      </div>
                    </TextLink>
                  ))
                )}
                {results.length > 0 ? (
                  <TextLink href={`/search?q=${encodeURIComponent(trimmed)}`} className="text-xs text-zinc-500">
                    View all results
                  </TextLink>
                ) : null}
              </div>
            ) : null}
            <div className="block text-xs/6 text-zinc-500 uppercase md:hidden">
              Press{' '}
              <TextLink
                href={'/search'}
                className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-900"
              >
                <kbd className="text-xs font-medium">Enter</kbd>
              </TextLink>{' '}
              to search or{' '}
              <kbd className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-900">
                <span className="text-xs font-medium">Esc</span>
              </kbd>{' '}
              to cancel
            </div>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default SearchIconPopover
