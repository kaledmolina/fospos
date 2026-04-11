"use client"

import { motion } from "framer-motion"
import { 
  Upload, Plus, FolderOpen, Settings2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency } from "@/lib/utils"

interface InventoryTabProps {
  products: any[]
  categories: any[]
  onSetProductDialog: (open: boolean) => void
  onSetCategoryDialog: (open: boolean) => void
  onSetBulkUploadDialog: (open: boolean) => void
  onSetStockAdjustmentDialog: (open: boolean) => void
  onSetSelectedProductForStock: (product: any) => void
}

export const InventoryTab = ({
  products,
  categories,
  onSetProductDialog,
  onSetCategoryDialog,
  onSetBulkUploadDialog,
  onSetStockAdjustmentDialog,
  onSetSelectedProductForStock
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
            <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/25" onClick={() => onSetProductDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Producto
            </Button>
          </motion.div>
        </div>
      </div>
      
      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">Todos</Button>
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
            <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-emerald-200 ${!product.isActive ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex flex-col gap-0.5">
                      {product.code && <p className="text-xs text-muted-foreground">Barras: {product.code}</p>}
                      {product.sku && <p className="text-xs text-blue-500 font-medium">SKU: {product.sku}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {product.category && (
                      <Badge variant="outline" style={{ borderColor: product.category.color || undefined }}>
                        {product.category.name}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-7 h-7 rounded-full hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSetSelectedProductForStock(product)
                        onSetStockAdjustmentDialog(true)
                      }}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-emerald-500">{formatCurrency(product.salePrice)}</p>
                  <div className="text-right">
                    <p className="text-sm font-medium">{product.stock} {product.unit}</p>
                    <div className="flex flex-col items-end mt-1">
                      {product.stock < product.minStock && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">⚠️ Stock bajo</p>}
                      {product.expiryDate && (
                        (() => {
                          const expiry = new Date(product.expiryDate);
                          const now = new Date();
                          const diff = expiry.getTime() - now.getTime();
                          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                          
                          if (days < 0) return <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider animate-pulse">🚫 Vencido</p>;
                          if (days <= 7) return <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">⏳ Vence pronto</p>;
                          return null;
                        })()
                      )}
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
              <FolderOpen className="w-20 h-20 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-lg font-medium text-foreground mb-2">No hay productos registrados</p>
              <p className="text-sm text-muted-foreground mb-6">Comienza agregando tu primer producto al inventario</p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer" onClick={() => onSetProductDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />Agregar primer producto
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
