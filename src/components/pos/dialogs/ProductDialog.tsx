"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ImagePlus, X, Loader2, Package, AlignLeft, Tag, 
  DollarSign, Barcode, Calendar, Info, Layers, 
  Percent, TrendingUp, Sparkles, LayoutGrid
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
  categories: any []
  onSubmit: (e: React.FormEvent) => void
  editingProduct?: any
  userRole?: string
}

export const ProductDialog = ({
  open,
  onOpenChange,
  productForm,
  onProductFormChange,
  categories,
  onSubmit,
  editingProduct,
  userRole
}: ProductDialogProps) => {
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
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

  // Margin Calculation
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
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Sparkles className="w-24 h-24" />
          </div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                 <Package className="w-6 h-6 text-white" />
               </div>
               <Badge variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30 capitalize">
                 {editingProduct ? "Modo Edición" : "Inventario"}
               </Badge>
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight text-white mb-1">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription className="text-emerald-50/80 font-medium">
              {editingProduct 
                ? `Actualizando información de: ${editingProduct.name}`
                : "Completa los detalles para añadir un nuevo ítem al catálogo."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
            <TabsList className="bg-transparent h-12 gap-6 w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-0 pb-3 font-bold transition-all gap-2 h-full">
                <Info className="w-4 h-4" /> Básico
              </TabsTrigger>
              <TabsTrigger value="id" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-0 pb-3 font-bold transition-all gap-2 h-full">
                <Barcode className="w-4 h-4" /> Identificación
              </TabsTrigger>
              <TabsTrigger value="prices" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-0 pb-3 font-bold transition-all gap-2 h-full">
                <DollarSign className="w-4 h-4" /> Precios
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-0 pb-3 font-bold transition-all gap-2 h-full">
                <Layers className="w-4 h-4" /> Inventario
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={onSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <TabsContent value="general" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 mb-3 block tracking-widest">Visual del Producto</Label>
                    <div 
                      className="relative group w-full aspect-square rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      {productForm.imageUrl ? (
                        <>
                          <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-white text-emerald-600 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <ImagePlus className="w-6 h-6" />
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-emerald-500 transition-colors px-4 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-1 shadow-inner group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:scale-110 transition-all duration-300">
                            {uploading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-500" /> : <ImagePlus className="w-8 h-8" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1">{uploading ? "Subiendo..." : "Subir Imagen"}</span>
                            <span className="text-[10px] text-slate-400">Máx 5MB (PNG, JPG)</span>
                          </div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3 text-emerald-500" /> Nombre del Producto
                      </Label>
                      <Input 
                        value={productForm.name} 
                        onChange={e => onProductFormChange({ ...productForm, name: e.target.value })} 
                        placeholder="Ej: Coca Cola Original 2.5L" 
                        required 
                        className="h-12 text-lg font-bold border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-emerald-500" 
                      />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                        <LayoutGrid className="w-3 h-3 text-emerald-500" /> Categoría
                      </Label>
                      <Select value={productForm.categoryId} onValueChange={v => onProductFormChange({ ...productForm, categoryId: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-zinc-800">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id} className="cursor-pointer py-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#10b981' }} />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                        <AlignLeft className="w-3 h-3 text-emerald-500" /> Descripción
                      </Label>
                      <Textarea 
                        value={productForm.description || ""} 
                        onChange={e => onProductFormChange({ ...productForm, description: e.target.value })} 
                        placeholder="Escribe detalles adicionales, ingredientes o características..." 
                        className="resize-none min-h-[100px] rounded-2xl border-slate-200 dark:border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="id" className="mt-0 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800">
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
                        <Label className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 block">Código de Barras</Label>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <Input 
                            value={productForm.code} 
                            onChange={e => onProductFormChange({ ...productForm, code: e.target.value })} 
                            placeholder="Escanea o escribe..." 
                            className="pl-11 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic px-1">Usa cualquier escáner USB o Bluetooth compatible.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
                        <Label className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 block">SKU / Código Interno</Label>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                          <Input 
                            value={productForm.sku} 
                            onChange={e => onProductFormChange({ ...productForm, sku: e.target.value })} 
                            placeholder="Ej: BEB-001..." 
                            className="pl-11 h-12 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic px-1">Referencia interna opcional para tu negocio.</p>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
                        <Label className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 block">Unidad de Medida</Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                           {["unidad", "kg", "litro", "metro", "paquete"].map((unit) => (
                             <button
                               key={unit}
                               type="button"
                               onClick={() => onProductFormChange({ ...productForm, unit })}
                               className={`
                                 py-3 px-2 rounded-xl text-xs font-bold transition-all border
                                 ${productForm.unit === unit 
                                   ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800"
                                   : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-500"}
                               `}
                             >
                               {unit.charAt(0).toUpperCase() + unit.slice(1)}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="prices" className="mt-0 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3">
                      <div className="flex h-10 w-10 bg-slate-100 dark:bg-zinc-900 rounded-xl items-center justify-center text-slate-500 mb-2">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Costo de Adquisición</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          type="number" 
                          value={productForm.costPrice} 
                          onChange={e => onProductFormChange({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })} 
                          className="pl-10 h-12 text-lg font-black rounded-xl" 
                          disabled={!isAdmin}
                        />
                      </div>
                      {!isAdmin && <p className="text-[9px] text-red-500 font-bold italic mt-1">Solo administradores pueden editar costos.</p>}
                    </div>

                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-500">
                        <Sparkles className="w-12 h-12 text-emerald-600" />
                      </div>
                      <div className="flex h-10 w-10 bg-emerald-500 rounded-xl items-center justify-center text-white mb-2 shadow-md shadow-emerald-500/20">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <Label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Precio de Venta *</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={productForm.salePrice} 
                          onChange={e => onProductFormChange({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })} 
                          className="pl-3 h-12 text-2xl font-black rounded-xl border-emerald-200 focus:ring-emerald-500" 
                          required 
                          disabled={!isAdmin}
                        />
                      </div>
                      {!isAdmin && <p className="text-[9px] text-red-500 font-bold italic mt-1">Solo administradores pueden editar precios.</p>}
                    </div>

                    <div className="bg-white dark:bg-zinc-950 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-3 italic">
                      <div className="flex h-10 w-10 bg-slate-50 dark:bg-zinc-900 rounded-xl items-center justify-center text-slate-400 mb-2">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mayoreo (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          type="number" 
                          value={productForm.wholesalePrice} 
                          onChange={e => onProductFormChange({ ...productForm, wholesalePrice: parseFloat(e.target.value) || 0 })} 
                          className="pl-10 h-12 text-lg font-bold rounded-xl text-slate-400" 
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 dark:shadow-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Percent className="w-32 h-32" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <Percent className="w-7 h-7 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest leading-tight">Margen de Ganancia</p>
                            <h3 className="text-3xl font-black">{profitStats.margin.toFixed(1)}%</h3>
                          </div>
                       </div>
                       
                       <Separator orientation="vertical" className="hidden md:block h-12 bg-white/10" />

                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <TrendingUp className="w-7 h-7 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest leading-tight">Utilidad por Unidad</p>
                            <h3 className="text-3xl font-black text-emerald-400">
                              +${profitStats.profit.toLocaleString()}
                            </h3>
                          </div>
                       </div>

                       <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-bold border border-white/10 backdrop-blur-sm self-end md:self-center">
                         Cálculo automático basado en precios
                       </div>
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="inventory" className="mt-0 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Niveles de Unidades</span>
                       </div>
                       
                       <div className="space-y-4">
                         <div className="space-y-2">
                            <Label className="text-sm font-bold flex items-center justify-between">
                              Stock Disponible
                              <Badge variant="outline" className="text-[10px] font-black border-slate-200">{productForm.unit}</Badge>
                            </Label>
                            <Input 
                              type="number" 
                              value={productForm.stock} 
                              onChange={e => onProductFormChange({ ...productForm, stock: parseInt(e.target.value) || 0 })} 
                              className="h-12 text-xl font-black rounded-xl bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800" 
                            />
                         </div>

                         <div className="space-y-2">
                            <Label className="text-sm font-bold text-red-600 flex items-center gap-2">
                              Alerta de Stock Mínimo
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            </Label>
                            <Input 
                              type="number" 
                              value={productForm.minStock} 
                              onChange={e => onProductFormChange({ ...productForm, minStock: parseInt(e.target.value) || 5 })} 
                              className="h-12 text-lg font-bold rounded-xl bg-white dark:bg-zinc-950 border-red-100 dark:border-red-900/30 text-red-600" 
                            />
                         </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                         <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="w-3 h-3" /> Fecha de Vencimiento
                            </Label>
                            <Input 
                              type="date" 
                              value={productForm.expiryDate || ""} 
                              onChange={e => onProductFormChange({ ...productForm, expiryDate: e.target.value })} 
                              className="h-11 rounded-xl cursor-pointer bg-slate-50 border-slate-100"
                            />
                         </div>

                         <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Info className="w-3 h-3 text-emerald-500" />
                              Estado del Producto
                            </Label>
                            <Select 
                              value={productForm.isActive ? "true" : "false"} 
                              onValueChange={v => onProductFormChange({ ...productForm, isActive: v === "true" })}
                            >
                              <SelectTrigger className={`h-11 rounded-xl font-bold transition-all ${productForm.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="true" className="font-bold text-emerald-600">Activo (Disponible)</SelectItem>
                                <SelectItem value="false" className="font-bold text-red-600">Inactivo (Oculto)</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                       </div>

                       <div className="bg-emerald-500/5 p-4 rounded-3xl border border-emerald-500/10 flex gap-3 items-start">
                          <Info className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] leading-relaxed text-emerald-700/70 font-bold italic uppercase tracking-wider">
                            Configura alertas automáticas para que el sistema te notifique cuando un producto esté por agotarse o vencer.
                          </p>
                       </div>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-6 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 sm:justify-between items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 text-slate-400">
                  <Package className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fost POS v2.0</span>
               </div>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold hover:bg-slate-200 cursor-pointer">
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1 sm:flex-none min-w-[200px] h-12 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer">
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
