"use client"

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"
import { Truck, Printer, Package, Calendar, User, FileText, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState, useEffect } from "react"

interface PurchaseOrderDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  po: any
}

export const PurchaseOrderDetailDialog = ({
  open,
  onOpenChange,
  po: initialPo
}: PurchaseOrderDetailDialogProps) => {
  const [po, setPo] = useState<any>(initialPo)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && initialPo) {
      fetchDetailedPO()
    } else {
      setPo(initialPo)
    }
  }, [open, initialPo])

  const fetchDetailedPO = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/purchase-orders/${initialPo.id}`)
      const data = await res.json()
      if (data.success) {
        setPo(data.data)
      }
    } catch (error) {
      console.error("Error fetching detailed PO:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!po) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-[2rem]">
        {/* Header con gradiente */}
        <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/30 border-b backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <Badge className={`uppercase text-[10px] font-black ${
                  po.status === "RECEIVED" ? "bg-primary text-primary-foreground" : "bg-amber-500 text-white"
                }`}>
                  {po.status}
                </Badge>
                <span className="text-xs font-bold text-muted-foreground tabular-nums">OC-{po.id.slice(-8).toUpperCase()}</span>
              </div>
              <DialogTitle className="text-2xl font-black text-foreground flex items-center gap-2">
                Detalles de Orden de Compra
              </DialogTitle>
            </DialogHeader>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Proveedor</span>
                </div>
                <div>
                  <p className="text-lg font-black leading-tight">{po.supplier.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{po.supplier.taxId || "Sin Identificación"}</p>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fecha de Emisión</span>
                </div>
                <div>
                  <p className="text-lg font-black leading-tight text-foreground">
                    {format(new Date(po.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Recepción: {po.status === "RECEIVED" ? "Confirmada" : "Pendiente"}</p>
                </div>
              </div>

              {po.stats && po.status === "RECEIVED" && (
                <div className="md:col-span-2 p-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Seguimiento de Recuperación</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-none font-black text-[10px]">
                      ROI: {po.stats.roi.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-100/70 uppercase tracking-wider">Recuperado</p>
                      <p className="text-xl font-black tabular-nums">{formatCurrency(po.stats.totalRecovered)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-100/70 uppercase tracking-wider">Ganancia Real</p>
                      <p className="text-xl font-black tabular-nums text-white">
                        {formatCurrency(po.stats.grossProfit)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-100/70 uppercase tracking-wider">Balance OC</p>
                      <p className={`text-xl font-black tabular-nums ${po.stats.recoveryBalance >= 0 ? 'text-white' : 'text-emerald-200/50'}`}>
                        {formatCurrency(po.stats.recoveryBalance)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (po.stats.totalRecovered / po.totalAmount) * 100)}%` }} 
                      />
                    </div>
                    <p className="text-[9px] font-bold mt-2 text-emerald-100/80">
                      Has recuperado el {((po.stats.totalRecovered / po.totalAmount) * 100).toFixed(1)}% de la inversión inicial
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tabla de Productos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Productos Solicitados</h3>
              </div>
              
              <div className="rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/30">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-slate-100 dark:border-zinc-800">
                      <th className="px-6 py-4 text-left">Producto</th>
                      <th className="px-6 py-4 text-center">Cantidad</th>
                      <th className="px-6 py-4 text-center">Lote / Vence</th>
                      <th className="px-6 py-4 text-right">Costo Unit.</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                      {po.stats && <th className="px-6 py-4 text-right bg-emerald-500/5">Recuperado</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                    {po.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{item.product.name}</div>
                          <div className="text-[10px] text-muted-foreground font-medium">Ref: {item.product.id.slice(-6).toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className="rounded-lg font-black bg-slate-50 dark:bg-zinc-800 border-none tabular-nums">
                            {item.quantity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-[10px] font-black text-primary">{item.batchNumber || "SIN LOTE"}</div>
                          {item.expiryDate && (
                            <div className="text-[9px] text-amber-600 font-bold">Vence: {format(new Date(item.expiryDate), "dd/MM/yy")}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-muted-foreground tabular-nums">
                          {formatCurrency(item.unitCost)}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-foreground tabular-nums">
                          {formatCurrency(item.subtotal)}
                        </td>
                        {item.stats && (
                          <td className="px-6 py-4 text-right bg-emerald-500/5">
                            <div className="font-black text-emerald-600 tabular-nums">{formatCurrency(item.stats.amountRecovered)}</div>
                            <div className="text-[9px] font-bold text-muted-foreground">
                              {item.stats.quantitySold} / {item.quantity} vendidas
                            </div>
                            <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500" 
                                style={{ width: `${item.stats.percentageRecovered}%` }}
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5">
                      <td colSpan={4} className="px-6 py-6 text-right">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-4">Total de Inversión:</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">
                          {formatCurrency(po.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notas */}
            {po.notes && (
              <div className="p-5 rounded-3xl bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Observaciones</span>
                </div>
                <p className="text-sm font-medium text-amber-900/80 dark:text-amber-200/80 italic">"{po.notes}"</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-slate-50/50 dark:bg-zinc-900/30 border-t backdrop-blur-md">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 dark:bg-primary dark:hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
          >
            Cerrar Detalle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
