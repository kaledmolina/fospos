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
  TrendingUp, LayoutGrid, Briefcase, AlertTriangle, Scale, Plus, Trash2
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
  onOpenCategoryDialog?: () => void
  onOpenSupplierDialog?: () => void
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
  suppliers,
  onOpenCategoryDialog,
  onOpenSupplierDialog
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
      <DialogContent className="max-w-4xl p-0 overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl rounded-2xl bg-white dark:bg-zinc-950 flex flex-col max-h-[95vh]">
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

        {(!categories || categories.length === 0) && (
          <div className="mx-8 mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-500">Atención: No has creado ninguna categoría</h4>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                  Para poder registrar un producto, es obligatorio asignarle una categoría.
                </p>
              </div>
            </div>
            {onOpenCategoryDialog && (
              <Button size="sm" type="button" onClick={onOpenCategoryDialog} className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-md">
                Crear Categoría
              </Button>
            )}
          </div>
        )}
        
        {(!suppliers || suppliers.length === 0) && (
          <div className="mx-8 mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-500">Sugerencia: Sin proveedores registrados</h4>
                <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1">
                  Te recomendamos registrar tus proveedores para llevar una mejor trazabilidad del inventario.
                </p>
              </div>
            </div>
            {onOpenSupplierDialog && (
              <Button size="sm" type="button" onClick={onOpenSupplierDialog} className="bg-blue-500 hover:bg-blue-600 text-white shrink-0 shadow-md">
                Crear Proveedor
              </Button>
            )}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className={`w-full flex-1 flex flex-col min-h-0 ${(!categories || categories.length === 0) ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="px-8 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/30">
            <TabsList className="bg-slate-200/50 dark:bg-zinc-800/50 h-12 p-1 gap-1 rounded-2xl my-3">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                1. General
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                2. Precios
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                3. Stock
              </TabsTrigger>
              <TabsTrigger 
                value="presentations" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-primary data-[state=active]:shadow-sm relative font-bold text-xs px-6 h-full rounded-xl transition-all duration-300"
              >
                4. Unidades
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
              </TabsContent>

              {/* Tab 3: Inventory and Logistics */}
              <TabsContent value="inventory" className="mt-0 space-y-8">
                {/* Logistics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          disabled={!!editingProduct}
                        >
                          <SelectTrigger className={`h-8 font-black text-base bg-transparent border-none p-0 focus:ring-0 shadow-none ${!!editingProduct ? 'opacity-50' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["unidad", "paquete", "caja", "docena", "bolsa", "kg", "lb", "g", "litro", "ml", "galón", "metro"].map(u => (
                              <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!!editingProduct && <p className="text-[8px] text-slate-400 mt-1 italic">No editable con historial</p>}
                      </div>
                      <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 p-4 rounded-[20px] transition-all duration-300 hover:shadow-sm relative">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Carga<br/>Inicial</Label>
                        <Input 
                          type="number" 
                          step="any"
                          value={productForm.stock} 
                          onChange={e => onProductFormChange({ ...productForm, stock: parseFloat(e.target.value) || 0 })} 
                          className="h-8 font-black text-xl border-none bg-transparent focus:ring-0 shadow-none p-0"
                          disabled={!!editingProduct}
                        />
                        {!!editingProduct && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="absolute top-2 right-2 cursor-help">
                                  <Info className="w-3 h-3 text-slate-300" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="text-[10px]">Usa 'Ajuste de Stock' para cambiar existencias</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
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
                          step="any"
                          value={productForm.minStock} 
                          onChange={e => onProductFormChange({ ...productForm, minStock: parseFloat(e.target.value) || 5 })} 
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
                          <Briefcase className="w-3.5 h-3.5"/> Proveedor <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={productForm.supplierId || ""} 
                          onValueChange={v => onProductFormChange({ ...productForm, supplierId: v })}
                          required
                        >
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
                            className="h-11 text-xs font-bold bg-white dark:bg-zinc-950 rounded-full border-slate-200 dark:border-zinc-800 px-3 hover:border-slate-300 focus:border-indigo-500 shadow-sm transition-all text-center uppercase"
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
                            className="h-11 text-xs font-bold bg-white dark:bg-zinc-950 rounded-full border-slate-200 dark:border-zinc-800 px-3 hover:border-slate-300 focus:border-indigo-500 shadow-sm transition-all cursor-pointer w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tab 4: Sales Presentations */}
              <TabsContent value="presentations" className="mt-0 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" /> Presentaciones de Venta
                    </Label>
                    <p className="text-[10px] text-slate-500 font-medium">Define cómo vendes este producto (libras, cajas, etc.) respecto a su unidad base ({productForm.unit})</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const baseUnit = productForm.unit?.toLowerCase();
                      const existing = productForm.presentations || [];
                      let newPres = { name: "", unit: "", conversionFactor: 1, price: null };

                      // Sugerencias inteligentes basadas en unidad base
                      const normalizedBase = baseUnit.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                      let suggestions: any[] = [];

                      switch (normalizedBase) {
                        // --- PESO ---
                        case "kg":
                        case "kilogramo":
                          suggestions = [
                            { name: "Libra Comercial", unit: "lb", conversionFactor: 0.5 },
                            { name: "Media Libra", unit: "1/2 lb", conversionFactor: 0.25 },
                            { name: "Gramos", unit: "g", conversionFactor: 0.001 },
                            { name: "Arroba", unit: "@", conversionFactor: 12.5 },
                            { name: "Bulto / Saco", unit: "bulto", conversionFactor: 50 }
                          ];
                          break;
                        case "lb":
                        case "libra":
                          suggestions = [
                            { name: "Media Libra", unit: "1/2 lb", conversionFactor: 0.5 },
                            { name: "Cuarto de Libra", unit: "1/4 lb", conversionFactor: 0.25 },
                            { name: "Onza", unit: "oz", conversionFactor: 0.0625 },
                            { name: "Gramos", unit: "g", conversionFactor: 0.002 } // 1lb = 500g comercial
                          ];
                          break;
                        case "g":
                        case "gramo":
                        case "gramos":
                          suggestions = [
                            { name: "Kilo", unit: "kg", conversionFactor: 1000 },
                            { name: "Libra Comercial", unit: "lb", conversionFactor: 500 },
                            { name: "Porción (100g)", unit: "porc", conversionFactor: 100 }
                          ];
                          break;

                        // --- VOLUMEN ---
                        case "litro":
                        case "l":
                          suggestions = [
                            { name: "Medio Litro", unit: "500ml", conversionFactor: 0.5 },
                            { name: "Cuarto de Litro", unit: "250ml", conversionFactor: 0.25 },
                            { name: "Botella", unit: "750ml", conversionFactor: 0.75 },
                            { name: "Mililitros", unit: "ml", conversionFactor: 0.001 },
                            { name: "Galón", unit: "gal", conversionFactor: 3.785 }
                          ];
                          break;
                        case "ml":
                        case "mililitro":
                        case "mililitros":
                          suggestions = [
                            { name: "Litro", unit: "L", conversionFactor: 1000 },
                            { name: "Botella", unit: "bot", conversionFactor: 750 },
                            { name: "Vaso/Taza", unit: "taza", conversionFactor: 250 }
                          ];
                          break;
                        case "galon":
                          suggestions = [
                            { name: "Litro", unit: "L", conversionFactor: 0.264172 },
                            { name: "Cuarto de Galón", unit: "qt", conversionFactor: 0.25 },
                            { name: "Botella (750ml)", unit: "bot", conversionFactor: 0.198 }
                          ];
                          break;

                        // --- UNIDADES / CONTEO ---
                        case "unidad":
                        case "und":
                          suggestions = [
                            { name: "Par", unit: "par", conversionFactor: 2 },
                            { name: "Media Docena", unit: "1/2 doc", conversionFactor: 6 },
                            { name: "Docena", unit: "doc", conversionFactor: 12 },
                            { name: "Quincena", unit: "quin", conversionFactor: 15 },
                            { name: "Cubeta / Panal", unit: "cub", conversionFactor: 30 },
                            { name: "Paca / Six-Pack", unit: "pack", conversionFactor: 6 }
                          ];
                          break;
                        case "docena":
                          suggestions = [
                            { name: "Media Docena", unit: "1/2 doc", conversionFactor: 0.5 },
                            { name: "Unidad", unit: "und", conversionFactor: 0.083333 }
                          ];
                          break;
                        case "paquete":
                        case "caja":
                        case "bolsa":
                          suggestions = [
                            { name: "Unidad Individual", unit: "und", conversionFactor: 0.083333 }, // Default 12
                            { name: "Medio Paquete/Caja", unit: "1/2 pq", conversionFactor: 0.5 }
                          ];
                          break;

                        // --- LONGITUD ---
                        case "metro":
                        case "m":
                          suggestions = [
                            { name: "Medio Metro", unit: "1/2 m", conversionFactor: 0.5 },
                            { name: "Centímetro", unit: "cm", conversionFactor: 0.01 },
                            { name: "Milímetro", unit: "mm", conversionFactor: 0.001 },
                            { name: "Yarda", unit: "yd", conversionFactor: 0.9144 },
                            { name: "Rollo (50m)", unit: "rollo", conversionFactor: 50 }
                          ];
                          break;
                      }

                      if (suggestions.length > 0) {
                        const next = suggestions.find(s => !existing.some((e: any) => e.name.toLowerCase() === s.name.toLowerCase()));
                        if (next) newPres = { ...next, price: null };
                      }

                      onProductFormChange({
                        ...productForm,
                        presentations: [...existing, newPres]
                      });
                    }}
                    className="h-8 text-[10px] font-bold uppercase tracking-wider gap-1.5 rounded-xl border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-3 h-3" /> Añadir Sugerencia
                  </Button>
                </div>

                <div className="space-y-3">
                  {(productForm.presentations || []).map((pres: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nombre (Ej: Libra)</Label>
                          <Input 
                            value={pres.name}
                            onChange={e => {
                              const newPres = [...productForm.presentations]
                              newPres[idx].name = e.target.value
                              onProductFormChange({ ...productForm, presentations: newPres })
                            }}
                            className="h-9 font-bold rounded-xl"
                            placeholder="Libra"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Unidad (Ej: lb)</Label>
                          <Input 
                            value={pres.unit}
                            onChange={e => {
                              const newPres = [...productForm.presentations]
                              newPres[idx].unit = e.target.value
                              onProductFormChange({ ...productForm, presentations: newPres })
                            }}
                            className="h-9 font-bold rounded-xl"
                            placeholder="lb"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-indigo-500 ml-1">Factor de Conversión</Label>
                          <Input 
                            type="number"
                            step="any"
                            value={pres.conversionFactor}
                            onChange={e => {
                              const newPres = [...productForm.presentations]
                              newPres[idx].conversionFactor = parseFloat(e.target.value) || 0
                              onProductFormChange({ ...productForm, presentations: newPres })
                            }}
                            className="h-9 font-black rounded-xl border-indigo-200 dark:border-indigo-900/50"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <Label className="text-[9px] font-black uppercase text-emerald-500 ml-1">Precio Específico (Opcional)</Label>
                            <Input 
                              type="number"
                              value={pres.price || ""}
                              onChange={e => {
                                const newPres = [...productForm.presentations]
                                newPres[idx].price = e.target.value === "" ? null : parseFloat(e.target.value)
                                onProductFormChange({ ...productForm, presentations: newPres })
                              }}
                              className="h-9 font-black rounded-xl border-emerald-200 dark:border-emerald-900/50"
                              placeholder="Usar cálculo automático"
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const newPres = productForm.presentations.filter((_: any, i: number) => i !== idx)
                              onProductFormChange({ ...productForm, presentations: newPres })
                            }}
                            className="h-9 w-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 px-1 flex items-center gap-2">
                        <Info className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-500 italic">
                          Vender 1 {pres.name || '...'} descontará {pres.conversionFactor} {productForm.unit} del inventario.
                          {!pres.price && ` Precio calculado: $${(productForm.salePrice * pres.conversionFactor).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  ))}

                  {(productForm.presentations || []).length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-zinc-900 rounded-3xl">
                      <p className="text-xs font-medium text-slate-400">No hay presentaciones adicionales. El producto se vende solo por {productForm.unit}.</p>
                    </div>
                  )}
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
                  disabled={!categories || categories.length === 0}
                  className="flex-1 sm:flex-none min-w-[160px] h-11 bg-primary hover:bg-primary/90 rounded-xl font-bold text-sm uppercase shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
