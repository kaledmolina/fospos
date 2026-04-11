"use client"

import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, FolderOpen, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CategoriesTabProps {
  categories: any[]
  onSetCategoryDialog: (open: boolean) => void
  onSetEditingCategory: (category: any) => void
  onSetCategoryForm: (form: any) => void
  onDeleteCategory: (id: string) => void
}

export const CategoriesTab = ({
  categories,
  onSetCategoryDialog,
  onSetEditingCategory,
  onSetCategoryForm,
  onDeleteCategory
}: CategoriesTabProps) => {
  return (
    <motion.div key="categories" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Categorías</h1>
          <p className="text-sm text-muted-foreground">Administra las categorías de productos de tu negocio</p>
        </div>
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-500/25 relative z-10"
          onClick={() => {
            onSetEditingCategory(null)
            onSetCategoryForm({ name: "", description: "", color: "#10B981", icon: "🏷️" })
            onSetCategoryDialog(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={fadeInUp}
          >
            <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: cat.color }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {cat.icon || "🏷️"}
                    </div>
                    <div>
                      <h3 className="font-bold">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {cat.description || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {cat._count?.products || 0} Productos
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 relative z-20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetEditingCategory(cat)
                      onSetCategoryForm({
                        name: cat.name,
                        description: cat.description || "",
                        color: cat.color || "#10B981",
                        icon: cat.icon || "🏷️"
                      })
                      onSetCategoryDialog(true)
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Asegúrate de que no haya productos asociados a esta categoría antes de eliminarla.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600 cursor-pointer"
                          onClick={() => onDeleteCategory(cat.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No tienes categorías registradas</p>
          <p className="text-sm text-slate-400 mb-6">Comienza creando una para organizar tus productos</p>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
            onClick={() => onSetCategoryDialog(true)}
          >
            Crear mi primera categoría
          </Button>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 items-start">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-800">
          <p className="font-bold mb-1">Tip de Organización</p>
          <p>Usa colores distintos para cada categoría para que tus cajeros puedan identificar los productos más rápido en la pantalla de ventas.</p>
        </div>
      </div>
    </motion.div>
  )
}
