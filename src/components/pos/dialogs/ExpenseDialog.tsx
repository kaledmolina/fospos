"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseForm: any
  onExpenseFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export const ExpenseDialog = ({
  open,
  onOpenChange,
  expenseForm,
  onExpenseFormChange,
  onSubmit
}: ExpenseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Registrar Gasto</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={expenseForm.category} onValueChange={v => onExpenseFormChange({ ...expenseForm, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Servicios">Servicios</SelectItem>
                <SelectItem value="Nómina">Nómina</SelectItem>
                <SelectItem value="Alquiler">Alquiler</SelectItem>
                <SelectItem value="Insumos">Insumos</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descripción *</Label>
            <Input value={expenseForm.description} onChange={e => onExpenseFormChange({ ...expenseForm, description: e.target.value })} placeholder="Descripción del gasto" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monto *</Label>
              <Input type="number" value={expenseForm.amount} onChange={e => onExpenseFormChange({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={expenseForm.date} onChange={e => onExpenseFormChange({ ...expenseForm, date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea value={expenseForm.notes} onChange={e => onExpenseFormChange({ ...expenseForm, notes: e.target.value })} placeholder="Notas adicionales (opcional)" />
          </div>
          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 cursor-pointer transition-all duration-200">Registrar Gasto</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
