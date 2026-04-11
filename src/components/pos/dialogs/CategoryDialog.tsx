"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre de la Categoría *</Label>
            <Input 
              value={categoryForm.name} 
              onChange={e => onCategoryFormChange({ ...categoryForm, name: e.target.value })} 
              placeholder="Ej: Bebidas, Snacks, Ferretería..." 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción (Opcional)</Label>
            <Textarea value={categoryForm.description} onChange={e => onCategoryFormChange({ ...categoryForm, description: e.target.value })} placeholder="Descripción opcional" />
          </div>
          <div className="space-y-2">
            <Label>Icono / Emoji 🏷️</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 italic">
              {["🏷️", "🍔", "🍺", "🍦", "🍎", "👕", "⚡", "💊", "🛠️", "📦"].map(emoji => (
                <button 
                  key={emoji} 
                  type="button" 
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-110 hover:shadow-sm ${categoryForm.icon === emoji ? "bg-white dark:bg-slate-800 shadow-md ring-2 ring-emerald-500 scale-110" : ""}`} 
                  onClick={() => onCategoryFormChange({ ...categoryForm, icon: emoji })} 
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color de Identificación</Label>
            <div className="flex gap-3 p-1">
              {["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#64748B"].map(color => (
                <button 
                  key={color} 
                  type="button" 
                  className={`w-8 h-8 rounded-full transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-slate-300 shadow-md ${categoryForm.color === color ? "ring-2 ring-offset-2 ring-emerald-500 scale-125" : ""}`} 
                  style={{ backgroundColor: color }} 
                  onClick={() => onCategoryFormChange({ ...categoryForm, color })} 
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 mt-2 h-11 font-bold cursor-pointer">
            {editingCategory ? "Actualizar Categoría" : "Guardar Categoría"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
