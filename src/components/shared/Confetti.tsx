"use client"

import { motion } from "framer-motion"

interface ConfettiParticleProps {
  color: string
  x: number
  delay: number
}

const ConfettiParticle = ({ color, x, delay }: ConfettiParticleProps) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color, left: `${x}%` }}
    initial={{ y: -10, opacity: 0, scale: 0 }}
    animate={{
      y: [0, 400],
      opacity: [1, 1, 0],
      scale: [0, 1, 0.5],
      rotate: [0, 360]
    }}
    transition={{
      duration: 3,
      delay,
      ease: "easeOut"
    }}
  />
)

export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null
  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          color={colors[i % colors.length]}
          x={Math.random() * 100}
          delay={Math.random() * 0.5}
        />
      ))}
    </div>
  )
}
