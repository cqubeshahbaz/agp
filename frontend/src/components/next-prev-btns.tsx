import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ButtonCircle } from './button'

interface NextPrevButtonsProps {
  onPrevClick: () => void
  onNextClick: () => void
  prevBtnDisabled?: boolean
  nextBtnDisabled?: boolean
  className?: string
}

const NextPrevButtons = ({
  onNextClick,
  onPrevClick,
  nextBtnDisabled,
  prevBtnDisabled,
  className,
}: NextPrevButtonsProps) => {
  return (
    <div className={clsx('flex gap-2', className)}>
      <ButtonCircle outline onClick={onPrevClick} disabled={prevBtnDisabled}>
        <span className="sr-only">Prev</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </ButtonCircle>
      <ButtonCircle outline onClick={onNextClick} disabled={nextBtnDisabled}>
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-4 w-4" />
      </ButtonCircle>
    </div>
  )
}

export default NextPrevButtons
