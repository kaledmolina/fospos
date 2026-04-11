"use client"

import { motion } from "framer-motion"

interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export const Sparkline = ({ data, color = "#10B981", width = 60, height = 20 }: SparklineProps) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg width={width} height={height} className="inline-block">
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  )
}
