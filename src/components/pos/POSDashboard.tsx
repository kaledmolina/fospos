"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, X, LogOut, Menu, Bell, Package, AlertCircle, 
  Clock, BarChart3, ShoppingBag, Users, CreditCard, 
  Receipt, Wallet, RefreshCw, Building2, Home, Plus, Star, FolderOpen, Globe, Ticket, Truck, ShieldCheck, Maximize2, Minimize2, ChevronDown
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { BranchSelector } from "./shared/BranchSelector"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Confetti } from "@/components/shared/Confetti"
import { FAB } from "@/components/ui/fab"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onProfileOpen: () => void
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
  onBranchChange,
  onProfileOpen
}: POSDashboardProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canShowTooltip, setCanShowTooltip] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(["Operaciones"])

  const toggleGroup = (groupTitle: string) => {
    if (openGroups.includes(groupTitle)) {
      setOpenGroups(openGroups.filter(g => g !== groupTitle))
    } else {
      setOpenGroups([...openGroups, groupTitle])
    }
  }

  const menuGroups = useMemo(() => [
    {
      title: "Operaciones",
      icon: ShoppingBag,
      items: [
        { id: "dashboard", icon: BarChart3, label: "Dashboard" },
        { id: "sale", icon: ShoppingBag, label: "Venta" },
        { id: "transactions", icon: Receipt, label: "Historial" },
        { id: "cash", icon: Wallet, label: "Caja" },
      ]
    },
    {
      title: "Inventario",
      icon: Package,
      items: [
        { id: "products", icon: Package, label: "Productos" },
        { id: "categories", icon: FolderOpen, label: "Categorías" },
        { id: "advanced-inventory", icon: Truck, label: "Inventario Pro" },
        { id: "suppliers", icon: Users, label: "Proveedores" },
      ]
    },
    {
      title: "Clientes",
      icon: Users,
      items: [
        { id: "customers", icon: Users, label: "Clientes" },
        { id: "credits", icon: CreditCard, label: "Fiados" },
        ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "loyalty", icon: Star, label: "Fidelización" }] : []),
        { id: "giftcards", icon: Ticket, label: "Gift Cards" },
      ]
    },
    {
      title: "Servicios y Gastos",
      icon: RefreshCw,
      items: [
        { id: "subscriptions", icon: RefreshCw, label: "Suscripciones" },
        { id: "expenses", icon: Receipt, label: "Gastos" },
      ]
    },
    {
      title: "Configuración",
      icon: ShieldCheck,
      items: [
        ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "branches", icon: Building2, label: "Sucursales" }] : []),
        ...(session?.user?.role === "TENANT_ADMIN" ? [{ id: "users", icon: Users, label: "Usuarios" }] : []),
        ...(session?.user?.role === "TENANT_ADMIN" || session?.user?.role === "SUPER_ADMIN" ? [{ id: "logs", icon: ShieldCheck, label: "Auditoría" }] : [])
      ]
    }
  ].filter(group => group.items.length > 0), [session])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      setCanShowTooltip(false);
    } else {
      const timer = setTimeout(() => {
        setCanShowTooltip(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  const currentBranch = branches.find(b => b.id === selectedBranch)
  const displayName = currentBranch ? currentBranch.name : session?.user?.tenantName

  return (
    <div className="h-screen bg-slate-50 dark:bg-zinc-950 text-foreground transition-colors duration-300 overflow-hidden relative flex">
      <Confetti show={showConfetti} />
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onSidebarOpenChange(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Modern Floating Sidebar */}
      <aside
        className={`fixed lg:relative z-50 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col h-[calc(100vh-1rem)] m-2
          ${sidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-[calc(100%+2rem)] lg:translate-x-0"}
          bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden`}
      >
        <div className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} px-3 border-b border-white/5 shrink-0 h-14`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 shrink-0 overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-white/20"
            >
              {currentBranch?.logoUrl ? (
                <img src={currentBranch.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : session?.user?.logoUrl ? (
                <img src={session.user.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-5 h-5 text-white" />
              )}
            </motion.div>
            {/* Branch selector removed from here to avoid redundancy with the header */}
          </div>
          
          {sidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-primary/10 text-primary hidden lg:flex"
              onClick={() => onSidebarOpenChange(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}

          {/* Mobile close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-full h-10 w-10" 
            onClick={() => onSidebarOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-2 py-4 min-h-0">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-4">
              {menuGroups.map((group, groupIdx) => (
                <div key={group.title} className="space-y-1">
                  {sidebarOpen ? (
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 hover:text-primary transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <group.icon className="w-3.5 h-3.5" />
                        <span>{group.title}</span>
                      </div>
                      <ChevronDown 
                        className={`w-3 h-3 transition-transform duration-300 ${openGroups.includes(group.title) ? "rotate-180" : ""}`} 
                      />
                    </button>
                  ) : (
                    <div className="flex justify-center py-2">
                      <div className="w-6 h-px bg-white/10" />
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {(openGroups.includes(group.title) || !sidebarOpen) && (
                      <motion.div
                        initial={sidebarOpen ? { height: 0, opacity: 0 } : {}}
                        animate={sidebarOpen ? { height: "auto", opacity: 1 } : {}}
                        exit={sidebarOpen ? { height: 0, opacity: 0 } : {}}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden space-y-1"
                      >
                        {group.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 + groupIdx * 0.05 }}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={posTab === item.id ? "default" : "ghost"}
                                  className={`w-full ${sidebarOpen ? "justify-start px-3 pl-6" : "justify-center px-0"} cursor-pointer h-10 transition-all duration-200 relative group rounded-xl
                                    ${posTab === item.id 
                                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                                      : "hover:bg-primary/5 text-muted-foreground/80 hover:text-primary"}`}
                                  onClick={() => onTabChangeWithEffects(item.id)}
                                >
                                  <item.icon className={`${sidebarOpen ? "w-4 h-4 mr-3" : "w-5 h-5"} shrink-0 transition-transform group-hover:scale-110`} />
                                  {sidebarOpen && (
                                    <motion.span
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="truncate font-bold uppercase text-[10px] tracking-widest"
                                    >
                                      {item.label}
                                    </motion.span>
                                  )}
                                  {posTab === item.id && (
                                    <motion.div
                                      layoutId="activePill"
                                      className="absolute left-0 top-2 bottom-2 w-1 bg-primary-foreground rounded-r-full"
                                    />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              {!sidebarOpen && (
                                <TooltipContent side="right" sideOffset={15} className="bg-zinc-900 border-zinc-800 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl">
                                  {item.label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </TooltipProvider>
        </ScrollArea>
        
        <div className="p-3 bg-primary/5 backdrop-blur-md shrink-0">
          <div 
            className={`flex items-center ${sidebarOpen ? "gap-3" : "justify-center"} p-3 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-white/10 hover:shadow-xl cursor-pointer transition-all duration-300 group overflow-hidden`}
            onClick={onProfileOpen}
            title={!sidebarOpen ? "Perfil" : ""}
          >
            <div className="w-10 h-10 shrink-0 bg-gradient-to-tr from-primary to-primary/60 rounded-xl flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-black truncate text-foreground">{session?.user?.name}</p>
                <Badge variant="outline" className="h-4 text-[8px] font-black uppercase border-primary/20 bg-primary/5 text-primary">
                  {session?.user?.role === "TENANT_ADMIN" ? "Admin" : "Usuario"}
                </Badge>
              </motion.div>
            )}
          </div>
          <Button 
            variant="ghost" 
            className={`w-full mt-2 ${sidebarOpen ? "justify-start px-3" : "justify-center px-0"} text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 font-black h-10 uppercase text-[10px] tracking-widest`} 
            onClick={onSignOut}
            title={!sidebarOpen ? "Cerrar Sesión" : ""}
          >
            <LogOut className={`${sidebarOpen ? "w-4 h-4 mr-3" : "w-5 h-5"}`} />
            {sidebarOpen && <span>Salir</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen flex flex-col overflow-hidden relative z-10">
        {/* Modern Floating Header */}
        <header className="h-16 flex items-center shrink-0 px-3 mt-1 md:px-6 print:hidden relative z-40">
          <div className="flex-1 flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl h-12 px-4 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 lg:hidden"
                  onClick={() => onSidebarOpenChange(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              {!sidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 hidden lg:flex"
                  onClick={() => onSidebarOpenChange(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-px h-6 bg-border/50 mx-1" />
                <BranchSelector 
                  branches={branches}
                  selectedBranch={selectedBranch}
                  onBranchChange={onBranchChange}
                  isAdmin={session?.user?.role === "TENANT_ADMIN" || session?.user?.role === "SUPER_ADMIN"}
                  customName={displayName}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-accent hidden sm:flex h-10 w-10 transition-all active:scale-95"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>

              <div className="w-px h-6 bg-border mx-1" />
              <ThemeToggle />
              
              <Popover onOpenChange={onNotificationsOpenChange}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent rounded-xl w-10 h-10 transition-all active:scale-95">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 shadow-2xl border-border bg-card/95 backdrop-blur-md rounded-3xl overflow-hidden mt-2" align="end">
                  <div className="p-4 bg-primary/5 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-primary">Notificaciones</h3>
                      <Badge variant="secondary" className="font-black text-[10px] h-5 mt-1">{unreadNotifications} Nuevas</Badge>
                    </div>
                    {(notifications?.length || 0) > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[10px] h-6 px-2 uppercase font-black hover:text-primary transition-colors hover:bg-primary/10"
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
                        <Bell className="w-8 h-8 text-muted-foreground/10" />
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Todo en orden</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 transition-colors hover:bg-accent/30 ${!n.isRead ? "bg-primary/5" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 p-2 rounded-xl ${
                                n.type === "LOW_STOCK" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10" :
                                (n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") ? "bg-red-100 text-red-600 dark:bg-red-500/10" :
                                "bg-primary/10 text-primary"
                              }`}>
                                {n.type === "LOW_STOCK" ? <Package className="w-4 h-4" /> :
                                 (n.type === "CREDIT_OVERDUE" || n.type === "OVERDUE_CREDIT") ? <AlertCircle className="w-4 h-4" /> :
                                 <Clock className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black leading-tight mb-1 uppercase tracking-tight">{n.title}</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              {/* Branch selector moved to sidebar */}
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-2 md:p-3 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={posTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      {posTab !== "sale" && posTab !== "settings" && (
        <FAB
          icon={Plus}
          onClick={() => onPosTabChange("sale")}
          label="Nueva Venta"
        />
      )}

      {/* Mobile Bottom Navigation (Glassmorphism) */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl z-40 h-16 overflow-hidden">
        <div className="grid grid-cols-5 h-full">
          {[
            { id: "dashboard", icon: Home, label: "Inicio" },
            { id: "sale", icon: ShoppingBag, label: "Venta" },
            { id: "products", icon: Package, label: "Stock" },
            { id: "cash", icon: Wallet, label: "Caja" },
            { id: "more", icon: Menu, label: "Menú" }
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
              className={`flex flex-col items-center justify-center transition-all relative ${
                posTab === item.id ? "text-primary scale-110" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {posTab === item.id && (
                <motion.div
                  layoutId="mobileActive"
                  className="absolute bottom-1 w-6 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              )}
              <item.icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-black uppercase mt-1 tracking-tighter">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  )
}
