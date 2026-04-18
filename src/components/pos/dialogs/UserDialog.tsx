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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-black uppercase tracking-widest text-emerald-600">Sucursales Asignadas *</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-black uppercase tracking-tighter"
                onClick={() => {
                  const allIds = branches.map(b => b.id);
                  const newIds = userForm.branchIds?.length === branches.length ? [] : allIds;
                  onUserFormChange({ ...userForm, branchIds: newIds });
                }}
              >
                {userForm.branchIds?.length === branches.length ? "Desmarcar todas" : "Todas las sedes"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1">
              {branches.map(branch => (
                <div 
                  key={branch.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                    userForm.branchIds?.includes(branch.id) 
                      ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20" 
                      : "border-border bg-card"
                  }`}
                  onClick={() => {
                    const current = userForm.branchIds || [];
                    const next = current.includes(branch.id)
                      ? current.filter((id: string) => id !== branch.id)
                      : [...current, branch.id];
                    onUserFormChange({ ...userForm, branchIds: next });
                  }}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    userForm.branchIds?.includes(branch.id) ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"
                  }`}>
                    {userForm.branchIds?.includes(branch.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-[11px] font-bold truncate">{branch.name}</span>
                </div>
              ))}
            </div>
            {userForm.role === "CASHIER" && (!userForm.branchIds || userForm.branchIds.length === 0) && (
              <p className="text-[10px] text-red-500 font-bold animate-pulse">Debes asignar al menos una sede para el cajero.</p>
            )}
          </div>

          <div className="bg-muted/50 dark:bg-slate-900/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Permisos por rol:</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• <strong>Cajero:</strong> Puede registrar ventas en las sedes asignadas.</li>
              <li>• <strong>Bodeguero:</strong> Gestiona inventario en las sedes donde tiene acceso.</li>
            </ul>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200"
            disabled={userForm.role === "CASHIER" && (!userForm.branchIds || userForm.branchIds.length === 0)}
          >
            {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
