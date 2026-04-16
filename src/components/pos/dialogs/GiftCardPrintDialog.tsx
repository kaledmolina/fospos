"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, X, CheckCircle2 } from "lucide-react"
import { useRef } from "react"
import { GiftCardVisual } from "../shared/GiftCardVisual"
import { GiftCardPrint } from "../shared/GiftCardPrint"
import { renderToString } from "react-dom/server"

interface GiftCardPrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: any
  tenant: any
}

export const GiftCardPrintDialog = ({ open, onOpenChange, card, tenant }: GiftCardPrintDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (typeof window !== "undefined" && card) {
      // In Next.js/React, we can't easily use the ref's innerHTML for complex components with styles
      // We'll use a hidden div or renderToString for the thermal version
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (printWindow) {
        const printContent = renderToString(<GiftCardPrint card={card} tenant={tenant} />)
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Gift Card</title>
              <style>
                @page { margin: 0; }
                body { margin: 0; padding: 20px; font-family: monospace; }
                @media print {
                  body { margin: 0; padding: 5px; }
                }
              </style>
            </head>
            <body>
              ${printContent}
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

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] overflow-hidden border-none bg-transparent shadow-none p-0">
        <div className="bg-white dark:bg-zinc-950 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Vista Previa de Tarjeta
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 flex flex-col items-center gap-8">
            <GiftCardVisual card={card} tenantName={tenant.name} />
            
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg uppercase">¡Diseño de Tarjeta Generado!</h3>
              <p className="text-sm text-muted-foreground">
                Puedes imprimir esta tarjeta en formato ticket térmico para entregar a tu cliente físicamente.
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              <X className="w-4 h-4 mr-2" /> Cerrar
            </Button>
            <Button 
              onClick={handlePrint} 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimir Ticket
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
