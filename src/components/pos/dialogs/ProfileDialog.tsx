"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Mail, Lock, ShieldCheck, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileForm: any
  onProfileFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
  userRole: string
}

export const ProfileDialog = ({
  open,
  onOpenChange,
  profileForm,
  onProfileFormChange,
  onSubmit,
  userRole
}: ProfileDialogProps) => {
  if (!profileForm) return null

  const isCajero = userRole === "CASHIER"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
        
        <DialogHeader className="pt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight uppercase">Mi Perfil</DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                Personaliza tu información de acceso
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          <div className="space-y-4">
            {/* Información Básica */}
            <div className="space-y-3">
              <div className="relative">
                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1 mb-1 block">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={profileForm.name}
                    onChange={e => onProfileFormChange({ ...profileForm, name: e.target.value })}
                    className="pl-10 h-11 bg-muted/50 border-border focus:ring-emerald-500/20 rounded-xl font-bold"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              {!isCajero && (
                <div className="relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1 mb-1 block">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      value={profileForm.email}
                      onChange={e => onProfileFormChange({ ...profileForm, email: e.target.value })}
                      className="pl-10 h-11 bg-muted/50 border-border focus:ring-emerald-500/20 rounded-xl font-bold"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1 mb-1 block">Teléfono / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={profileForm.phone}
                    onChange={e => onProfileFormChange({ ...profileForm, phone: e.target.value })}
                    className="pl-10 h-11 bg-muted/50 border-border focus:ring-emerald-500/20 rounded-xl font-bold"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="pt-2">
              <div className="relative">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-orange-600 block">
                    {isCajero ? "Nuevo PIN de acceso" : "Nueva Contraseña"}
                  </Label>
                  <span className="text-[9px] font-bold text-muted-foreground italic tracking-tight">Dejar vacío para no cambiar</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type={isCajero ? "text" : "password"}
                    maxLength={isCajero ? 4 : undefined}
                    value={profileForm.password}
                    onChange={e => onProfileFormChange({ ...profileForm, password: e.target.value })}
                    className={`pl-10 h-11 bg-muted/50 border-border focus:ring-orange-500/20 rounded-xl font-bold ${isCajero ? 'text-center text-xl tracking-[0.5em]' : ''}`}
                    placeholder={isCajero ? "Ej: 1234" : "••••••••"}
                  />
                </div>
                {isCajero && (
                  <p className="text-[9px] text-muted-foreground mt-1 ml-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    El PIN debe ser de exactamente 4 dígitos.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-5 h-5 mr-2" />
                Guardar Cambios
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
