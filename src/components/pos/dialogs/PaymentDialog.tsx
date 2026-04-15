"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCredit: any
  paymentAmount: number
  onPaymentAmountChange: (amount: number) => void
  paymentDate: string
  onPaymentDateChange: (date: string) => void
  paymentNotes: string
  onPaymentNotesChange: (notes: string) => void
  onSubmit: () => void
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  selectedCredit,
  paymentAmount,
  onPaymentAmountChange,
  paymentDate,
  onPaymentDateChange,
  paymentNotes,
  onPaymentNotesChange,
  onSubmit
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Abono</DialogTitle>
          <DialogDescription>
            <span className="font-bold text-foreground">{selectedCredit?.customer.name}</span>
            {selectedCredit?.sale?.invoiceNumber && (
              <span className="ml-2 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border">
                #{selectedCredit.sale.invoiceNumber}
              </span>
            )}
            <span className="block mt-1">Saldo pendiente: {formatCurrency(selectedCredit?.balance || 0)}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monto del abono</Label>
              <Input 
                type="number" 
                value={paymentAmount} 
                onChange={e => onPaymentAmountChange(parseFloat(e.target.value) || 0)} 
                max={selectedCredit?.balance} 
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha del abono</Label>
              <Input 
                type="date" 
                value={paymentDate} 
                onChange={e => onPaymentDateChange(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas / Observaciones</Label>
            <Input 
              placeholder="Ej: Pago en efectivo por el cliente..."
              value={paymentNotes}
              onChange={e => onPaymentNotesChange(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {selectedCredit && (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 cursor-pointer" 
                  onClick={() => onPaymentAmountChange(Math.round(selectedCredit.balance * 0.5))}
                >
                  50%
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 cursor-pointer" 
                  onClick={() => onPaymentAmountChange(selectedCredit.balance)}
                >
                  Total
                </Button>
              </>
            )}
          </div>
          <Button 
            className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
            onClick={onSubmit} 
            disabled={paymentAmount <= 0 || paymentAmount > (selectedCredit?.balance || 0)}
          >
            Registrar Abono
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
