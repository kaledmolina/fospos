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
  Percent, TrendingUp, Sparkles, LayoutGrid, Briefcase
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
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-zinc-950">
        <div className="bg-primary/95 backdrop-blur-md px-10 py-12 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12 blur-2xl">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="absolute bottom-[-10%] left-[-5%] opacity-5 -rotate-12">
            <Package className="w-48 h-48" />
          </div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/20 shadow-2xl shadow-black/5">
                <Package className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                {editingProduct ? "Modo Edición" : "Gestión de Catálogo"}
              </Badge>
            </div>
            <DialogTitle className="text-5xl font-black tracking-tight text-white mb-3">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/90 font-medium text-xl leading-relaxed max-w-2xl opacity-80">
              {editingProduct 
                ? `Estás optimizando los detalles comerciales de "${editingProduct.name}".`
                : "Configura las especificaciones técnicas, precios y niveles de stock inicial."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white dark:bg-zinc-950 px-10 border-b border-slate-100 dark:border-zinc-800/50">
            <TabsList className="bg-transparent h-16 p-0 gap-10 w-full justify-start overflow-x-auto no-scrollbar">
              {["general", "id", "prices", "inventory"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-primary relative font-black uppercase text-[11px] tracking-[0.25em] px-0 h-full transition-all border-none rounded-none shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-500"
                >
                  {tab === "general" ? "General" : tab === "id" ? "Identificación" : tab === "prices" ? "Precios" : "Inventario"}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col overflow-hidden h-full">
            <div className="p-10 max-h-[65vh] overflow-y-auto custom-scrollbar group/scroll">
              <TabsContent value="general" className="mt-0 space-y-12 py-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-4 lg:col-span-3">
                    <Label className="text-[11px] font-black uppercase text-slate-500 mb-4 block tracking-[0.2em] px-1">Imagen Principal</Label>
                    <div 
                      className="relative group w-full aspect-square rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-900/50 transition-all hover:border-primary hover:bg-white dark:hover:bg-zinc-950 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      {productForm.imageUrl ? (
                        <>
                          <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[4px]">
                            <div className="bg-white text-primary p-5 rounded-3xl shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                              <ImagePlus className="w-8 h-8" />
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-2xl shadow-2xl hover:bg-red-600 transition-all transform hover:rotate-90 active:scale-90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-5 text-slate-400 group-hover:text-primary transition-all px-8 text-center">
                          <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-zinc-950 flex items-center justify-center mb-2 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:scale-110 transition-all duration-700">
                            {uploading ? <Loader2 className="w-12 h-12 animate-spin text-primary" /> : <ImagePlus className="w-12 h-12" />}
                          </div>
                          <div>
                            <span className="text-sm font-black uppercase tracking-[0.2em] block mb-2">Subir Recurso</span>
                            <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Optimizado para 1080px</span>
                          </div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="md:col-span-8 lg:col-span-9 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-3">
                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                          Nombre del Producto <span className="text-primary text-lg">*</span>
                        </Label>
                        <Input 
                          value={productForm.name} 
                          onChange={e => onProductFormChange({ ...productForm, name: e.target.value })} 
                          placeholder="Nombre comercial o referencia" 
                          required 
                          className="h-16 text-2xl font-black border-slate-200 dark:border-zinc-800 rounded-[1.5rem] focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all bg-white dark:bg-zinc-950" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                          Clasificación / Categoría
                        </Label>
                        <Select value={productForm.categoryId} onValueChange={v => onProductFormChange({ ...productForm, categoryId: v })}>
                          <SelectTrigger className="h-16 rounded-[1.5rem] border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-black text-lg px-8 hover:border-primary transition-all">
                            <SelectValue placeholder="Seleccionar familia..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-[2rem] border-slate-100 p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="cursor-pointer py-4 rounded-xl focus:bg-primary/5">
                                <div className="flex items-center gap-4">
                                  <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: cat.color || '#10b981' }} />
                                  <span className="font-black text-lg tracking-tight">{cat.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                          Estado en Inventario
                        </Label>
                        <Select 
                          value={productForm.isActive ? "true" : "false"} 
                          onValueChange={v => onProductFormChange({ ...productForm, isActive: v === "true" })}
                        >
                          <SelectTrigger className={`h-16 rounded-[1.5rem] font-black text-lg px-8 transition-all border-2 ${productForm.isActive ? "bg-emerald-50/50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30" : "bg-rose-50/50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30"}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-[1.5rem] p-2">
                            <SelectItem value="true" className="font-black py-3">ACTIVO - DISPONIBLE</SelectItem>
                            <SelectItem value="false" className="font-black py-3">INACTIVO - OCULTO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                        Especificaciones / Descripción
                      </Label>
                      <Textarea 
                        value={productForm.description || ""} 
                        onChange={e => onProductFormChange({ ...productForm, description: e.target.value })} 
                        placeholder="Define las ventajas competitivas y detalles técnicos del producto..." 
                        className="resize-none min-h-[160px] rounded-[1.8rem] border-slate-200 dark:border-zinc-800 p-8 text-lg font-medium leading-relaxed transition-all focus:border-primary focus:ring-8 focus:ring-primary/5 bg-white dark:bg-zinc-950"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="id" className="mt-0 space-y-12 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Código Universal</Label>
                        <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400 tracking-[0.1em]">EAN / UPC / GTIN</Badge>
                      </div>
                      <div className="relative group">
                        <Barcode className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300 group-focus-within:text-primary transition-all duration-500" />
                        <Input 
                          value={productForm.code} 
                          onChange={e => onProductFormChange({ ...productForm, code: e.target.value })} 
                          placeholder="Escanea el código de barras..." 
                          className="pl-16 h-20 text-2xl font-black rounded-[1.8rem] border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-8 focus:ring-primary/5 transition-all tracking-widest placeholder:tracking-normal"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <Label className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Referencia SKU Interna</Label>
                      </div>
                      <div className="relative group">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300 group-focus-within:text-blue-600 transition-all duration-500" />
                        <Input 
                          value={productForm.sku} 
                          onChange={e => onProductFormChange({ ...productForm, sku: e.target.value })} 
                          placeholder="Ej: ABA-COCA-600ML" 
                          className="pl-16 h-20 text-2xl font-black rounded-[1.8rem] border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-8 focus:ring-blue-600/5 transition-all tracking-widest placeholder:tracking-normal"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-12 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 space-y-10 shadow-inner">
                    <div className="space-y-3">
                      <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Unidad de Venta</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Selecciona el estándar de despacho</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {["unidad", "kg", "litro", "metro", "paquete", "caja"].map((unit) => (
                         <button
                           key={unit}
                           type="button"
                           onClick={() => onProductFormChange({ ...productForm, unit })}
                           className={`
                             py-5 px-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2
                             ${productForm.unit === unit 
                               ? "bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105"
                               : "bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 text-slate-400 hover:border-primary hover:text-primary"}
                           `}
                         >
                           {unit}
                         </button>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-slate-200/50 dark:border-zinc-800/50 flex items-start gap-5">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <Info className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-[0.15em] italic">
                        Esta unidad define cómo se descontará el stock y cómo se mostrará en los tickets de venta.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prices" className="mt-0 space-y-12 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 space-y-6 transition-all hover:bg-white dark:hover:bg-zinc-950 group shadow-sm hover:shadow-2xl">
                    <div className="flex h-14 w-14 bg-white dark:bg-zinc-950 rounded-2xl items-center justify-center text-slate-400 group-hover:text-primary group-hover:shadow-2xl transition-all border border-slate-100 dark:border-zinc-800">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Costo Neto</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                        <Input 
                          type="number" 
                          value={productForm.costPrice} 
                          onChange={e => onProductFormChange({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })} 
                          className="pl-8 h-12 text-3xl font-black border-none bg-transparent focus:ring-0 shadow-none ring-0 w-full" 
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-10 rounded-[3rem] border-2 border-primary/20 space-y-6 relative overflow-hidden group shadow-2xl shadow-primary/5 transition-all hover:scale-105">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-150 transition-transform duration-1000">
                      <Sparkles className="w-32 h-32 text-primary" />
                    </div>
                    <div className="flex h-14 w-14 bg-primary rounded-2xl items-center justify-center text-white shadow-2xl shadow-primary/30">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] px-1">Precio Retail</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={productForm.salePrice} 
                          onChange={e => onProductFormChange({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })} 
                          className="h-12 text-4xl font-black border-none bg-transparent focus:ring-0 shadow-none ring-0 w-full text-primary" 
                          required 
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 space-y-6 opacity-60 hover:opacity-100 transition-all hover:bg-white dark:hover:bg-zinc-950 group">
                    <div className="flex h-14 w-14 bg-white dark:bg-zinc-950 rounded-2xl items-center justify-center text-slate-300 group-hover:text-amber-500 transition-all">
                      <LayoutGrid className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Precio Mayoreo</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200" />
                        <Input 
                          type="number" 
                          value={productForm.wholesalePrice} 
                          onChange={e => onProductFormChange({ ...productForm, wholesalePrice: parseFloat(e.target.value) || 0 })} 
                          className="pl-8 h-12 text-3xl font-black border-none bg-transparent focus:ring-0 shadow-none ring-0 w-full text-slate-400" 
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-12 rounded-[4rem] text-white shadow-3xl shadow-primary/20 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-16 opacity-5 blur-sm group-hover:scale-125 transition-transform duration-1000">
                    <Percent className="w-64 h-64" />
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-around gap-16 relative z-10">
                     <div className="flex items-center gap-8">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl shadow-2xl">
                          <Percent className="w-12 h-12 text-primary" />
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Margen Operativo</p>
                          <h3 className="text-6xl font-black tracking-tighter">{profitStats.margin.toFixed(1)}%</h3>
                        </div>
                     </div>
                     
                     <div className="hidden md:block w-px h-24 bg-white/10" />

                     <div className="flex items-center gap-8">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl shadow-2xl">
                          <TrendingUp className="w-12 h-12 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Ganancia Est.</p>
                          <h3 className="text-6xl font-black tracking-tighter text-emerald-400">
                            +${profitStats.profit.toLocaleString()}
                          </h3>
                        </div>
                     </div>
                  </div>
                  <div className="mt-12 text-center">
                    <span className="bg-white/5 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-white/5 text-white/20 backdrop-blur-md">
                      Métricas calculadas en tiempo real (PVP - Costo)
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="mt-0 space-y-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Control de Existencias</Label>
                      <div className="grid grid-cols-1 gap-8">
                        <div className="bg-slate-50 dark:bg-zinc-900/50 p-12 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 space-y-6 shadow-inner group/stock">
                          <div className="flex items-center justify-between mb-2">
                             <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Carga Inicial</Label>
                             <Badge className="bg-primary text-white rounded-xl border-none px-4 py-2 font-black text-[11px] uppercase shadow-2xl shadow-primary/40 tracking-widest">{productForm.unit}</Badge>
                          </div>
                          <div className="relative">
                            <Input 
                              type="number" 
                              value={productForm.stock} 
                              onChange={e => onProductFormChange({ ...productForm, stock: parseInt(e.target.value) || 0 })} 
                              className="h-24 text-8xl font-black border-none bg-transparent focus:ring-0 shadow-none p-0 tracking-tighter transition-all group-hover/stock:scale-105 origin-left" 
                            />
                            <div className="absolute right-0 bottom-4 text-slate-200 dark:text-zinc-800/50 font-black text-5xl select-none uppercase tracking-tighter">
                              {productForm.unit.slice(0, 3)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-rose-50/50 dark:bg-rose-950/10 p-10 rounded-[3rem] border border-rose-100 dark:border-rose-900/20 flex items-center justify-between gap-10 transition-all hover:bg-rose-50 dark:hover:bg-rose-950/20 group/alert">
                          <div className="space-y-1">
                            <Label className="text-[11px] font-black uppercase text-rose-400 tracking-[0.2em]">Umbral de Notificación</Label>
                            <p className="text-[10px] text-rose-300 font-bold uppercase tracking-widest leading-none">Stock crítico de reposición</p>
                          </div>
                          <Input 
                            type="number" 
                            value={productForm.minStock} 
                            onChange={e => onProductFormChange({ ...productForm, minStock: parseInt(e.target.value) || 5 })} 
                            className="w-32 h-16 text-5xl font-black border-none bg-transparent focus:ring-0 shadow-none p-0 text-rose-600 text-right group-hover/alert:scale-110 transition-transform duration-500" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] flex gap-8 items-center shadow-3xl transition-all hover:scale-[1.02]">
                      <div className="h-20 w-20 rounded-[1.8rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                        <Layers className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-1">Automatización Kardex</h5>
                        <p className="text-[11px] leading-relaxed text-white/40 font-bold uppercase tracking-widest italic">
                          Al registrar, se genera el lote inicial y el asiento contable de entrada.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10 h-full flex flex-col">
                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Origen y Trazabilidad</Label>
                    <div className="flex-1 bg-white dark:bg-zinc-950 p-12 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-12">
                      <div className="space-y-4">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-1">
                          <Briefcase className="w-4 h-4 text-primary" /> Proveedor Responsable
                        </Label>
                        <Select 
                          value={productForm.supplierId || ""} 
                          onValueChange={v => onProductFormChange({ ...productForm, supplierId: v })}
                        >
                          <SelectTrigger className="h-20 rounded-[2rem] bg-slate-50/50 border-slate-100 dark:border-zinc-800 focus:ring-8 focus:ring-primary/5 font-black text-xl px-10 transition-all hover:bg-white hover:border-primary">
                            <SelectValue placeholder="Busca un remitente" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[2.5rem] p-3 shadow-3xl">
                            {suppliers.map(s => (
                              <SelectItem key={s.id} value={s.id} className="cursor-pointer py-5 rounded-2xl focus:bg-primary/5 text-xl font-black">
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-1">
                          <LayoutGrid className="w-4 h-4 text-primary" /> Identificación de Lote
                        </Label>
                        <div className="relative group">
                          <Input 
                            value={productForm.batchNumber || ""} 
                            onChange={e => onProductFormChange({ ...productForm, batchNumber: e.target.value })} 
                            className="h-20 rounded-[2rem] font-black text-3xl bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-800 focus:ring-8 focus:ring-primary/5 px-10 transition-all tracking-[0.2em] placeholder:tracking-normal group-hover:border-primary"
                            placeholder="LOT-XXXXXX"
                            disabled={editingProduct}
                          />
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 px-5 py-2 bg-slate-100 dark:bg-zinc-900 rounded-2xl text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">
                            {editingProduct ? "Inmutable" : "Auto-Gen"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-1">
                          <Calendar className="w-4 h-4 text-primary" /> Fecha de Caducidad
                        </Label>
                        <Input 
                          type="date" 
                          value={productForm.expiryDate || ""} 
                          onChange={e => onProductFormChange({ ...productForm, expiryDate: e.target.value })} 
                          className="h-20 rounded-[2rem] cursor-pointer bg-slate-50/50 border-slate-100 dark:border-zinc-800 font-black text-3xl px-12 transition-all focus:bg-white focus:ring-8 focus:ring-primary/5 hover:border-primary"
                        />
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] px-6 text-center italic opacity-60">Opcional para productos sin vencimiento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="p-10 bg-slate-50/80 dark:bg-zinc-900/80 border-t border-slate-100 dark:border-zinc-800/50 sm:justify-between items-center gap-8 backdrop-blur-3xl">
              <div className="hidden sm:flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center shadow-2xl border border-slate-100 dark:border-zinc-800">
                  <Package className="w-7 h-7 text-primary/50" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500">Gestión Fost POS</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estándar de Calidad v2.5</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="rounded-2xl h-16 px-10 font-black uppercase text-[12px] tracking-[0.3em] hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all hover:text-red-500 active:scale-95"
                >
                  Descartar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 sm:flex-none min-w-[300px] h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[1.5rem] font-black text-xl uppercase tracking-tight shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.4)] transition-all transform hover:scale-[1.04] active:scale-95 border-b-8 border-primary-foreground/10 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {editingProduct ? "Guardar Cambios" : "Finalizar Registro"}
                    <Sparkles className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
