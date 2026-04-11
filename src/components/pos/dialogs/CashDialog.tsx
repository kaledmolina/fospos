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
}

export const CashDialog = ({
  open,
  onOpenChange,
  cashRegister,
  todayExpenses,
  paymentAmount,
  onPaymentAmountChange,
  onOpenCash,
  onCloseCash
}: CashDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{cashRegister ? "Cerrar Caja" : "Abrir Caja"}</DialogTitle></DialogHeader>
        {cashRegister ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between"><span>Efectivo inicial</span><span className="font-bold">{formatCurrency(cashRegister.initialCash)}</span></div>
              <div className="flex justify-between"><span>Ventas en efectivo</span><span className="font-bold">{formatCurrency(cashRegister.totalCash)}</span></div>
              <div className="flex justify-between"><span>Gastos del día</span><span className="font-bold text-red-600">-{formatCurrency(todayExpenses)}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="font-medium">Efectivo esperado</span><span className="font-bold text-emerald-600">{formatCurrency(cashRegister.initialCash + cashRegister.totalCash - todayExpenses)}</span></div>
            </div>
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
