"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryForm: any
  onCategoryFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
  editingCategory?: any
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  categoryForm,
  onCategoryFormChange,
  onSubmit,
  editingCategory
}: CategoryDialogProps) => {
  const [uploading, setUploading] = useState(false)
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
    formData.append("folder", "categories")

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        onCategoryFormChange({ ...categoryForm, imageUrl: data.imageUrl })
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
    onCategoryFormChange({ ...categoryForm, imageUrl: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? "Modifica los detalles de la categoría seleccionada." 
              : "Crea una nueva categoría para organizar tus productos."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Imagen de la Categoría</Label>
              <div 
                className="relative group w-full aspect-square md:aspect-auto md:h-40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-900 transition-all hover:border-emerald-500/50 cursor-pointer"
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                {categoryForm.imageUrl ? (
                  <>
                    <img src={categoryForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-white" />
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-emerald-500 transition-colors text-center p-4">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-500" /> : <ImagePlus className="w-8 h-8" />}
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider">{uploading ? "Subiendo..." : "Subir Imagen"}</p>
                      <p className="text-[10px] lowercase italic">Se mostrará en la cuadrícula de ventas</p>
                    </div>
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
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Categoría *</Label>
                <Input 
                  id="name"
                  value={categoryForm.name} 
                  onChange={e => onCategoryFormChange({ ...categoryForm, name: e.target.value })} 
                  placeholder="Ej: Snacks, Bebidas..." 
                  required 
                  className="h-11 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Icono / Emoji</Label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  {["🏷️", "🍔", "🍺", "🍦", "🍎", "👕", "⚡", "💊", "🛠️", "📦"].map(emoji => (
                    <button 
                      key={emoji} 
                      type="button" 
                      className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-all ${categoryForm.icon === emoji ? "bg-white dark:bg-slate-800 shadow-md ring-2 ring-emerald-500" : "hover:bg-slate-200 dark:hover:bg-slate-800"}`} 
                      onClick={() => onCategoryFormChange({ ...categoryForm, icon: emoji })} 
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <Label>Color de Identificación</Label>
              <div className="flex gap-3 justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                {["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#64748B"].map(color => (
                  <button 
                    key={color} 
                    type="button" 
                    className={`w-7 h-7 rounded-full transition-all shadow-sm ${categoryForm.color === color ? "ring-2 ring-offset-2 ring-emerald-500 scale-110" : "hover:scale-110"}`} 
                    style={{ backgroundColor: color }} 
                    onClick={() => onCategoryFormChange({ ...categoryForm, color })} 
                  />
                ))}
                <div className="w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                <input 
                  type="color" 
                  value={categoryForm.color} 
                  onChange={e => onCategoryFormChange({ ...categoryForm, color: e.target.value })} 
                  className="w-7 h-7 p-0 border-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Textarea 
                id="description"
                value={categoryForm.description} 
                onChange={e => onCategoryFormChange({ ...categoryForm, description: e.target.value })} 
                placeholder="Describe brevemente la categoría..." 
                className="resize-none"
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 h-11 font-bold text-white shadow-lg shadow-emerald-500/20">
            {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
