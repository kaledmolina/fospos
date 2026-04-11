"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FABProps {
  icon: LucideIcon
  onClick: () => void
  label: string
  color?: "emerald" | "blue" | "purple"
}

export const FAB = ({ icon: Icon, onClick, label, color = "emerald" }: FABProps) => {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30",
    blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
    purple: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/30"
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-full ${colors[color]} text-white shadow-lg flex items-center justify-center transition-colors`}
      title={label}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  )
}
