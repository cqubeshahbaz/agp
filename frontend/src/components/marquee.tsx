'use client'

import { useEffect, useRef } from 'react'

interface MarqueeProps {
  text: string
  speed?: number // pixels per second
  className?: string
  direction?: 'left' | 'right'
}

export const Marquee = ({ text, speed = 50, className = '', direction = 'left' }: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current

    if (!container || !inner) return

    // Calculate how many copies we need to create the illusion of infinite scrolling
    const containerWidth = container.offsetWidth
    const textWidth = inner.children[0].scrollWidth

    // We need at least enough copies to fill the container twice
    // (one visible set and one moving in)
    const copiesNeeded = Math.ceil((containerWidth * 2) / textWidth) + 1

    // Create the copies
    let content = ''
    for (let i = 0; i < copiesNeeded; i++) {
      content += `<div class="inline-block px-4">${text}</div>`
    }

    inner.innerHTML = content

    // Set the animation
    const distance = textWidth * copiesNeeded
    const duration = distance / speed

    inner.style.animationDuration = `${duration}s`
    inner.style.animationDirection = direction === 'left' ? 'normal' : 'reverse'

    // Reset animation when it completes to ensure smooth looping
    const handleAnimationEnd = () => {
      inner.style.animation = 'none'
      void inner.offsetWidth // Trigger reflow
      inner.style.animation = `marquee ${duration}s linear infinite`
      inner.style.animationDirection = direction === 'left' ? 'normal' : 'reverse'
    }

    inner.addEventListener('animationend', handleAnimationEnd)

    return () => {
      inner.removeEventListener('animationend', handleAnimationEnd)
    }
  }, [text, speed, direction])

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        ref={innerRef}
        className="animate-marquee inline-block whitespace-nowrap"
        style={{
          animationName: 'marquee',
          animationDuration: '10s', // Initial value, will be updated in useEffect
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        <div className="inline-block px-4">{text}</div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  )
}
