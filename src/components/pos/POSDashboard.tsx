"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, X, LogOut, Menu, Bell, Package, AlertCircle, 
  Clock, BarChart3, ShoppingBag, Users, CreditCard, 
  Receipt, Wallet, RefreshCw, Building2, Home, Plus, Star, FolderOpen, Globe
} from "lucide-react"
import { BranchSelector } from "./shared/BranchSelector"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Confetti } from "@/components/shared/Confetti"
import { FAB } from "@/components/ui/fab"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

interface POSDashboardProps {
  session: any
  view: string
  posTab: string
  onPosTabChange: (tab: string) => void
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  notifications: { id: string, title: string, message: string, type: string, isRead: boolean, createdAt: string }[]
  unreadNotifications: number
  notificationsOpen: boolean
  onNotificationsOpenChange: (open: boolean) => void
  onClearNotifications: () => void
  showConfetti: boolean
  onSignOut: () => void
  onTabChangeWithEffects: (tab: string) => void
  branches: any[]
  selectedBranch: string | null
  onBranchChange: (branchId: string | null) => void
  children: React.ReactNode
}

export const POSDashboard = ({
  session,
  posTab,
  onPosTabChange,
  sidebarOpen,
  onSidebarOpenChange,
  notifications,
  unreadNotifications,
  notificationsOpen,
  onNotificationsOpenChange,
  onClearNotifications,
  showConfetti,
  onSignOut,
  children,
  onTabChangeWithEffects,
  branches,
  selectedBranch,
  onBranchChange
}: POSDashboardProps) => {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Confetti for celebrations */}
      <Confetti show={showConfetti} />
      
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md"
            >
              <Store className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <span className="font-bold text-sm text-foreground truncate block">{session?.user?.tenantName}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onSidebarOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-1">
          {[
            { id: "dashboard", icon: BarChart3, label: "Dashboard" },
            { id: "sale", icon: ShoppingBag, label: "Nueva Venta" },
            { id: "transactions", icon: Receipt, label: "Transacciones" },
            { id: "categories", icon: FolderOpen, label: "Categorías" },
            { id: "products", icon: Package, label: "Productos" },
            { id: "customers", icon: Users, label: "Clientes" },
            { id: "credits", icon: CreditCard, label: "Fiados" },
            { id: "expenses", icon: Receipt, label: "Gastos" },
            { id: "cash", icon: Wallet, label: "Caja" },
            { id: "subscriptions", icon: RefreshCw, label: "Suscripciones" },
            ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "loyalty", icon: Star, label: "Fidelización" }] : []),
            ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "branches", icon: Building2, label: "Sucursales" }] : []),
            ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "users", icon: Users, label: "Usuarios" }] : [])
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={posTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start cursor-pointer transition-all duration-200 relative group ${posTab === item.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent text-muted-foreground hover:text-foreground"}`}
                onClick={() => onTabChangeWithEffects(item.id)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {posTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-200" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:ml-0 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-30">
          <Button variant="ghost" size="icon" onClick={() => onSidebarOpenChange(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-bold text-sm">{session?.user?.tenantName}</span>
          <Popover onOpenChange={onNotificationsOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Notificaciones</h3>
                {(notifications?.length || 0) > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-6 px-2 uppercase font-black hover:text-emerald-500"
                    onClick={() => {
                        onClearNotifications()
                        onNotificationsOpenChange(false)
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
              <ScrollArea className="h-80">
                {(notifications?.length || 0) === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Sin notificaciones</div>
                ) : (
                  <div className="divide-y">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 ${!n.isRead ? "bg-emerald-500/10" : ""}`}>
                        <div className="flex items-start gap-2">
                          {n.type === "LOW_STOCK" && <Package className="w-4 h-4 text-yellow-600 mt-1" />}
                          {(n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") && <AlertCircle className="w-4 h-4 text-red-600 mt-1" />}
                          {(n.type === "CREDIT_DUE" || n.type === "DUE_SOON_CREDIT") && <Clock className="w-4 h-4 text-orange-600 mt-1" />}
                          <div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </header>

        {/* Desktop Header Actions */}
        <div className="hidden lg:flex items-center gap-4 fixed top-4 right-4 z-40">
          <ThemeToggle />
          <Popover onOpenChange={onNotificationsOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative bg-card border-border shadow-md cursor-pointer transition-all duration-200 hover:scale-105">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Notificaciones</h3>
                {(notifications?.length || 0) > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-6 px-2 uppercase font-black hover:text-emerald-500"
                    onClick={() => {
                       fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) })
                       .then(() => onNotificationsOpenChange(false))
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
              <ScrollArea className="h-80">
                {(notifications?.length || 0) === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Sin notificaciones</div>
                ) : (
                  <div className="divide-y">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 ${!n.isRead ? "bg-emerald-500/10" : ""}`}>
                        <div className="flex items-start gap-2">
                          {n.type === "LOW_STOCK" && <Package className="w-4 h-4 text-yellow-600 mt-1" />}
                          {(n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") && <AlertCircle className="w-4 h-4 text-red-600 mt-1" />}
                          {(n.type === "CREDIT_DUE" || n.type === "DUE_SOON_CREDIT") && <Clock className="w-4 h-4 text-orange-600 mt-1" />}
                          <div>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <BranchSelector 
            branches={branches}
            selectedBranch={selectedBranch}
            onBranchChange={onBranchChange}
            isAdmin={session?.user?.role === "TENANT_ADMIN" || session?.user?.role === "SUPER_ADMIN"}
          />
        </div>

        <div className="p-4 md:p-6 lg:pr-32 pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      {posTab === "dashboard" && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
          <FAB
            icon={Plus}
            onClick={() => onPosTabChange("sale")}
            label="Nueva Venta"
            color="emerald"
          />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
        <div className="grid grid-cols-5 h-16">
          {[
            { id: "dashboard", icon: Home, label: "Inicio" },
            { id: "sale", icon: ShoppingBag, label: "Venta" },
            { id: "products", icon: Package, label: "Productos" },
            { id: "cash", icon: Wallet, label: "Caja" },
            { id: "more", icon: Menu, label: "Más" }
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.id === "more") {
                  onSidebarOpenChange(true)
                } else {
                  onPosTabChange(item.id)
                  onTabChangeWithEffects(item.id)
                }
              }}
              className={`flex flex-col items-center justify-center transition-colors relative ${
                posTab === item.id ? "text-primary" : "text-muted-foreground hover:bg-accent/50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {posTab === item.id && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-b-full"
                />
              )}
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  )
}
