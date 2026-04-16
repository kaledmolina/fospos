"use client"

import { useState } from "react"
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Truck, Mail, Phone, MapPin, Hash, FileText } from "lucide-react"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: any
  setForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
  editingSupplier: any
}

export const SupplierDialog = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  editingSupplier
}: SupplierDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-[2rem]">
        <div className="p-8 bg-slate-50/50 dark:bg-zinc-900/30 border-b backdrop-blur-md shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4 text-3xl font-black text-emerald-600">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20">
                <Truck className="w-6 h-6 text-white" />
              </div>
              {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium mt-2">
              Registra los datos de tu socio comercial para gestionar compras y stock.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Nombre de la Empresa</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input 
                  required
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Distribuidora Global"
                  className="pl-10 h-12 bg-slate-50 dark:bg-zinc-900/50 border-none rounded-xl focus-visible:ring-emerald-500/20 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">NIT / RUT</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input 
                  value={form.nit} 
                  onChange={(e) => setForm({ ...form, nit: e.target.value })}
                  placeholder="900.123.456-1"
                  className="pl-10 h-12 bg-slate-50 dark:bg-zinc-900/50 border-none rounded-xl focus-visible:ring-emerald-500/20 font-bold tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Teléfono de Contacto</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                  className="pl-10 h-12 bg-slate-50 dark:bg-zinc-900/50 border-none rounded-xl focus-visible:ring-emerald-500/20 font-bold tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input 
                  type="email"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@proveedor.com"
                  className="pl-10 h-12 bg-slate-50 dark:bg-zinc-900/50 border-none rounded-xl focus-visible:ring-emerald-500/20 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Dirección Física</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground opacity-40" />
              <Input 
                value={form.address} 
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Calle 123 #45-67, Ciudad"
                className="pl-10 h-12 bg-slate-50 dark:bg-zinc-900/50 border-none rounded-xl focus-visible:ring-emerald-500/20 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 tracking-widest">Notas Adicionales</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground opacity-40" />
              <Textarea 
                value={form.notes} 
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Plazos de pago, días de entrega, contacto secundario..."
                className="pl-10 min-h-[100px] bg-slate-50 dark:bg-zinc-900/50 border-none rounded-2xl focus-visible:ring-emerald-500/20 font-medium pt-3"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="h-12 px-8 font-bold text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-10 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20 border-none ring-offset-emerald-500 transition-all hover:scale-[1.02] active:scale-95"
            >
              {editingSupplier ? "Actualizar Proveedor" : "Guardar Proveedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
