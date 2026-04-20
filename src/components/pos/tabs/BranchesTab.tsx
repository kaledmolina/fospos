"use client"

import { motion } from "framer-motion"
import { Building2, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface BranchesTabProps {
  branches: any[]
  onSetEditingBranch: (branch: any) => void
  onSetBranchForm: (form: any) => void
  onSetBranchDialog: (open: boolean) => void
  onDeleteBranch: (id: string) => void
}

export const BranchesTab = ({
  branches,
  onSetEditingBranch,
  onSetBranchForm,
  onSetBranchDialog,
  onDeleteBranch
}: BranchesTabProps) => {
  return (
    <motion.div key="branches" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sucursales</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-primary hover:bg-primary cursor-pointer transition-all duration-200 shadow-md shadow-primary/25" onClick={() => { onSetEditingBranch(null); onSetBranchForm({ name: "", address: "", phone: "", city: "", isMain: false, monthlyGoal: 0, enabledPaymentMethods: "CASH,CARD,TRANSFER,CREDIT,MIXED,GIFT_CARD" }); onSetBranchDialog(true) }}>
            <Plus className="w-4 h-4 mr-2" />Nueva Sucursal
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {branches.map((branch) => (
          <motion.div
            key={branch.id}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={branch.isMain ? "border-primary/20 bg-primary/10" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{branch.name}</p>
                        {branch.isMain && <Badge className="bg-primary">Principal</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {branch.address && `${branch.address}, `}{branch.city}
                      </p>
                      {branch.phone && <p className="text-sm text-muted-foreground">Tel: {branch.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center hidden md:block">
                      <p className="text-sm font-bold text-primary">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(branch.monthlyGoal || 0)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">Meta Mensual</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{branch._count?.products || 0}</p>
                      <p className="text-xs text-muted-foreground">Productos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{branch._count?.sales || 0}</p>
                      <p className="text-xs text-muted-foreground">Ventas</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="cursor-pointer transition-all duration-200" onClick={() => { onSetEditingBranch(branch); onSetBranchForm({ name: branch.name, address: branch.address || "", phone: branch.phone || "", city: branch.city, isMain: branch.isMain, monthlyGoal: branch.monthlyGoal || 0, enabledPaymentMethods: branch.enabledPaymentMethods || "CASH,CARD,TRANSFER,CREDIT,MIXED,GIFT_CARD" }); onSetBranchDialog(true) }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!branch.isMain && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-500/10 cursor-pointer transition-all duration-200" onClick={() => onDeleteBranch(branch.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {branches.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground mb-2">No hay sucursales registradas</p>
            <p className="text-sm text-muted-foreground mb-6">Crea sucursales para gestionar múltiples ubicaciones</p>
            <Button className="bg-primary hover:bg-primary cursor-pointer" onClick={() => onSetBranchDialog(true)}>Agregar primera sucursal</Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
