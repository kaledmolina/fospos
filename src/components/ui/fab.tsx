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
        y: [0, -8, 0], // Efecto de levitación (bobbing)
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
      className="fixed bottom-6 right-6 z-[9999]"
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="w-16 h-16 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground shadow-[0_10px_25px_-5px_rgba(var(--primary-rgb),0.5)] shadow-primary/40 flex items-center justify-center transition-all duration-300 group"
        title={label}
      >
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-8 h-8 relative z-10" />
      </motion.button>
    </motion.div>
  )
}
