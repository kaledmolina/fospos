"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Despues de montar, ya podemos mostrar el icono correcto sin errores de hidratacion
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Persistir en base de datos de forma asincrona (fire and forget)
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme })
      })
    } catch (error) {
      console.error("Error persisting theme:", error)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-transparent">
        <div className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-muted hover:bg-accent transition-colors border border-border relative overflow-hidden group shadow-sm"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: -40 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 40 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Moon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors fill-blue-400/20" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: -40 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 40 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors fill-amber-500/20" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      </Button>
    </motion.div>
  )
}
