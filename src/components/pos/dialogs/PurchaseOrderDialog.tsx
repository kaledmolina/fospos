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
  branches?: any[]
  selectedBranch?: string | null
  onCreate: (data: any) => Promise<void>
}

export const PurchaseOrderDialog = ({
  open,
  onOpenChange,
  suppliers,
  products,
  branches = [],
  selectedBranch: initialBranch = null,
  onCreate
}: PurchaseOrderDialogProps) => {
  const [supplierId, setSupplierId] = useState("")
  const [targetBranchId, setTargetBranchId] = useState<string>(initialBranch || "")
  const [items, setItems] = useState<any[]>([])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [productBatches, setProductBatches] = useState<Record<string, any[]>>({})

  const fetchBatches = async (productId: string) => {
    if (!productId || !targetBranchId) return
    // Reset batches for this product if branch changed
    try {
      const res = await fetch(`/api/products/${productId}/batches?branchId=${targetBranchId}&includeEmpty=true`)
      const data = await res.json()
      if (data.success) {
        setProductBatches(prev => ({ ...prev, [productId]: data.data }))
      }
    } catch (error) {
      console.error("Error fetching batches", error)
    }
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitCost: 0, salePrice: 0, batchNumber: "", expiryDate: "", batchId: null }])

  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    const updatedItem = { ...newItems[index], [field]: value }
    
    // Si se selecciona un producto, intentar cargar sus lotes y poblar precios base
    if (field === "productId" && value) {
      fetchBatches(value)
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItem.unitCost = product.costPrice || 0
        updatedItem.salePrice = product.salePrice || 0
      }
    }

    // Si se selecciona un lote existente, autopoblar campos
    if (field === "batchId" && value && value !== "new") {
      const productId = updatedItem.productId
      const batch = productBatches[productId]?.find(b => b.id === value)
      if (batch) {
        updatedItem.batchNumber = batch.batchNumber || ""
        updatedItem.expiryDate = batch.expiryDate ? new Date(batch.expiryDate).toISOString().split('T')[0] : ""
        updatedItem.salePrice = batch.salePrice || 0
        updatedItem.unitCost = batch.costPrice || 0
      }
    } else if (field === "batchId" && value === "new") {
      updatedItem.batchId = null
      updatedItem.batchNumber = ""
      updatedItem.expiryDate = ""
      // Restaurar precios del producto base
      const product = products.find(p => p.id === updatedItem.productId)
      if (product) {
        updatedItem.unitCost = product.costPrice || 0
        updatedItem.salePrice = product.salePrice || 0
      }
    }

    newItems[index] = updatedItem
    setItems(newItems)
  }

  const total = items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || items.length === 0) return
    
    // Validar que todos los items tengan un producto seleccionado
    const hasInvalidItems = items.some(item => !item.productId)
    if (hasInvalidItems) {
      toast.error("Datos incompletos", { description: "Asegúrate de seleccionar un producto para cada fila." })
      return
    }


    setLoading(true)
    try {
      await onCreate({
        supplierId,
        branchId: targetBranchId,
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
      <DialogContent className="w-[95vw] sm:max-w-[750px] h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-[2rem]">
        <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/30 border-b backdrop-blur-md shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-primary">
              <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              Nueva Orden de Compra
            </DialogTitle>
            <DialogDescription className="font-medium">
              Selecciona un proveedor y añade los productos para abastecer.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-zinc-950 overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Sucursal de Destino</Label>
                  <Select value={targetBranchId} onValueChange={(val) => {
                    setTargetBranchId(val)
                    setProductBatches({}) // Reset batches when branch changes
                  }}>
                    <SelectTrigger className="h-12 border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-xl focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="Selecciona sucursal" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                      {branches.map(b => (
                        <SelectItem key={b.id} value={b.id} className="rounded-lg">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                          <p className="text-[10px] font-bold text-primary">Ve a la pestaña de Proveedores para crear uno</p>
                        </div>
                      ) : (
                        suppliers.map(s => (
                          <SelectItem key={s.id} value={s.id} className="rounded-lg focus:bg-primary/10">
                            {s.name} <span className="text-[10px] text-muted-foreground ml-2 opacity-60">({s.taxId || "Nit: " + s.nit || "Sin Nit"})</span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>


              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Productos</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItem}
                    className="h-8 text-[10px] font-black uppercase text-primary border-primary/20 hover:bg-primary/10 rounded-lg px-4 transition-all hover:translate-x-1"
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
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                              <Input 
                                type="number" 
                                value={item.unitCost} 
                                onChange={(e) => updateItem(index, "unitCost", parseFloat(e.target.value) || 0)}
                                disabled={item.batchId && item.batchId !== "new"}
                                className="h-10 pl-9 tabular-nums font-bold bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary/20 disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground ml-1 tracking-wider opacity-60">Precio Venta (Lote)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                              <Input 
                                type="number" 
                                value={item.salePrice} 
                                onChange={(e) => updateItem(index, "salePrice", parseFloat(e.target.value) || 0)}
                                disabled={item.batchId && item.batchId !== "new"}
                                className="h-10 pl-9 tabular-nums font-bold bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-emerald-500/20 disabled:opacity-50"
                                placeholder="Precio venta lote"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-[2] space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-400 ml-1 tracking-wider">Lote / Existente</Label>
                            <Select 
                              value={item.batchId || "new"} 
                              onValueChange={(val) => updateItem(index, "batchId", val)}
                            >
                              <SelectTrigger className="h-10 bg-indigo-50/50 dark:bg-indigo-900/20 border-none rounded-xl font-bold">
                                <SelectValue placeholder="Nuevo Lote" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
                                <SelectItem value="new" className="font-bold text-indigo-600 italic">+ Nuevo Lote</SelectItem>
                                {item.productId && productBatches[item.productId]?.map(b => (
                                  <SelectItem key={b.id} value={b.id} className="rounded-lg">
                                    {b.batchNumber || 'Sin código'} <span className="text-[10px] opacity-60 ml-2">(${b.costPrice} | Stock: {b.quantity})</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground ml-1 tracking-wider opacity-60">Código Lote</Label>
                            <Input 
                              value={item.batchNumber} 
                              onChange={(e) => updateItem(index, "batchNumber", e.target.value)}
                              className="h-10 bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary/20"
                              placeholder="Ej: AB-123"
                              disabled={item.batchId && item.batchId !== "new"}
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground ml-1 tracking-wider opacity-60">Vencimiento</Label>
                            <Input 
                              type="date"
                              value={item.expiryDate} 
                              onChange={(e) => updateItem(index, "expiryDate", e.target.value)}
                              className="h-10 bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl focus-visible:ring-primary/20"
                              disabled={item.batchId && item.batchId !== "new"}
                            />
                          </div>
                          <div className="text-right flex flex-col justify-end min-w-[80px] pb-1">
                            <Label className="text-[9px] uppercase font-black text-muted-foreground">Subtotal</Label>
                            <p className="font-black text-xs text-primary">{formatCurrency(item.unitCost * item.quantity)}</p>
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
                  <span className="text-2xl font-bold text-primary">$</span>
                  <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{total.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-primary/20 border-none">
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
                className="bg-primary hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/20 h-12 px-10 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:cursor-not-allowed"
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
