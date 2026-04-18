"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Search, User, CreditCard, Package, ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PinPad } from "./PinPad"
import { toast } from "sonner"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface StaffAccessViewProps {
  onLogin: (email: string, pin: string) => Promise<void>
  loading: boolean
}

export const StaffAccessView = ({ onLogin, loading }: StaffAccessViewProps) => {
  const [step, setStep] = useState<"nit" | "staff" | "pin">("nit")
  const [nit, setNit] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [staffList, setStaffList] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searching, setSearching] = useState(false)

  // Cargar NIT guardado
  useEffect(() => {
    const savedNit = localStorage.getItem("fostpos_last_nit")
    if (savedNit) {
      setNit(savedNit)
    }
  }, [])

  const handleFetchStaff = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!nit) return
    
    setSearching(true)
    try {
      const res = await fetch(`/api/auth/staff?nit=${nit}`)
      const data = await res.json()
      if (data.success) {
        setStaffList(data.data.staff)
        setBusinessName(data.data.businessName)
        localStorage.setItem("fostpos_last_nit", nit)
        setStep("staff")
      } else {
        toast.error(data.error || "Negocio no encontrado")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setSearching(false)
    }
  }

  const handleUserSelect = (user: any) => {
    setSelectedUser(user)
    setStep("pin")
  }

  const handlePinComplete = async (pin: string) => {
    await onLogin(selectedUser.email, pin)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "nit" && (
          <motion.div 
            key="nit-step"
            variants={fadeInUp} initial="initial" animate="animate" exit="exit"
            className="space-y-6"
          >
            <div className="text-center space-y-2">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-emerald-500" />
               </div>
               <h3 className="text-xl font-black tracking-tight">Identifica tu Negocio</h3>
               <p className="text-sm text-muted-foreground">Ingresa el NIT o Identificación de la empresa.</p>
            </div>

            <form onSubmit={handleFetchStaff} className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  placeholder="NIT del negocio..." 
                  value={nit}
                  onChange={(e) => setNit(e.target.value.toUpperCase())}
                  className="h-14 pl-12 bg-muted/30 border-border rounded-2xl focus:ring-emerald-500/10 font-bold"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={searching} 
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
              >
                {searching ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Continuar
              </Button>
            </form>
          </motion.div>
        )}

        {step === "staff" && (
          <motion.div 
            key="staff-step"
            variants={fadeInUp} initial="initial" animate="animate" exit="exit"
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">{businessName}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Selecciona tu perfil</p>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setStep("nit")} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-500/10 rounded-full h-8">
                  <RefreshCw className="w-3 h-3 mr-1" /> Cambiar
               </Button>
            </div>

            <motion.div 
              className="grid grid-cols-2 gap-3"
              variants={staggerContainer}
            >
              {staffList.map((user) => (
                <motion.button
                  key={user.id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserSelect(user)}
                  className="p-4 rounded-2xl bg-card border hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                    user.role === "CASHIER" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                  }`}>
                    {user.role === "CASHIER" ? <CreditCard className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                  </div>
                  <p className="font-black text-sm text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{user.role === "CASHIER" ? "Cajero" : "Bodeguero"}</p>
                </motion.button>
              ))}
              {staffList.length === 0 && (
                <div className="col-span-2 py-10 text-center border border-dashed rounded-3xl bg-muted/20">
                   <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                   <p className="text-sm font-bold text-muted-foreground">No hay personal operativo registrado</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === "pin" && (
          <motion.div 
            key="pin-step"
            variants={fadeInUp} initial="initial" animate="animate" exit="exit"
            className="flex flex-col items-center"
          >
            <div className="text-center mb-6">
               <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 ${
                    selectedUser?.role === "CASHIER" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                  }`}>
                  <User className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-black tracking-tight">{selectedUser?.name}</h3>
               <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{selectedUser?.role === "CASHIER" ? "Cajero" : "Bodeguero"}</p>
            </div>

            <PinPad 
              onComplete={handlePinComplete}
              onCancel={() => setStep("staff")}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
