"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productForm: any
  onProductFormChange: (form: any) => void
  categories: any[]
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
            <div className="space-y-2 col-span-2">
              <Label>Nombre del Producto *</Label>
              <Input value={productForm.name} onChange={e => onProductFormChange({ ...productForm, name: e.target.value })} placeholder="Ej: Coca Cola 350ml" required />
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
