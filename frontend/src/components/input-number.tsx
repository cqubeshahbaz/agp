'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { FC, useEffect, useState } from 'react'
import { Text } from './text'

export interface NcInputNumberProps {
  className?: string
  defaultValue?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
  label?: string
  desc?: string
  disabled?: boolean
}

const InputNumber: FC<NcInputNumberProps> = ({
  className = 'w-full justify-between space-x-5',
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  label,
  desc,
  disabled = false,
}) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleClickDecrement = () => {
    if (min >= value) return
    setValue((state) => {
      return state - 1
    })
    onChange && onChange(value - 1)
  }
  const handleClickIncrement = () => {
    if (max && max <= value) return
    setValue((state) => {
      return state + 1
    })
    onChange && onChange(value + 1)
  }

  const renderLabel = () => {
    return (
      <div className="flex flex-col">
        <Text className="">{label}</Text>
        {desc && <Text className="text-xs font-normal text-neutral-500 dark:text-neutral-400">{desc}</Text>}
      </div>
    )
  }

  return (
    <div className={`flex items-center text-sm ${className}`}>
      {label && renderLabel()}

      <div className="flex w-24 items-center justify-between sm:w-28">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-950/15 bg-white hover:border-zinc-950/20 focus:outline-none disabled:cursor-default disabled:opacity-60 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:border-neutral-400"
          type="button"
          onClick={handleClickDecrement}
          disabled={disabled || min >= value}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="block flex-1 text-center leading-none select-none">{value}</span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-950/15 bg-white hover:border-zinc-950/20 focus:outline-none disabled:cursor-default disabled:opacity-60 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:border-neutral-400"
          type="button"
          onClick={handleClickIncrement}
          disabled={disabled || (max ? max <= value : false)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default InputNumber
