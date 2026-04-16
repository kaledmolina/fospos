"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, X, LogOut, Menu, Bell, Package, AlertCircle, 
  Clock, BarChart3, ShoppingBag, Users, CreditCard, 
  Receipt, Wallet, RefreshCw, Building2, Home, Plus, Star, FolderOpen, Globe, Ticket
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
    <div className="h-screen flex bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Confetti for celebrations */}
      <Confetti show={showConfetti} />
      
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:bg-card/50 flex flex-col h-screen`}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
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
        
        <ScrollArea className="flex-1 px-4 py-4 min-h-0">
          <nav className="space-y-1">
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
              { id: "giftcards", icon: Ticket, label: "Gift Cards" },
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
        </ScrollArea>
        
        <div className="p-4 border-t bg-card/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-none mb-1 text-foreground">{session?.user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">{session?.user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-200 font-bold" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen lg:ml-0 flex flex-col overflow-hidden">
        {/* Unified Header */}
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border print:hidden">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onSidebarOpenChange(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Portal POS</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center pr-2 md:pr-4 border-r border-border mr-1 md:mr-2">
                <ThemeToggle />
              </div>
              
              <Popover onOpenChange={onNotificationsOpenChange}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-all duration-200">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-2xl border-border bg-card/95 backdrop-blur-sm" align="end">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-sm uppercase tracking-tighter">Notificaciones</h3>
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
                        Limpiar Todo
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-80">
                    {(notifications?.length || 0) === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center gap-2">
                        <Bell className="w-8 h-8 text-muted-foreground/20" />
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Todo al día</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 transition-colors hover:bg-accent/30 ${!n.isRead ? "bg-emerald-500/5" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 p-1.5 rounded-lg ${
                                n.type === "LOW_STOCK" ? "bg-yellow-500/10 text-yellow-600" :
                                (n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") ? "bg-red-500/10 text-red-600" :
                                "bg-orange-500/10 text-orange-600"
                              }`}>
                                {n.type === "LOW_STOCK" ? <Package className="w-3.5 h-3.5" /> :
                                 (n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") ? <AlertCircle className="w-3.5 h-3.5" /> :
                                 <Clock className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold leading-tight mb-1">{n.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <div className="pl-2 md:pl-4 border-l border-border ml-1 md:mr-0 mr-[-10px]">
                <BranchSelector 
                  branches={branches}
                  selectedBranch={selectedBranch}
                  onBranchChange={onBranchChange}
                  isAdmin={session?.user?.role === "TENANT_ADMIN" || session?.user?.role === "SUPER_ADMIN"}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6 custom-scrollbar">
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border/50 shadow-[-5px_0_30px_rgba(0,0,0,0.1)] z-40">
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
