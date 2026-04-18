"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Delete, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PinPadProps {
  onComplete: (pin: string) => void
  onCancel: () => void
  loading?: boolean
}

export const PinPad = ({ onComplete, onCancel, loading }: PinPadProps) => {
  const [pin, setPin] = useState("")

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      if (newPin.length === 4) {
        onComplete(newPin)
      }
    }
  }

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1))
  }

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key)
      } else if (e.key === "Backspace") {
        handleDelete()
      } else if (e.key === "Escape") {
        onCancel()
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [pin])

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-background rounded-3xl border shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Ingresa tu PIN</h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Pin Display */}
      <div className="flex gap-4 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
              pin.length > i 
                ? "border-emerald-500 bg-emerald-500/10 scale-110 shadow-lg shadow-emerald-500/20" 
                : "border-muted bg-muted/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {pin.length > i && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0 }}
                  className="w-3 h-3 bg-emerald-500 rounded-full" 
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumberClick(num)}
            disabled={loading}
            className="h-16 rounded-2xl bg-muted/50 hover:bg-muted font-black text-xl transition-colors border border-transparent hover:border-border"
          >
            {num}
          </motion.button>
        ))}
        <div />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberClick("0")}
          disabled={loading}
          className="h-16 rounded-2xl bg-muted/50 hover:bg-muted font-black text-xl transition-colors border border-transparent hover:border-border"
        >
          0
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          disabled={loading}
          className="h-16 rounded-2xl flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors rounded-2xl"
        >
          <Delete className="w-6 h-6" />
        </motion.button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 animate-pulse">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
          Verificando PIN...
        </div>
      )}
    </div>
  )
}
