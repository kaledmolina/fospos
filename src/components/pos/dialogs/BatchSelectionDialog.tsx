"use client"

import { useState } from "react"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Truck, Calendar, Tag, Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ProductBatchData } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

interface BatchSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  batches: ProductBatchData[]
  onSelect: (batch: ProductBatchData) => void
}

export const BatchSelectionDialog = ({
  open,
  onOpenChange,
  product,
  batches,
  onSelect
}: BatchSelectionDialogProps) => {




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Package className="w-5 h-5 text-white" />
               </div>
               <DialogTitle className="text-xl font-black uppercase tracking-tight">Seleccionar Lote</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 font-medium">
              El producto <span className="font-black underline decoration-white/30">{product?.name}</span> tiene varios lotes disponibles con diferentes precios o proveedores.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 bg-background">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {batches?.map((batch) => (
                <motion.div
                  key={batch.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelect(batch)
                    onOpenChange(false)
                  }}
                  className="cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 border-slate-100 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5 bg-white dark:bg-zinc-900 group hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[10px] font-black uppercase bg-slate-100 text-slate-500">
                          {batch.batchNumber || "SIN LOTE"}
                       </Badge>
                       {batch.supplier && (
                         <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <Truck className="w-3 h-3 text-primary/60" /> {batch.supplier.name}
                         </div>
                       )}
                    </div>

                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                       <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Precio Venta</span>
                       </div>
                       <p className="text-2xl font-black tabular-nums transition-colors text-foreground group-hover:text-primary">
                          {formatCurrency(batch.salePrice)}
                       </p>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Stock Lote</p>
                       <p className="text-sm font-black text-foreground">{batch.quantity} {product?.unit || 'und'}</p>
                    </div>
                  </div>

                  {batch.expiryDate && (
                    <div className="mt-3 pt-2 border-t border-dashed border-slate-100 dark:border-zinc-800 flex items-center gap-2 text-[10px] font-bold italic text-amber-600 dark:text-amber-500">
                       <Calendar className="w-3 h-3" />
                       Vence: {new Date(batch.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>

  )
}
