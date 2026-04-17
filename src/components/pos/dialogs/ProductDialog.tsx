"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, X, Loader2, Package } from "lucide-react"
import { toast } from "sonner"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productForm: any
  onProductFormChange: (form: any) => void
  categories: any []
  onSubmit: (e: React.FormEvent) => void
}

export const ProductDialog = ({
  open,
  onOpenChange,
  productForm,
  onProductFormChange,
  categories,
  onSubmit
}: ProductDialogProps) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>
            Registra un nuevo producto en tu inventario. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-emerald-600 font-bold flex items-center gap-2">
                Código de Barras 🏷️
              </Label>
              <Input 
                value={productForm.code} 
                onChange={e => onProductFormChange({ ...productForm, code: e.target.value })} 
                placeholder="Escanea el código..." 
                className="border-emerald-200 dark:border-emerald-900/50 focus:ring-emerald-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-600 font-bold flex items-center gap-2">
                SKU (Código Interno)
                <span className="text-[10px] font-normal text-slate-400">(Opcional)</span>
              </Label>
              <Input 
                value={productForm.sku} 
                onChange={e => onProductFormChange({ ...productForm, sku: e.target.value })} 
                placeholder="Escribe el SKU..." 
                className="border-blue-200 dark:border-blue-900/50 focus:ring-blue-500 h-11"
              />
            </div>
            <div className="space-y-4 col-span-2">
              <Label>Imagen del Producto</Label>
              <div className="flex items-center gap-4">
                <div 
                  className="relative group w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-900 transition-all hover:border-emerald-500/50"
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  {productForm.imageUrl ? (
                    <>
                      <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImagePlus className="w-6 h-6 text-white" />
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-emerald-500 transition-colors">
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : <ImagePlus className="w-6 h-6" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{uploading ? "Subiendo..." : "Subir Imagen"}</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <div className="flex-1 space-y-2">
                   <Label className="text-xs text-muted-foreground uppercase font-black tracking-widest">Nombre del Producto *</Label>
                   <Input value={productForm.name} onChange={e => onProductFormChange({ ...productForm, name: e.target.value })} placeholder="Ej: Coca Cola 350ml" required className="h-11" />
                   <p className="text-[10px] text-muted-foreground italic">Se recomienda una imagen cuadrada (1:1) de al menos 400x400px.</p>
                </div>
            </div>
          </div>
            <div className="space-y-2">
              <Label>Precio Costo</Label>
              <Input type="number" value={productForm.costPrice} onChange={e => onProductFormChange({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-700">Precio Venta Público *</Label>
              <Input type="number" value={productForm.salePrice} onChange={e => onProductFormChange({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })} placeholder="0" required className="border-emerald-100 dark:border-emerald-900/30" />
            </div>
            <div className="space-y-2">
              <Label>Precio Mayoreo (Opcional)</Label>
              <Input type="number" value={productForm.wholesalePrice} onChange={e => onProductFormChange({ ...productForm, wholesalePrice: parseFloat(e.target.value) || 0 })} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select value={productForm.unit} onValueChange={v => onProductFormChange({ ...productForm, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                  <SelectItem value="litro">Litro (L)</SelectItem>
                  <SelectItem value="metro">Metro (m)</SelectItem>
                  <SelectItem value="paquete">Paquete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stock Inicial</Label>
              <Input type="number" value={productForm.stock} onChange={e => onProductFormChange({ ...productForm, stock: parseInt(e.target.value) || 0 })} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Stock Mínimo (Alerta)</Label>
              <Input type="number" value={productForm.minStock} onChange={e => onProductFormChange({ ...productForm, minStock: parseInt(e.target.value) || 5 })} placeholder="5" />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={productForm.categoryId} onValueChange={v => onProductFormChange({ ...productForm, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de Vencimiento</Label>
              <Input 
                type="date" 
                value={productForm.expiryDate || ""} 
                onChange={e => onProductFormChange({ ...productForm, expiryDate: e.target.value })} 
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={productForm.isActive ? "true" : "false"} onValueChange={v => onProductFormChange({ ...productForm, isActive: v === "true" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 mt-4 h-12 text-lg font-bold">
            Guardar Producto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
