"use client"

import { useState } from "react"
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, ArrowUpRight, ArrowDownRight, Settings2 } from "lucide-react"

interface StockAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  onAdjust: (data: any) => Promise<void>
}

export const StockAdjustmentDialog = ({
  open,
  onOpenChange,
  product,
  onAdjust
}: StockAdjustmentDialogProps) => {
  const [type, setType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN")
  const [quantity, setQuantity] = useState(0)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAdjust({
        productId: product.id,
        type,
        quantity,
        notes
      })
      onOpenChange(false)
      setQuantity(0)
      setNotes("")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-500">
            <Package className="w-5 h-5" />
            Ajustar Inventario
          </DialogTitle>
          <DialogDescription>
            Actualiza el stock de <strong>{product.name}</strong>. 
            El stock actual es de <strong>{product.stock} {product.unit}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Ajuste</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                type="button"
                variant={type === "IN" ? "default" : "outline"}
                className={type === "IN" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                onClick={() => setType("IN")}
              >
                <ArrowUpRight className="w-4 h-4 mr-1" /> Entrada
              </Button>
              <Button 
                type="button"
                variant={type === "OUT" ? "default" : "outline"}
                className={type === "OUT" ? "bg-red-500 hover:bg-red-600" : ""}
                onClick={() => setType("OUT")}
              >
                <ArrowDownRight className="w-4 h-4 mr-1" /> Salida
              </Button>
              <Button 
                type="button"
                variant={type === "ADJUSTMENT" ? "default" : "outline"}
                className={type === "ADJUSTMENT" ? "bg-blue-500 hover:bg-blue-600" : ""}
                onClick={() => setType("ADJUSTMENT")}
              >
                <Settings2 className="w-4 h-4 mr-1" /> Fijo
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {type === "ADJUSTMENT" ? "Stock Final" : "Cantidad a Mover"}
            </Label>
            <Input 
              id="quantity"
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder={type === "ADJUSTMENT" ? "Ej: 100" : "Ej: 10"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas / Razón</Label>
            <Textarea 
              id="notes"
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Ajuste por merma, entrada de proveedor..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
              {loading ? "Guardando..." : "Confirmar Ajuste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
