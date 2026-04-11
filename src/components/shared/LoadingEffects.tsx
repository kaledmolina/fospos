"use client"

import { motion } from "framer-motion"

export const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
      animate={{ translateX: ['100%', '200%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)
