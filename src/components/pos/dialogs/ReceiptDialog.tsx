"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Receipt } from "../Receipt"
import { Printer, Download, CheckCircle2 } from "lucide-react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"

interface ReceiptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: any
  tenant: any
}

export const ReceiptDialog = ({ open, onOpenChange, sale, tenant }: ReceiptDialogProps) => {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const printContents = componentRef.current?.innerHTML
      const originalContents = document.body.innerHTML

      // Crear una ventana temporal para imprimir
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Factura</title>
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

  if (!sale) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ¡Venta Exitosa! {sale.invoiceNumber}
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-lg overflow-hidden flex flex-col items-center">
           <div className="bg-white shadow-sm border rounded p-1 mb-4 w-fit" id="receipt-preview-body" ref={componentRef}>
              <Receipt sale={sale} tenant={tenant} />
           </div>
           <p className="text-xs text-muted-foreground text-center">Factura optimizada para papel térmico (58/80 mm)</p>
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
