"use client"

import { motion } from "framer-motion"
import { 
  Users, Crown, CreditCard, Package, CheckCircle, 
  XCircle, Edit, Trash2, Plus, Building2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface UsersTabProps {
  tenantUsers: any[]
  onSetEditingUser: (user: any) => void
  onSetUserForm: (form: any) => void
  onSetUserDialog: (open: boolean) => void
  onToggleUserActive: (id: string, currentStatus: boolean) => void
  onDeleteUser: (id: string) => void
}

export const UsersTab = ({
  tenantUsers,
  onSetEditingUser,
  onSetUserForm,
  onSetUserDialog,
  onToggleUserActive,
  onDeleteUser
}: UsersTabProps) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "TENANT_ADMIN":
        return {
          label: "Administrador",
          icon: Crown,
          bgColor: "bg-amber-500/10",
          textColor: "text-amber-500",
          badgeClass: "border-amber-500/20 text-amber-500 bg-amber-500/10"
        }
      case "CASHIER":
        return {
          label: "Cajero",
          icon: CreditCard,
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-500",
          badgeClass: "border-emerald-500/20 text-emerald-500 bg-emerald-500/10"
        }
      case "WAREHOUSE":
        return {
          label: "Bodeguero",
          icon: Package,
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-500",
          badgeClass: "border-blue-500/20 text-blue-500 bg-blue-500/10"
        }
      default:
        return {
          label: role,
          icon: Users,
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          badgeClass: "border-border text-muted-foreground bg-muted"
        }
    }
  }

  return (
    <motion.div key="users" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/25" onClick={() => { onSetEditingUser(null); onSetUserForm({ name: "", email: "", password: "", role: "CASHIER", branchId: "", phone: "" }); onSetUserDialog(true) }}>
            <Plus className="w-4 h-4 mr-2" />Nuevo Usuario
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <p className="text-2xl font-bold mt-2">{tenantUsers.length}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Crown className="w-4 h-4" />
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
            <p className="text-2xl font-bold mt-2 text-amber-600">{tenantUsers.filter(u => u.role === "TENANT_ADMIN").length}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CreditCard className="w-4 h-4" />
              <p className="text-sm text-muted-foreground">Cajeros</p>
            </div>
            <p className="text-2xl font-bold mt-2 text-emerald-600">{tenantUsers.filter(u => u.role === "CASHIER").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {tenantUsers.map(user => {
                const roleConfig = getRoleConfig(user.role)
                const RoleIcon = roleConfig.icon
                return (
                  <motion.div 
                    key={user.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border ${!user.isActive ? "bg-muted/50 opacity-60" : "bg-card hover:shadow-md"} transition-all duration-200 border-border`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleConfig.bgColor}`}>
                        <RoleIcon className={`w-6 h-6 ${roleConfig.textColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <Badge variant="outline" className={roleConfig.badgeClass}>{roleConfig.label}</Badge>
                          {!user.isActive && <Badge variant="outline" className="border-red-500/20 text-red-500 bg-red-500/10"><XCircle className="w-3 h-3 mr-1" /> Inactivo</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {user.branch && <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> {user.branch.name}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role !== "TENANT_ADMIN" && (
                        <>
                          <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => onToggleUserActive(user.id, user.isActive)}>
                            {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => { onSetEditingUser(user); onSetUserForm({ name: user.name, email: user.email, password: "", role: user.role, branchId: user.branch?.id || "", phone: user.phone || "" }); onSetUserDialog(true) }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 cursor-pointer" onClick={() => onDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {user.role === "TENANT_ADMIN" && <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/10">Dueño</Badge>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
