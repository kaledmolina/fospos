"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: any
  userForm: any
  onUserFormChange: (form: any) => void
  branches: any[]
  onSubmit: (e: React.FormEvent) => void
}

export const UserDialog = ({
  open,
  onOpenChange,
  editingUser,
  userForm,
  onUserFormChange,
  branches,
  onSubmit
}: UserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {editingUser ? "Actualiza la información del usuario" : "Crea un nuevo cajero o bodeguero"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre completo *</Label>
            <Input 
              value={userForm.name} 
              onChange={e => onUserFormChange({ ...userForm, name: e.target.value })} 
              placeholder="Juan Pérez" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input 
              type="email" 
              value={userForm.email} 
              onChange={e => onUserFormChange({ ...userForm, email: e.target.value })} 
              placeholder="correo@ejemplo.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Contraseña {editingUser ? "(dejar vacío para mantener)" : "*"}</Label>
            <Input 
              type="password" 
              value={userForm.password} 
              onChange={e => onUserFormChange({ ...userForm, password: e.target.value })} 
              placeholder="••••••••" 
              required={!editingUser} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select value={userForm.role} onValueChange={v => onUserFormChange({ ...userForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASHIER">Cajero</SelectItem>
                  <SelectItem value="WAREHOUSE">Bodeguero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input 
                value={userForm.phone} 
                onChange={e => onUserFormChange({ ...userForm, phone: e.target.value })} 
                placeholder="3001234567" 
              />
            </div>
          </div>
          {userForm.role === "CASHIER" && (
            <div className="space-y-2">
              <Label>Sucursal Asignada *</Label>
              <Select value={userForm.branchId} onValueChange={v => onUserFormChange({ ...userForm, branchId: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar sucursal" /></SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name} {branch.isMain ? "(Principal)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Permisos por rol:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Cajero:</strong> Puede registrar ventas y ver productos. Asignado a una sucursal específica.</li>
              <li>• <strong>Bodeguero:</strong> Puede gestionar inventario y productos.</li>
            </ul>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200"
            disabled={userForm.role === "CASHIER" && !userForm.branchId}
          >
            {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
