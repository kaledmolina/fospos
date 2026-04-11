"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])
  
  return (
    <span>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}
