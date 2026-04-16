"use client"

import { useState } from "react"
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Plus, Trash2, ShoppingCart, DollarSign } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"

interface PurchaseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: any[]
  products: any[]
  onCreate: (data: any) => Promise<void>
}

export const PurchaseOrderDialog = ({
  open,
  onOpenChange,
  suppliers,
  products,
  onCreate
}: PurchaseOrderDialogProps) => {
  const [supplierId, setSupplierId] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitCost: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const total = items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || items.length === 0) return

    setLoading(true)
    try {
      await onCreate({
        supplierId,
        items,
        notes
      })
      onOpenChange(false)
      setSupplierId("")
      setItems([])
      setNotes("")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[650px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-[2rem]">
        <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/30 border-b backdrop-blur-md shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-emerald-600">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              Nueva Orden de Compra
            </DialogTitle>
            <DialogDescription className="font-medium">
              Selecciona un proveedor y añade los productos para abastecer.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-950">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pb-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Proveedor</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger className="h-12 border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-xl focus:ring-emerald-500/20 transition-all">
                    <SelectValue placeholder={suppliers.length === 0 ? "No hay proveedores registrados" : "Selecciona un proveedor"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                    {suppliers.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-2">No tienes proveedores creados</p>
                        <p className="text-[10px] font-bold text-emerald-600">Ve a la pestaña de Proveedores para crear uno</p>
                      </div>
                    ) : (
                      suppliers.map(s => (
                        <SelectItem key={s.id} value={s.id} className="rounded-lg focus:bg-emerald-50 dark:focus:bg-emerald-500/10">
                          {s.name} <span className="text-[10px] text-muted-foreground ml-2 opacity-60">({s.taxId || "Sin NIT"})</span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Productos</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItem}
                    className="h-8 text-[10px] font-black uppercase text-emerald-600 border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg px-4 transition-all hover:translate-x-1"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Añadir Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1 space-y-4">
                        <Select 
                          value={item.productId} 
                          onValueChange={(val) => updateItem(index, "productId", val)}
                        >
                          <SelectTrigger className="h-10 bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                            {products.length === 0 ? (
                              <div className="p-4 text-center">
                                <p className="text-xs text-muted-foreground">No hay productos disponibles</p>
                              </div>
                            ) : (
                              products.map(p => (
                                <SelectItem key={p.id} value={p.id} className="rounded-lg focus:bg-emerald-50 dark:focus:bg-emerald-500/10">
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <span>{p.name}</span>
                                    <Badge variant="outline" className="text-[9px] h-4 font-black bg-slate-100 dark:bg-zinc-800 border-none opacity-60">Stock: {p.stock}</Badge>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        <div className="flex gap-4">
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground ml-1 tracking-wider opacity-60">Cantidad</Label>
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                              className="h-10 tabular-nums font-bold bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-emerald-500/20"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground ml-1 tracking-wider opacity-60">Costo Unit.</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                              <Input 
                                type="number" 
                                value={item.unitCost} 
                                onChange={(e) => updateItem(index, "unitCost", parseFloat(e.target.value) || 0)}
                                className="h-10 pl-9 tabular-nums font-bold bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-emerald-500/20"
                              />
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-end min-w-[80px] pb-1">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground">Subtotal</Label>
                            <p className="font-black text-xs text-emerald-600">{formatCurrency(item.unitCost * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-50/30 dark:bg-zinc-900/10 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                        <ShoppingCart className="w-6 h-6 text-emerald-500 opacity-40" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Añade productos a la orden</p>
                      <button 
                        type="button"
                        onClick={addItem}
                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors"
                      >
                        + Comenzar a añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Notas</Label>
                <Input 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones de la orden..."
                  className="h-11"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 bg-white dark:bg-zinc-950 border-t shrink-0">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest opacity-60">Inversión Total Estimada</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-500">$</span>
                  <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{total.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <Badge className="bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 border-none">
                  {items.length} {items.length === 1 ? 'Producto' : 'Productos'}
                </Badge>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="font-bold text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl px-8 transition-all hover:text-foreground"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 h-12 px-10 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                disabled={loading || !supplierId || items.length === 0}
              >
                {loading ? "Procesando..." : "Emitir Orden de Compra"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
