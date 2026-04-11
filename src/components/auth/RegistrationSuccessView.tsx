"use client"

import { motion } from "framer-motion"
import { Store, PartyPopper, Mail, LogIn, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Confetti } from "@/components/shared/Confetti"

interface RegistrationSuccessViewProps {
  registeredEmail: string
  showConfetti: boolean
  onLoginClick: (email: string) => void
  onRegisterAnother: () => void
}

export const RegistrationSuccessView = ({ 
  registeredEmail, 
  showConfetti, 
  onLoginClick, 
  onRegisterAnother 
}: RegistrationSuccessViewProps) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Confetti show={showConfetti} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8"
              initial={{ rotate: -10, y: 20 }}
              animate={{ rotate: 0, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-6">
              ¡Registro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-glow-emerald">Completado!</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-md opacity-80">
              Bienvenido a la red de negocios inteligentes mas grande de Colombia. Tu solicitud esta siendo procesada.
            </p>
        </div>

        <Card className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
           <CardContent className="p-10 lg:p-14">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 group">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                          <Mail className="w-6 h-6 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email Registrado</p>
                          <p className="text-white font-bold">{registeredEmail}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Estado de Cuenta</p>
                          <p className="text-emerald-400 font-bold">Pendiente Actvacion</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                       <Button
                         size="lg"
                         className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 cursor-pointer"
                         onClick={() => onLoginClick(registeredEmail)}
                       >
                         Iniciar Sesión
                         <LogIn className="w-4 h-4 ml-3" />
                       </Button>
                    </motion.div>
                    
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-gray-500 hover:text-white hover:bg-white/5 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all cursor-pointer"
                      onClick={onRegisterAnother}
                    >
                      Registrar otro negocio
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 text-center">
                 <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto opacity-60">
                    Un consultor de FostPOS revisara los datos de tu empresa en los proximos 30 minutos para activar tu acceso completo.
                 </p>
              </div>
           </CardContent>
        </Card>

        <motion.div 
           className="mt-12 flex justify-center gap-4"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
        >
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                 <Store className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">FostPOS Colombia</span>
           </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
