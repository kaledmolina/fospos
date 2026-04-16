"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { Pause } from "lucide-react"

// 1. Subscription Service Dialog
interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingService: any
  form: any
  onFormChange: (form: any) => void
  categories: any[]
  onSubmit: (e: React.FormEvent) => void
}

export const SubscriptionServiceDialog = ({
  open, onOpenChange, editingService, form, onFormChange, categories, onSubmit
}: ServiceDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio de Suscripción"}</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Nombre *</Label>
            <Input value={form.name} onChange={e => onFormChange({ ...form, name: e.target.value })} placeholder="Nombre del servicio" required />
          </div>
          <div className="space-y-2">
            <Label>Código</Label>
            <Input value={form.code} onChange={e => onFormChange({ ...form, code: e.target.value })} placeholder="SERV001" />
          </div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={form.categoryId} onValueChange={v => onFormChange({ ...form, categoryId: v })}>
              <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
              <SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Precio *</Label>
            <Input type="number" value={form.price} onChange={e => onFormChange({ ...form, price: e.target.value })} placeholder="0" required />
          </div>
          <div className="space-y-2">
            <Label>Ciclo de Facturación *</Label>
            <Select value={form.billingCycle} onValueChange={v => onFormChange({ ...form, billingCycle: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Semanal</SelectItem>
                <SelectItem value="MONTHLY">Mensual</SelectItem>
                <SelectItem value="YEARLY">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={v => onFormChange({ ...form, isActive: v })} />
          <Label>Servicio Activo</Label>
        </div>
        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">Guardar Servicio</Button>
      </form>
    </DialogContent>
  </Dialog>
)

// 2. New Subscription Dialog
interface NewSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: any
  onFormChange: (form: any) => void
  customers: any[]
  services: any[]
  onSubmit: (e: React.FormEvent) => void
}

export const NewSubscriptionDialog = ({
  open, onOpenChange, form, onFormChange, customers, services, onSubmit
}: NewSubscriptionDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>Nueva Suscripción</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Select value={form.customerId} onValueChange={v => onFormChange({ ...form, customerId: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
            <SelectContent>{customers.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Servicio *</Label>
          <Select value={form.serviceId} onValueChange={v => {
            const s = services.find(s => s.id === v);
            onFormChange({ ...form, serviceId: v, agreedPrice: s?.price.toString() || "" });
          }}>
            <SelectTrigger><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
            <SelectContent>{services.filter(s => s.isActive).map(s => (<SelectItem key={s.id} value={s.id}>{s.name} - {formatCurrency(s.price)}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Precio Acordado *</Label>
            <Input type="number" value={form.agreedPrice} onChange={e => onFormChange({ ...form, agreedPrice: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Fecha de Inicio *</Label>
            <Input type="date" value={form.startDate} onChange={e => onFormChange({ ...form, startDate: e.target.value })} required />
          </div>
        </div>
        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">Crear Suscripción</Button>
      </form>
    </DialogContent>
  </Dialog>
)

// 3. Subscription Payment Dialog
interface SubscriptionPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSubscription: any
  amount: string
  onAmountChange: (amount: string) => void
  method: string
  onMethodChange: (method: string) => void
  onSubmit: () => void
}

export const SubscriptionPaymentDialog = ({
  open, onOpenChange, selectedSubscription, amount, onAmountChange, method, onMethodChange, onSubmit
}: SubscriptionPaymentDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>Registrar Pago</DialogTitle></DialogHeader>
      <div className="space-y-4">
        {selectedSubscription && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{selectedSubscription.customer.name}</p>
            <p className="text-sm text-muted-foreground">{selectedSubscription.service.name}</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedSubscription.agreedPrice)}</p>
          </div>
        )}
        <div className="space-y-2">
          <Label>Monto *</Label>
          <Input type="number" value={amount} onChange={e => onAmountChange(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Método</Label>
          <Select value={method} onValueChange={onMethodChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Efectivo</SelectItem>
              <SelectItem value="CARD">Tarjeta</SelectItem>
              <SelectItem value="TRANSFER">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={onSubmit}>Registrar Pago</Button>
      </div>
    </DialogContent>
  </Dialog>
)
// 4. Subscription Freeze Dialog
interface SubscriptionFreezeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSubscription: any
  days: string
  onDaysChange: (days: string) => void
  onSubmit: () => void
}

export const SubscriptionFreezeDialog = ({
  open, onOpenChange, selectedSubscription, days, onDaysChange, onSubmit
}: SubscriptionFreezeDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Pause className="w-5 h-5 text-blue-500" /> Congelar Suscripción
        </DialogTitle>
        <DialogDescription>
          Pausar temporalmente el servicio para el cliente.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        {selectedSubscription && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="font-semibold text-blue-900">{selectedSubscription.customer.name}</p>
            <p className="text-xs text-blue-700">{selectedSubscription.service.name}</p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="days">¿Cuántos días desea congelar?</Label>
          <div className="flex items-center gap-3">
            <Input 
              id="days"
              type="number" 
              value={days} 
              onChange={e => onDaysChange(e.target.value)}
              className="font-bold text-lg"
            />
            <span className="text-muted-foreground font-medium">Días</span>
          </div>
          <p className="text-[10px] text-muted-foreground pt-1">
            * El servicio se reactivará automáticamente tras este periodo.
          </p>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onSubmit}>
          Confirmar Congelación
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)
