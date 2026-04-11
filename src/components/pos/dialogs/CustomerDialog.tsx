"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerForm: any
  onCustomerFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export const CustomerDialog = ({
  open,
  onOpenChange,
  customerForm,
  onCustomerFormChange,
  onSubmit
}: CustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Nombre *</Label>
              <Input value={customerForm.name} onChange={e => onCustomerFormChange({ ...customerForm, name: e.target.value })} placeholder="Nombre completo" required />
            </div>
            <div className="space-y-2"><Label>Documento</Label><Input value={customerForm.document} onChange={e => onCustomerFormChange({ ...customerForm, document: e.target.value })} placeholder="12345678" /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input value={customerForm.phone} onChange={e => onCustomerFormChange({ ...customerForm, phone: e.target.value })} placeholder="3001234567" /></div>
            <div className="space-y-2 col-span-2"><Label>Email</Label><Input type="email" value={customerForm.email} onChange={e => onCustomerFormChange({ ...customerForm, email: e.target.value })} placeholder="correo@ejemplo.com" /></div>
            <div className="space-y-2 col-span-2"><Label>Dirección</Label><Input value={customerForm.address} onChange={e => onCustomerFormChange({ ...customerForm, address: e.target.value })} placeholder="Dirección" /></div>
            <div className="space-y-2 col-span-2">
              <Label>Límite de Crédito Aprobado</Label>
              <Input type="number" value={customerForm.creditLimit} onChange={e => onCustomerFormChange({ ...customerForm, creditLimit: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200">Guardar Cliente</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
