"use client"

import { motion } from "framer-motion"
import { Store, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface SetupViewProps {
  onSetup: (e: React.FormEvent<HTMLFormElement>) => void
}

export const SetupView = ({ onSetup }: SetupViewProps) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[100%] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            variants={fadeInUp}
            className="w-16 h-16 bg-white text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl mb-8"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl font-black tracking-tighter leading-none mb-4">
            Configuración <br />
            <span className="text-emerald-400">del Motor.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] opacity-80">
            Crea la cuenta de Super Administrador del Sistema
          </motion.p>
        </div>

        <Card className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-10 lg:p-12">
            <form onSubmit={onSetup} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Tu nombre y apellido" 
                    required 
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="admin@fostpos.co" 
                    required 
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Root Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="h-14 pl-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">Clave de Seguridad (Master Key)</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                  <Input 
                    id="setupKey" 
                    name="setupKey" 
                    type="password" 
                    placeholder="Pega aquí la clave de tu archivo .env" 
                    required 
                    className="h-14 pl-12 bg-emerald-500/5 border-emerald-500/20 rounded-xl focus:border-emerald-500 font-medium placeholder:text-gray-700"
                  />
                </div>
                <p className="text-[9px] text-gray-500 italic mt-1 px-1">
                  Requerida para la inicialización inicial del sistema.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button 
                  type="submit" 
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Inicializar Sistema
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kernel V2.0 Ready
               </div>
               <div className="flex items-center gap-2">
                  <Store className="w-3 h-3" />
                  FostPOS Engine
               </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">
          Enterprise Multi-Tenant Infrastructure
        </p>
      </motion.div>
    </div>
  )
}
