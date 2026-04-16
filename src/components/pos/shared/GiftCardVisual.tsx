"use client"

import { motion } from "framer-motion"
import { Ticket, Star, Calendar, ShieldCheck, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface GiftCardVisualProps {
  card: {
    code: string
    balance: number
    expiresAt?: string | Date
    customer?: { name: string }
  }
  tenantName?: string
}

export const GiftCardVisual = ({ card, tenantName = "POS COLOMBIA" }: GiftCardVisualProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative w-full max-w-[400px] aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl group perspective-1000"
    >
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      
      {/* Dynamic light effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

      {/* Card Content */}
      <div className="relative h-full p-8 flex flex-col justify-between text-white border border-white/10 rounded-3xl">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Ticket className="w-4 h-4 text-blue-300" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200/70">Tarjeta de Regalo</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic drop-shadow-md">
              {tenantName}
            </h2>
          </div>
          <div className="text-right">
             <ShieldCheck className="w-6 h-6 text-emerald-400 opacity-80" />
          </div>
        </div>

        {/* Center: Amount */}
        <div className="mt-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-300/60 mb-1">Saldo Disponible</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300">
              {formatCurrency(card.balance)}
            </span>
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Footer: Code and Client */}
        <div className="flex justify-between items-end gap-4 border-t border-white/10 pt-4">
          <div className="min-w-0">
             <p className="text-[8px] font-black uppercase tracking-widest text-blue-300/50">Válido para</p>
             <p className="text-xs font-black truncate max-w-[150px] uppercase">
                {card.customer?.name || "Cliente General"}
             </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg px-3 py-2 rounded-xl border border-white/20 flex flex-col items-center shadow-inner group-hover:bg-white/20 transition-colors">
            <span className="text-[14px] font-mono font-black tracking-[0.2em] select-all">
              {card.code}
            </span>
            <div className="w-full h-1 mt-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
          </div>
        </div>
      </div>

      {/* Decorative expiration badge */}
      {card.expiresAt && (
        <div className="absolute top-4 right-4 rotate-12">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 backdrop-blur-md rounded-full shadow-lg border border-amber-300/30">
              <Calendar className="w-3 h-3 text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                Vence: {new Date(card.expiresAt).toLocaleDateString()}
              </span>
           </div>
        </div>
      )}

      {/* Golden corner trim */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent blur-2xl" />
    </motion.div>
  )
}
