import { useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageIcon, Upload, Check } from "lucide-react"

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingBranch: any
  branchForm: any
  onBranchFormChange: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
  onUploadLogo: (file: File) => Promise<string | undefined>
}

export const BranchDialog = ({
  open,
  onOpenChange,
  editingBranch,
  branchForm,
  onBranchFormChange,
  onSubmit,
  onUploadLogo
}: BranchDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadLogo(file)
    }
  }

  const colors = [
    { name: 'Esmeralda', hex: '#10b981' },
    { name: 'Rojo', hex: '#ef4444' },
    { name: 'Azul', hex: '#3b82f6' },
    { name: 'Violeta', hex: '#8b5cf6' },
    { name: 'Ámbar', hex: '#f59e0b' },
    { name: 'Rosa', hex: '#ec4899' },
    { name: 'Cian', hex: '#06b6d4' },
    { name: 'Lima', hex: '#84cc16' },
    { name: 'Índigo', hex: '#6366f1' },
    { name: 'Naranja', hex: '#f97316' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Zinc', hex: '#71717a' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
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
          
          <div className="space-y-4 pt-2 border-t">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Identidad Visual</Label>
            
            <div className="space-y-2">
              <Label>Logo de la Sede</Label>
              <div className="flex gap-2">
                <Input 
                  value={branchForm.logoUrl || ""} 
                  onChange={e => onBranchFormChange({ ...branchForm, logoUrl: e.target.value })} 
                  placeholder="URL del logo o sube uno -->" 
                  className="flex-1"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              {branchForm.logoUrl && (
                <div className="mt-2 w-20 h-20 rounded-lg border overflow-hidden bg-muted/50 flex items-center justify-center">
                  <img src={branchForm.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Estilo Visual del Punto de Venta
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Energía Neón', hex: '#db2777', desc: 'Moderno y vibrante' },
                  { name: 'Bosque Esmeralda', hex: '#10b981', desc: 'Clásico y profesional' },
                  { name: 'Océano Ártico', hex: '#0ea5e9', desc: 'Limpio y tecnológico' },
                  { name: 'Atardecer Dorado', hex: '#f59e0b', desc: 'Cálido y acogedor' },
                  { name: 'Amatista Real', hex: '#8b5cf6', desc: 'Elegante y creativo' },
                  { name: 'Fuego Azul', hex: '#3b82f6', desc: 'Digital e innovador' },
                ].map((theme) => (
                  <button
                    key={theme.hex}
                    type="button"
                    onClick={() => onBranchFormChange({ ...branchForm, themeColor: theme.hex })}
                    className={`flex flex-col gap-2 p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${branchForm.themeColor === theme.hex ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 bg-card/50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.hex }} />
                      {branchForm.themeColor === theme.hex && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-[11px] font-black uppercase tracking-tight ${branchForm.themeColor === theme.hex ? 'text-primary' : 'text-foreground'}`}>{theme.name}</p>
                      <p className="text-[9px] text-muted-foreground font-medium">{theme.desc}</p>
                    </div>
                    {branchForm.themeColor === theme.hex && (
                      <motion.div layoutId="activeTheme" className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Meta Mensual de Ventas ($)</Label>
            <Input 
              type="number" 
              step="0.01"
              value={branchForm.monthlyGoal} 
              onChange={e => onBranchFormChange({ ...branchForm, monthlyGoal: e.target.value })} 
              placeholder="Ej: 10000000" 
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={branchForm.isMain} onCheckedChange={v => onBranchFormChange({ ...branchForm, isMain: v })} />
            <Label>Sucursal Principal</Label>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-all duration-200 shadow-lg shadow-primary/20 h-10 font-bold">
            {editingBranch ? "Actualizar Sucursal" : "Crear Sucursal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
