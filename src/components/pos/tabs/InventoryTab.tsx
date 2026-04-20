"use client"

import { motion } from "framer-motion"
import { 
  Upload, Plus, FolderOpen, Settings2, Package, Pencil, Trash2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency } from "@/lib/utils"

interface InventoryTabProps {
  products: any[]
  categories: any[]
  onSetProductDialog: (open: boolean, product?: any) => void
  onSetCategoryDialog: (open: boolean) => void
  onSetBulkUploadDialog: (open: boolean) => void
  onSetStockAdjustmentDialog: (open: boolean) => void
  onSetSelectedProductForStock: (product: any) => void
  onSetEditingProduct: (product: any) => void
  onSetProductForm: (form: any) => void
  onDeleteProduct: (id: string) => void
  userRole?: string
}

export const InventoryTab = ({
  products,
  categories,
  onSetProductDialog,
  onSetCategoryDialog,
  onSetBulkUploadDialog,
  onSetStockAdjustmentDialog,
  onSetSelectedProductForStock,
  onSetEditingProduct,
  onSetProductForm,
  onDeleteProduct,
  userRole
}: InventoryTabProps) => {
  return (
    <motion.div key="products" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Productos</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="cursor-pointer transition-all duration-200" onClick={() => onSetBulkUploadDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />Carga Masiva
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="cursor-pointer transition-all duration-200" onClick={() => onSetCategoryDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Categoría
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200 shadow-md shadow-primary/25" onClick={() => onSetProductDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Producto
            </Button>
          </motion.div>
        </div>
      </div>
      
      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="bg-primary/10 dark:bg-primary/20 border-primary/20 text-primary hover:bg-primary/20">Todos</Button>
          {categories.map(cat => (<Button key={cat.id} variant="outline" size="sm">{cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}</Button>))}
        </div>
      )}
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-primary/30 overflow-hidden rounded-[2rem] border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 backdrop-blur-sm ${!product.isActive ? "opacity-50" : ""}`}>
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-zinc-800">
                    <Package className="w-12 h-12 mb-2 opacity-20" />
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-20">Sin Imagen</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {product.category && (
                    <Badge 
                      className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-none shadow-sm text-[10px] font-black uppercase text-slate-700 dark:text-zinc-300"
                      style={{ borderLeft: `3px solid ${product.category.color || '#10b981'}` }}
                    >
                      {product.category.name}
                    </Badge>
                  )}
                  {(userRole === "TENANT_ADMIN" || userRole === "SUPER_ADMIN" || userRole === "WAREHOUSE") && (
                    <>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm opacity-70 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSetSelectedProductForStock(product)
                          onSetStockAdjustmentDialog(true)
                        }}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm opacity-70 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSetProductDialog(true, product)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm opacity-70 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteProduct(product.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                {product.stock < product.minStock && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 backdrop-blur-sm p-1.5 text-center">
                    <p className="text-[9px] text-white font-black uppercase tracking-[0.2em]">⚠️ Stock Bajo</p>
                  </div>
                )}
              </div>

              <CardContent className="p-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-zinc-100 leading-tight truncate">{product.name}</h3>
                    <div className="flex gap-2 mt-1">
                       {product.sku && <Badge variant="secondary" className="text-[8px] bg-blue-500/10 text-blue-600 border-none font-black">{product.sku}</Badge>}
                       {product.code && <Badge variant="secondary" className="text-[8px] bg-slate-100 dark:bg-zinc-800 text-slate-500 border-none font-bold italic">{product.code}</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-zinc-900">
                    <div>
                      <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Precio</p>
                      <p className="text-lg font-black text-primary">{formatCurrency(product.salePrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Stock</p>
                      <p className={`font-black ${product.stock < product.minStock ? 'text-red-500' : 'text-slate-700 dark:text-zinc-300'}`}>
                        {product.stock} <span className="text-[10px] font-bold text-muted-foreground">{product.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {products.length === 0 && (
          <motion.div className="col-span-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center py-16">
              <FolderOpen className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30 dark:text-muted-foreground/20" />
              <p className="text-lg font-medium text-foreground mb-2">No hay productos registrados</p>
              <p className="text-sm text-muted-foreground mb-6">Comienza agregando tu primer producto al inventario</p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer" onClick={() => onSetProductDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />Agregar primer producto
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
