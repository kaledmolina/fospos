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
          <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-4 group cursor-pointer" onClick={() => onUserFormChange({ ...userForm, isQuickAccess: !userForm.isQuickAccess })}>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <div className="font-black text-xs">PIN</div>
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Acceso Rápido (PIN)</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Ideal para cajeros y bodegueros</p>
               </div>
            </div>
            <input 
              type="checkbox" 
              checked={userForm.isQuickAccess} 
              onChange={() => {}} // Handled by div click
              className="w-4 h-4 accent-emerald-500 pointer-events-none" 
            />
          </div>

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
          {!userForm.isQuickAccess && (
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
          )}
          <div className="space-y-2">
            <Label>{userForm.isQuickAccess ? "PIN de 4 dígitos *" : `Contraseña ${editingUser ? "(dejar vacío para mantener)" : "*"}`}</Label>
            <Input 
              type={userForm.isQuickAccess ? "text" : "password"} 
              maxLength={userForm.isQuickAccess ? 4 : undefined}
              value={userForm.password} 
              onChange={e => {
                const val = e.target.value;
                if (userForm.isQuickAccess && val.length > 4) return;
                onUserFormChange({ ...userForm, password: val });
              }} 
              placeholder={userForm.isQuickAccess ? "Ej: 1234" : "••••••••"} 
              required={!editingUser} 
              className={userForm.isQuickAccess ? "text-center text-2xl font-black tracking-[1em]" : ""}
            />
            {userForm.isQuickAccess && <p className="text-[10px] text-muted-foreground italic">El cajero usará este PIN para entrar rápido al sistema.</p>}
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
          <div className="bg-muted/50 dark:bg-slate-900/50 p-4 rounded-lg text-sm">
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
