"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingBranch: any
  branchForm: any
  onBranchFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export const BranchDialog = ({
  open,
  onOpenChange,
  editingBranch,
  branchForm,
  onBranchFormChange,
  onSubmit
}: BranchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input value={branchForm.name} onChange={e => onBranchFormChange({ ...branchForm, name: e.target.value })} placeholder="Nombre de la sucursal" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ciudad *</Label>
              <Input value={branchForm.city} onChange={e => onBranchFormChange({ ...branchForm, city: e.target.value })} placeholder="Ciudad" required />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={branchForm.phone} onChange={e => onBranchFormChange({ ...branchForm, phone: e.target.value })} placeholder="3001234567" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input value={branchForm.address} onChange={e => onBranchFormChange({ ...branchForm, address: e.target.value })} placeholder="Dirección" />
          </div>
          <div className="space-y-2">
            <Label>Meta Mensual de Ventas ($)</Label>
            <Input 
              type="number" 
              step="0.01"
              value={branchForm.monthlyGoal} 
              onChange={e => onBranchFormChange({ ...branchForm, monthlyGoal: e.target.value })} 
              placeholder="Ej: 10000000" 
            />
            <p className="text-[10px] text-muted-foreground italic">
              Este valor define el 100% de cumplimiento en el gráfico del Dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={branchForm.isMain} onCheckedChange={v => onBranchFormChange({ ...branchForm, isMain: v })} />
            <Label>Sucursal Principal</Label>
          </div>
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200">
            {editingBranch ? "Actualizar Sucursal" : "Crear Sucursal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
