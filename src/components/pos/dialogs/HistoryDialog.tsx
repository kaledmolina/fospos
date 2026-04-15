"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Calendar, DollarSign, CreditCard, Wallet, Receipt, User } from "lucide-react"

interface HistoryItem {
  id: string
  amount: number
  createdAt: string
  paymentMethod: string
  notes?: string
  receiptNumber?: string
  periodStart?: string
  periodEnd?: string
  registeredBy?: {
    name: string
  }
}

interface HistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  items: HistoryItem[]
}

export const HistoryDialog = ({
  open,
  onOpenChange,
  title,
  description,
  items
}: HistoryDialogProps) => {
  const getMethodIcon = (method: string) => {
    switch (method.toUpperCase()) {
      case "CASH": return <Wallet className="w-4 h-4 text-emerald-500" />
      case "CARD": return <CreditCard className="w-4 h-4 text-blue-500" />
      case "TRANSFER": return <Receipt className="w-4 h-4 text-orange-500" />
      default: return <DollarSign className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description || "Historial detallado de pagos registrados."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {items?.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getMethodIcon(item.paymentMethod)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{formatCurrency(item.amount)}</p>
                      <span className="text-[10px] font-black uppercase tracking-tighter bg-background px-1 rounded border">
                        {item.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </p>
                      {item.registeredBy && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3 text-primary/60" />
                          {item.registeredBy.name}
                        </p>
                      )}
                    </div>
                    {item.periodStart && item.periodEnd && (
                      <p className="text-[10px] text-emerald-600 font-medium mt-1">
                        Período: {formatDate(item.periodStart)} - {formatDate(item.periodEnd)}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[10px] italic text-muted-foreground mt-1 px-2 border-l-2 border-primary/20">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
                {item.receiptNumber && (
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Recibo</p>
                    <p className="text-[10px] font-medium">{item.receiptNumber}</p>
                  </div>
                )}
              </div>
            ))}

            {(!items || items.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No se han registrado pagos aún.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
