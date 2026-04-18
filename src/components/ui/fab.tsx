"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FABProps {
  icon: LucideIcon
  onClick: () => void
  label: string
}

export const FAB = ({ icon: Icon, onClick, label }: FABProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 lg:bottom-6 right-6 z-[9999] cursor-pointer"
    >
      <button
        onClick={onClick}
        className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 group relative overflow-hidden active:scale-95"
        title={label}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110" />
      </button>
    </motion.div>
  )
}
