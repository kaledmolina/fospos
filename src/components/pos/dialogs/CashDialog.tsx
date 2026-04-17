"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface CashDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister: any
  todayExpenses: number
  paymentAmount: number
  onPaymentAmountChange: (amount: number) => void
  onOpenCash: (amount: number) => void
  onCloseCash: (amount: number) => void
  userRole?: string
}

export const CashDialog = ({
  open,
  onOpenChange,
  cashRegister,
  todayExpenses,
  paymentAmount,
  onPaymentAmountChange,
  onOpenCash,
  onCloseCash,
  userRole
}: CashDialogProps) => {
  const isAdmin = userRole === "TENANT_ADMIN"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{cashRegister ? "Cerrar Caja" : "Abrir Caja"}</DialogTitle></DialogHeader>
        {cashRegister ? (
          <div className="space-y-4">
            {isAdmin ? (
              <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl space-y-2 border border-border">
                <div className="flex justify-between text-sm"><span>Efectivo inicial</span><span className="font-bold tabular-nums">{formatCurrency(cashRegister.initialCash)}</span></div>
                <div className="flex justify-between text-sm"><span>Ventas en efectivo</span><span className="font-bold tabular-nums text-emerald-600">+{formatCurrency(cashRegister.totalCash)}</span></div>
                <div className="flex justify-between text-sm"><span>Gastos del día</span><span className="font-bold tabular-nums text-red-600">-{formatCurrency(todayExpenses)}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center"><span className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Efectivo esperado</span><span className="font-black text-lg text-emerald-600 tabular-nums">{formatCurrency(cashRegister.initialCash + cashRegister.totalCash - todayExpenses)}</span></div>
              </div>
            ) : (
              <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/20 text-center space-y-2">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Arqueo Ciego Activo</p>
                <p className="text-[10px] text-muted-foreground italic">Por seguridad, ingrese el efectivo contado físicamente sin referencias del sistema.</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Efectivo contado</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={paymentAmount}
                onChange={e => onPaymentAmountChange(parseFloat(e.target.value) || 0)} 
              />
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 cursor-pointer transition-all duration-200" onClick={() => onCloseCash(paymentAmount)}>Cerrar Caja</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Efectivo inicial en caja</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={paymentAmount}
                onChange={e => onPaymentAmountChange(parseFloat(e.target.value) || 0)} 
              />
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200" onClick={() => onOpenCash(paymentAmount)}>Abrir Caja</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
