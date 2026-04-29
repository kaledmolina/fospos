"use client"

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Scale, Package, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PresentationSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  onSelect: (presentation: any) => void
}

export const PresentationSelectionDialog = ({
  open,
  onOpenChange,
  product,
  onSelect
}: PresentationSelectionDialogProps) => {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] bg-white dark:bg-zinc-950">
        <div className="p-6 bg-primary/5 border-b backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black text-primary">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Scale className="w-5 h-5 text-white" />
              </div>
              Seleccionar Unidad
            </DialogTitle>
            <DialogDescription className="font-medium">
              Elige cómo deseas vender <strong>{product.name}</strong>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-3">
          {/* Opción Base */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex items-center justify-between group hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all border-slate-200 dark:border-zinc-800"
            onClick={() => {
              onSelect(null)
              onOpenChange(false)
            }}
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Package className="w-6 h-6 text-slate-500 group-hover:text-primary" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight text-foreground">Unidad Base</p>
                <p className="text-xs text-muted-foreground font-medium">1 {product.unit || 'unidad'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-primary">{formatCurrency(product.salePrice)}</p>
              <ArrowRight className="w-4 h-4 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
          </Button>

          {/* Presentaciones */}
          {(product.presentations || []).map((pres: any) => (
            <Button
              key={pres.id}
              variant="outline"
              className="w-full h-auto p-4 flex items-center justify-between group hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all border-slate-200 dark:border-zinc-800"
              onClick={() => {
                onSelect(pres)
                onOpenChange(false)
              }}
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Scale className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight text-foreground">{pres.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">Equivale a {pres.conversionFactor} {product.unit || 'uds'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-indigo-600">
                  {formatCurrency(pres.price || (product.salePrice * pres.conversionFactor))}
                </p>
                <ArrowRight className="w-4 h-4 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
