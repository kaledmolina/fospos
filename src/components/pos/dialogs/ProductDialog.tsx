"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ImagePlus, X, Loader2, Package, Tag, 
  DollarSign, Barcode, Calendar, Info, Layers, 
  TrendingUp, LayoutGrid, Briefcase, AlertTriangle
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productForm: any
  onProductFormChange: (form: any) => void
  categories: any[]
  onSubmit: (e: React.FormEvent) => void
  editingProduct?: any
  userRole?: string
  suppliers: any[]
}

export const ProductDialog = ({
  open,
  onOpenChange,
  productForm,
  onProductFormChange,
  categories,
  onSubmit,
  editingProduct,
  userRole,
  suppliers
}: ProductDialogProps) => {
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        onProductFormChange({ ...productForm, imageUrl: data.imageUrl })
        toast.success("Imagen subida correctamente")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onProductFormChange({ ...productForm, imageUrl: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const profitStats = useMemo(() => {
    const cost = parseFloat(String(productForm.costPrice)) || 0
    const sale = parseFloat(String(productForm.salePrice)) || 0
    if (sale === 0) return { profit: 0, margin: 0 }
    const profit = sale - cost
    const margin = (profit / sale) * 100
    return { profit, margin }
  }, [productForm.costPrice, productForm.salePrice])

  const isAdmin = userRole === "TENANT_ADMIN" || userRole === "SUPER_ADMIN"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-2xl bg-white dark:bg-zinc-950 flex flex-col max-h-[90vh]">
        {/* Header - Clean and Professional */}
        <div className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {editingProduct ? "Editar Producto" : "Registrar Nuevo Producto"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 dark:text-zinc-400">
            {editingProduct 
              ? "Actualiza la información técnica y de inventario del producto."
              : "Completa los campos básicos para añadir el producto al catálogo."}
          </DialogDescription>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col min-h-0">
          <div className="px-8 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/30">
            <TabsList className="bg-slate-200/50 dark:bg-zinc-800/50 h-12 p-1 gap-1 rounded-2xl my-3">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                1. Datos Básicos
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                2. Precios e Inventario
              </TabsTrigger>
            </TabsList>
            
          </div>

          <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              
              {/* Tab 1: Basic Information */}
              <TabsContent value="basic" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Left Column: Image Selector */}
                  <div className="md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Foto del Producto</Label>
                    <div 
                      className="group relative w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-900/50 transition-all duration-300 hover:bg-primary/5 dark:hover:bg-primary/5 hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      {productForm.imageUrl ? (
                        <>
                          <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4 transform transition-transform duration-300 group-hover:scale-105">
                          {uploading ? <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" /> : <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors mx-auto mb-3" />}
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest">Subir Imagen</span>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  {/* Right Column: Name & Main Details */}
                  <div className="md:col-span-3 space-y-5">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Comercial <span className="text-red-500">*</span></Label>
                        <Input 
                          value={productForm.name} 
                          onChange={e => onProductFormChange({ ...productForm, name: e.target.value })} 
                          placeholder="Ej: Coca-Cola Sabor Original 600ml" 
                          required 
                          className="h-11 font-bold bg-white dark:bg-zinc-950" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría <span className="text-red-500">*</span></Label>
                        <Select value={productForm.categoryId} onValueChange={v => onProductFormChange({ ...productForm, categoryId: v })} required>
                          <SelectTrigger className="h-11 font-bold">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="font-bold">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</Label>
                        <Select 
                          value={productForm.isActive ? "true" : "false"} 
                          onValueChange={v => onProductFormChange({ ...productForm, isActive: v === "true" })}
                        >
                          <SelectTrigger className={`h-11 font-bold ${productForm.isActive ? "text-emerald-500 border-emerald-200" : "text-rose-500 border-rose-200"}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true" className="text-emerald-500 font-bold">ACTIVO / VISIBLE</SelectItem>
                            <SelectItem value="false" className="text-rose-500 font-bold">INACTIVO / OCULTO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Códigos de Referencia</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        value={productForm.code} 
                        onChange={e => onProductFormChange({ ...productForm, code: e.target.value })} 
                        placeholder="Código de Barras (EAN/UPC)" 
                        className="pl-10 h-11 font-bold font-mono tracking-wider"
                      />
                    </div>
                    <div className="relative group">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input 
                        value={productForm.sku} 
                        onChange={e => onProductFormChange({ ...productForm, sku: e.target.value })} 
                        placeholder="SKU Interno" 
                        className="pl-10 h-11 font-bold text-blue-600 font-mono tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Descripción Detallada</Label>
                  <Textarea 
                    value={productForm.description || ""} 
                    onChange={e => onProductFormChange({ ...productForm, description: e.target.value })} 
                    placeholder="Incluye especificaciones técnicas o características del producto..." 
                    className="resize-none min-h-[80px] rounded-xl p-4 text-sm font-medium leading-relaxed"
                  />
                </div>
              </TabsContent>

              {/* Tab 2: Prices and Inventory */}
              <TabsContent value="advanced" className="mt-0 space-y-8">
                {/* Financial Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gestión de Precios</Label>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl transition-all hover:shadow-sm">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Costo Bruto <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            type="number" 
                            value={productForm.costPrice} 
                            onChange={e => onProductFormChange({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })} 
                            className="pl-9 h-11 text-lg font-bold bg-white dark:bg-zinc-950 rounded-xl" 
                            required
                          />
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl transition-all hover:shadow-sm">
                        <Label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">Precio Mayoreo</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                          <Input 
                            type="number" 
                            value={productForm.wholesalePrice} 
                            onChange={e => onProductFormChange({ ...productForm, wholesalePrice: parseFloat(e.target.value) || 0 })} 
                            className="pl-9 h-11 text-lg font-bold bg-white dark:bg-zinc-950 rounded-xl text-amber-600" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 p-5 rounded-3xl shadow-sm shadow-primary/10 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 hover:scale-150" />
                      
                      <div className="relative z-10 space-y-3">
                        <Label className="text-xs font-bold text-primary uppercase tracking-widest">Precio Venta (Retail) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                          <Input 
                            type="number" 
                            value={productForm.salePrice} 
                            onChange={e => onProductFormChange({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })} 
                            className="pl-12 h-16 text-3xl font-black bg-white dark:bg-zinc-950 rounded-2xl border-primary/20 text-primary shadow-inner" 
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between border border-primary/10 mt-6 relative z-10">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Margen</span>
                          <Badge variant="outline" className={`border-none px-2 py-0.5 text-xs font-black ${profitStats.margin > 20 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {profitStats.margin.toFixed(1)}%
                          </Badge>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-slate-200 dark:bg-zinc-800" />
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ganancia Neta</span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                            ${profitStats.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Existencias</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-[20px] transition-all duration-300 hover:shadow-sm">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Unidad <span className="text-red-500">*</span></Label>
                        <Select 
                          value={productForm.unit} 
                          onValueChange={v => onProductFormChange({ ...productForm, unit: v })}
                          required
                        >
                          <SelectTrigger className="h-8 font-black text-base bg-transparent border-none p-0 focus:ring-0 shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["unidad", "kg", "litro", "metro", "paquete", "caja"].map(u => (
                              <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 p-4 rounded-[20px] transition-all duration-300 hover:shadow-sm">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Carga<br/>Inicial</Label>
                        <Input 
                          type="number" 
                          value={productForm.stock} 
                          onChange={e => onProductFormChange({ ...productForm, stock: parseInt(e.target.value) || 0 })} 
                          className="h-8 font-black text-xl border-none bg-transparent focus:ring-0 shadow-none p-0"
                        />
                      </div>
                      <div className="col-span-2 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 p-5 rounded-[20px] flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3"/> Alerta de Stock Crítico
                          </Label>
                          <p className="text-[10px] text-rose-400/80 font-medium">Notificar cuando baje de este valor</p>
                        </div>
                        <Input 
                          type="number" 
                          value={productForm.minStock} 
                          onChange={e => onProductFormChange({ ...productForm, minStock: parseInt(e.target.value) || 5 })} 
                          className="w-16 h-10 text-xl font-black text-rose-600 border-none bg-transparent focus:ring-0 shadow-none text-right p-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trazabilidad</Label>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-[24px] shadow-sm shadow-slate-200/50 dark:shadow-none space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                          <Briefcase className="w-3.5 h-3.5"/> Proveedor
                        </Label>
                        <Select value={productForm.supplierId || ""} onValueChange={v => onProductFormChange({ ...productForm, supplierId: v })}>
                          <SelectTrigger className="h-11 font-bold bg-white dark:bg-zinc-950 rounded-full border-slate-200 dark:border-zinc-800 hover:border-slate-300 px-4 focus:ring-indigo-500/20 shadow-sm transition-all">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            {suppliers.map(s => (
                              <SelectItem key={s.id} value={s.id} className="font-bold rounded-xl cursor-pointer">{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2 group">
                          <Label className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 ml-1">
                            <Tag className="w-3.5 h-3.5"/> Lote No.
                          </Label>
                          <Input 
                            value={productForm.batchNumber || ""} 
                            onChange={e => onProductFormChange({ ...productForm, batchNumber: e.target.value })} 
                            placeholder="LOT-70" 
                            className="h-11 font-bold bg-white dark:bg-zinc-950 rounded-full border-slate-200 dark:border-zinc-800 px-4 hover:border-slate-300 focus:border-indigo-500 shadow-sm transition-all text-center uppercase"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <Label className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 ml-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block" /> Expiración
                          </Label>
                          <Input 
                            type="date" 
                            value={productForm.expiryDate || ""} 
                            onChange={e => onProductFormChange({ ...productForm, expiryDate: e.target.value })} 
                            className="h-11 font-bold bg-white dark:bg-zinc-950 rounded-full border-slate-200 dark:border-zinc-800 px-4 hover:border-slate-300 focus:border-indigo-500 shadow-sm transition-all text-center cursor-pointer text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-6 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-950 flex items-center justify-center border border-slate-200 dark:border-zinc-800 shadow-sm">
                  <LayoutGrid className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fost POS</span>
                  <span className="text-[8px] font-medium text-slate-400">Panel de Inventario</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  className="rounded-xl h-11 px-6 font-bold text-xs uppercase transition-all"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 sm:flex-none min-w-[160px] h-11 bg-primary hover:bg-primary/90 rounded-xl font-bold text-sm uppercase shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:-translate-y-0.5"
                >
                  {editingProduct ? "Actualizar Producto" : "Guardar Producto"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
