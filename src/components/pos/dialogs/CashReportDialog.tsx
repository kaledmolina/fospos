"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CashReceipt } from "../CashReceipt"
import { Printer, XCircle, CheckCircle2, Wallet } from "lucide-react"
import { useRef } from "react"

interface CashReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister: any
  tenant: any
  todayExpenses: number
}

export const CashReportDialog = ({ open, onOpenChange, cashRegister, tenant, todayExpenses }: CashReportDialogProps) => {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const printContents = componentRef.current?.innerHTML
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Resumen de Caja</title>
              <style>
                @page { margin: 0; }
                body { margin: 0; padding: 20px; font-family: monospace; }
                @media print {
                  body { margin: 0; padding: 5px; }
                }
              </style>
            </head>
            <body>
              ${printContents}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  if (!cashRegister) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            Resumen de Caja del Día
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-lg overflow-hidden flex flex-col items-center">
           <div className="bg-white shadow-sm border rounded p-1 mb-4 w-fit" ref={componentRef}>
              <CashReceipt 
                cashRegister={cashRegister} 
                tenant={tenant} 
                todayExpenses={todayExpenses}
              />
           </div>
           <p className="text-xs text-muted-foreground text-center">Formato de resumen consolidado para impresora térmica.</p>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cerrar
          </Button>
          <Button onClick={handlePrint} className="w-full bg-emerald-500 hover:bg-emerald-600">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
