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
  onSubmit: () => void
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  selectedCredit,
  paymentAmount,
  onPaymentAmountChange,
  onSubmit
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Abono</DialogTitle>
          <DialogDescription>
            {selectedCredit?.customer.name} - Saldo: {formatCurrency(selectedCredit?.balance || 0)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Monto del abono</Label>
            <Input 
              type="number" 
              value={paymentAmount} 
              onChange={e => onPaymentAmountChange(parseFloat(e.target.value) || 0)} 
              max={selectedCredit?.balance} 
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
