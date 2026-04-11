"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, BarChart3, X, LogOut, Menu, CheckCircle, 
  Eye, DollarSign, Package, Trash2, ShieldCheck, 
  Users, TrendingUp, ArrowRight, Building2, MapPin, 
  Search, Filter, Globe, Zap, Database, DownloadCloud, RotateCcw,
  KeyRound, Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import type { TenantData } from "@/types"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { fadeInUp, staggerContainer, floatAnimation } from "@/lib/animations"
import { GlobalSalesChart } from "./charts/GlobalSalesChart"

interface SuperAdminDashboardProps {
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  onSignOut: () => void
}

export const SuperAdminDashboard = ({
  sidebarOpen,
  onSidebarOpenChange,
  onSignOut
}: SuperAdminDashboardProps) => {
  const [saTab, setSaTab] = useState("hub")
  const [tenants, setTenants] = useState<TenantData[]>([])
  const [codes, setCodes] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [globalUsers, setGlobalUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [userFilter, setUserFilter] = useState({ tenantId: "all", searchQuery: "" })
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setChartData(data.chartData)
      }
    } catch (error) {
      console.error("Error al cargar estadísticas")
    }
  }, [])

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activation-codes")
      const data = await res.json()
      if (data.success) {
        setCodes(data.data)
      }
    } catch (error) {
       console.error("Error al cargar códigos")
    }
  }, [])

  const fetchTenants = useCallback(async () => {
    try {
      const res = await fetch("/api/tenants")
      const data = await res.json()
      if (data.success) {
        setTenants(data.data)
      }
    } catch (error) {
      toast.error("Error al cargar negocios")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchGlobalUsers = useCallback(async () => {
    try {
      const query = userFilter.tenantId !== "all" ? `?tenantId=${userFilter.tenantId}` : ""
      const res = await fetch(`/api/admin/users${query}`)
      const data = await res.json()
      if (data.success) {
        setGlobalUsers(data.data)
      }
    } catch (error) {
      console.error("Error al cargar usuarios globales")
    }
  }, [userFilter.tenantId])

  useEffect(() => {
    fetchTenants()
    fetchStats()
    fetchCodes()
    fetchGlobalUsers()
  }, [fetchTenants, fetchStats, fetchCodes, fetchGlobalUsers])

  const generateCode = async () => {
    try {
      const res = await fetch("/api/admin/activation-codes", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        toast.success("Código generado: " + data.data.code)
        fetchCodes()
      }
    } catch (error) {
      toast.error("Error al generar código")
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Negocio marcado como ${status}`)
        fetchTenants()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Error de servidor")
    }
  }

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("¿Estas completamente seguro? Esta accion eliminara permanentemente todos los datos de este negocio.")) return
    try {
      const res = await fetch(`/api/tenants/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Negocio eliminado exitosamente")
        fetchTenants()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Error de servidor")
    }
  }

  const filteredTenants = tenants.filter(t => 
    t.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nit.includes(searchQuery) ||
    t.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-2xl"
          />
          <p className="text-emerald-500 font-black uppercase tracking-[0.2em] text-xs">Iniciando Consola Maestra...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Premium Sidebar */}
      <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border 
        transition-transform duration-500 ease-out lg:translate-x-0 lg:static 
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tighter leading-none block text-foreground">SUPER<span className="text-emerald-500">ADMIN</span></span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Master Console</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-400" onClick={() => onSidebarOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-4 mb-4">Navegación</p>
          {[
            { id: "hub", icon: Zap, label: "Panel Central" },
            { id: "tenants", icon: Building2, label: "Red de Negocios" },
            { id: "users", icon: Users, label: "Usuarios Globales" },
            { id: "codes", icon: ShieldCheck, label: "Códigos de Activación" },
            { id: "stats", icon: BarChart3, label: "Análisis Global" },
            { id: "maintenance", icon: Database, label: "Mantenimiento" }
          ].map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className={`
                w-full justify-start h-14 px-4 rounded-xl transition-all duration-300 group
                ${saTab === item.id 
                  ? "bg-primary text-primary-foreground font-black shadow-xl" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"}
              `}
              onClick={() => { setSaTab(item.id); onSidebarOpenChange(false); }}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${saTab === item.id ? "text-emerald-500" : ""}`} />
              <span className="uppercase text-[11px] tracking-widest leading-none">{item.label}</span>
              {saTab === item.id && (
                <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </Button>
          ))}
        </nav>

        <div className="p-8 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full h-12 justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-bold uppercase text-[10px] tracking-widest cursor-pointer" 
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>

        <header className="relative z-10 flex items-center justify-between p-6 lg:p-10">
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => onSidebarOpenChange(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="hidden lg:block">
             <h2 className="text-3xl font-black tracking-tighter uppercase italic text-foreground/90">
                {saTab === "hub" ? "Hub del Sistema" : saTab === "tenants" ? "Red de Negocios" : saTab === "users" ? "Auditoría de Usuarios" : saTab === "codes" ? "Llaves de Activación" : saTab === "stats" ? "Análisis Global" : "Mantenimiento de Red"}
             </h2>
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] mt-1">
                Última Sincronización: {new Date().toLocaleTimeString()}
             </p>
          </div>

          <div className="flex items-center gap-6">
             <ThemeToggle />
             <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-black uppercase text-foreground">Admin Total</span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Llave Maestra Activa</span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-[2px]">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[inherit] flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
             </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 p-6 lg:p-10 pt-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {saTab === "hub" && (
              <motion.div key="hub" variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10">
                {/* Global KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Ingresos Totales", value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, trend: "+12.5%", color: "text-emerald-400" },
                    { label: "Nodos Activos", value: stats?.activeNodes || 0, icon: Globe, trend: "+4", color: "text-blue-400" },
                    { label: "Solicitudes Pendientes", value: stats?.pendingRequests || 0, icon: Zap, trend: "-2", color: "text-amber-400" },
                    { label: "Activos Totales", value: stats?.totalAssets || 0, icon: Package, trend: "+1.2k", color: "text-purple-400" }
                  ].map((stat, i) => (
                    <motion.div key={i} variants={fadeInUp}>
                       <Card className="bg-card border-border hover:border-primary/30 transition-all group overflow-hidden relative cursor-pointer">
                          <CardContent className="p-6">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/30 rounded-bl-[4rem] group-hover:bg-primary/5 transition-colors" />
                            <div className="flex justify-between items-start mb-4">
                             <div className={`p-3 rounded-xl bg-accent ${stat.color} transition-colors group-hover:bg-muted`}>
                               <stat.icon className="w-5 h-5" />
                               </div>
                               <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 font-black tracking-widest font-mono">{stat.trend}</Badge>
                            </div>
                            <p className="text-3xl font-black tracking-tighter mb-1 font-mono">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{stat.label}</p>
                          </CardContent>
                       </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Main Analytics Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <motion.div variants={fadeInUp} className="lg:col-span-2">
                     <Card className="bg-card border-border p-8 rounded-[2rem] h-full relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                           <div>
                              <h3 className="text-xl font-black tracking-tighter uppercase italic">Rendimiento Consolidado</h3>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 italic">Evolución de Ingresos de la Plataforma (Siete Días)</p>
                           </div>
                           <Badge className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1">DATOS EN VIVO</Badge>
                        </div>
                        <GlobalSalesChart data={chartData} />
                     </Card>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="lg:col-span-1">
                     <Card className="bg-card border-border p-8 rounded-[2rem] h-full">
                        <h3 className="text-xl font-black tracking-tighter uppercase italic mb-8">Top Negocios</h3>
                        <div className="space-y-6">
                           {[...tenants]
                             .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
                             .slice(0, 4)
                             .map((t, i) => (
                              <div key={t.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl hover:bg-accent transition-all group cursor-pointer border border-transparent hover:border-emerald-500/20">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-black text-slate-950">
                                       {t.businessName[0]}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black uppercase tracking-tight leading-none mb-1">{t.businessName}</p>
                                       <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{t.city}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs font-black text-emerald-400">{formatCurrency(t.totalSales || 0)}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                       <TrendingUp className="w-3 h-3 text-emerald-500" />
                                       <span className="text-[8px] font-black text-gray-600 uppercase">Top {i+1}</span>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-8 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 cursor-pointer" onClick={() => setSaTab("tenants")}>
                           Auditoría de Red Completa <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                     </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {saTab === "tenants" && (
              <motion.div key="tenants" variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">Red de Negocios</h1>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Monitoreo y Control de Acceso Central</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                       <Input 
                         placeholder="NIT, Dueño o Negocio..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="h-12 w-64 pl-10 bg-muted/30 border-border rounded-xl text-xs font-medium focus:border-emerald-500 transition-all placeholder:text-muted-foreground/30"
                       />
                    </div>
                    <Button variant="outline" className="h-12 border-border hover:bg-accent text-muted-foreground cursor-pointer">
                       <Filter className="w-4 h-4 mr-2" />
                       <span className="uppercase text-[9px] font-black tracking-widest">Filtrar</span>
                    </Button>
                  </div>
                </div>

                <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Entidad</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hidden md:table-cell">Región</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Estado</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hidden md:table-cell">Productos</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hidden md:table-cell">Ventas Totales</th>
                          <th className="text-right p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Operaciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTenants.map(tenant => (
                          <tr key={tenant.id} className="hover:bg-accent/30 transition-colors group">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-black group-hover:bg-primary/10 transition-colors">
                                     <Store className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-black text-sm tracking-tight uppercase leading-none mb-1">{tenant.businessName}</p>
                                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase italic">NIT: {tenant.nit}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6 hidden md:table-cell">
                               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                  <MapPin className="w-3 h-3 text-emerald-500/50" />
                                  {tenant.city}
                               </div>
                            </td>
                            <td className="p-6">
                              <StatusBadge status={tenant.status} />
                            </td>
                            <td className="p-6 hidden md:table-cell text-sm font-black italic">{tenant._count?.products || 0}</td>
                            <td className="p-6 hidden md:table-cell text-sm font-black italic text-emerald-400">{formatCurrency(tenant.totalSales || 0)}</td>
                            <td className="p-6">
                              <div className="flex items-center justify-end gap-3">
                                {tenant.status === "PENDING" && (
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                      size="sm" 
                                      className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-[9px] tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer" 
                                      onClick={() => handleStatusChange(tenant.id, "ACTIVE")}
                                    >
                                      <Zap className="w-3 h-3 mr-2" />Activar
                                    </Button>
                                  </motion.div>
                                )}
                                {tenant.status === "ACTIVE" && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-9 px-4 text-amber-500 hover:bg-amber-500/10 font-bold uppercase text-[9px] tracking-widest rounded-xl cursor-pointer" 
                                    onClick={() => handleStatusChange(tenant.id, "SUSPENDED")}
                                  >
                                    Suspender
                                  </Button>
                                )}
                                {tenant.status === "SUSPENDED" && (
                                  <Button 
                                    size="sm" 
                                    className="h-9 px-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-black uppercase text-[9px] tracking-widest rounded-xl cursor-pointer" 
                                    onClick={() => handleStatusChange(tenant.id, "ACTIVE")}
                                  >
                                    Restaurar
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-9 h-9 border border-border hover:bg-accent transition-all rounded-xl cursor-pointer" 
                                  onClick={() => setSelectedTenant(tenant)}
                                >
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredTenants.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-20 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-30">
                                  <Search className="w-12 h-12" />
                                  <p className="font-black uppercase tracking-[0.3em] text-xs">No se encontraron nodos en la red central</p>
                               </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {saTab === "codes" && (
              <motion.div key="codes" variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">Llaves de Activación</h1>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Generación de Seriales para Registro Instantáneo</p>
                  </div>
                  <Button onClick={generateCode} className="h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer">
                     <ShieldCheck className="w-5 h-5 mr-3" /> Generar Nueva Llave
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {codes.map(code => (
                     <Card key={code.id} className="bg-card border-border overflow-hidden group hover:border-emerald-500/40 transition-all rounded-[2rem]">
                        <CardContent className="p-8">
                           <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                 <ShieldCheck className={`w-6 h-6 ${code.isUsed ? "text-gray-500" : "text-emerald-500"}`} />
                              </div>
                              <Badge className={code.isUsed ? "bg-gray-500/20 text-gray-500 border-transparent font-black text-[9px]" : "bg-emerald-500 text-slate-950 font-black text-[9px]"}>
                                 {code.isUsed ? "USADO" : "DISPONIBLE"}
                              </Badge>
                           </div>
                           <p className="text-2xl font-black tracking-[0.1em] font-mono mb-2 text-foreground group-hover:text-emerald-400 transition-colors uppercase select-all">{code.code}</p>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Creado: {new Date(code.createdAt).toLocaleDateString()}</p>
                           
                           {code.isUsed && code.tenant && (
                              <div className="pt-4 border-t border-border mt-4">
                                 <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Usado por:</p>
                                 <p className="text-xs font-black uppercase text-foreground">{code.tenant.businessName}</p>
                                 <p className="text-[9px] font-bold text-gray-600 uppercase">NIT: {code.tenant.nit}</p>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                   ))}
                   {codes.length === 0 && (
                      <div className="col-span-full p-20 text-center border-2 border-dashed border-border rounded-[3rem] opacity-30">
                         <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                         <p className="font-black uppercase tracking-widest text-xs">No hay llaves generadas</p>
                      </div>
                   )}
                </div>
              </motion.div>
            )}

            {saTab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-black tracking-tighter italic uppercase">Inteligencia de Plataforma</h1>
                  <Button className="h-12 bg-foreground text-background hover:bg-emerald-400 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl cursor-pointer">
                     <Package className="w-4 h-4 mr-2" /> Reporte Global de Auditoría
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="bg-card border-border p-8 rounded-[2rem]">
                      <h3 className="text-lg font-black tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                         <MapPin className="w-5 h-5 text-emerald-500" /> Distribución Regional
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(tenants.reduce((acc, t) => { acc[t.city] = (acc[t.city] || 0) + 1; return acc }, {} as Record<string, number>))
                          .sort(([,a], [,b]) => b - a)
                          .map(([city, count]) => (
                            <div key={city} className="space-y-2">
                               <div className="flex items-center justify-between px-1">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{city}</span>
                                  <span className="text-[10px] font-black text-emerald-500">{count} Nodos</span>
                               </div>
                               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / tenants.length) * 100}%` }}
                                    className="h-full bg-emerald-500" 
                                  />
                               </div>
                            </div>
                        ))}
                      </div>
                  </Card>

                  <Card className="bg-card border-border p-8 rounded-[2rem] lg:col-span-2">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-lg font-black tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />Matriz de Rendimiento Consolidado
                         </h3>
                         <div className="flex gap-2">
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 tracking-widest uppercase italic font-black uppercase">Crecimiento Vital</div>
                         </div>
                      </div>
                      <GlobalSalesChart data={chartData} />
                  </Card>
                </div>
              </motion.div>
            )}
            {saTab === "maintenance" && (
              <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-black tracking-tighter italic uppercase text-foreground">Mantenimiento de Sistema</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Backup Card */}
                  <Card className="bg-card border-border p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-all" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <DownloadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic">Copia de Seguridad</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Descargar base de datos actual</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-8">
                      Genera un archivo comprimido de la base de datos actual. Este archivo contiene todos los clientes, ventas y configuraciones del sistema.
                    </p>
                    <Button 
                      onClick={() => window.open("/api/admin/backup/download", "_blank")}
                      className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      Descargar Backup (.db)
                    </Button>
                  </Card>

                  {/* Restore Card */}
                  <Card className="bg-card border-border p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-all" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                        <RotateCcw className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic">Restaurar Sistema</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Cargar copia de seguridad</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sube un archivo de backup para restaurar el sistema. <span className="text-amber-500 font-bold">¡CUIDADO!</span> Esto reemplazará todos los datos actuales.
                    </p>
                    
                    <div className="space-y-4">
                      <Input 
                        type="file" 
                        accept=".db"
                        className="bg-muted border-border cursor-pointer h-12 pt-3"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          if (!confirm("⚠️ ¿ESTÁS SEGURO? Esta acción sobrescribirá TODA la base de datos actual. No se puede deshacer.")) return

                          const formData = new FormData()
                          formData.append("file", file)

                          const loadingToast = toast.loading("Restaurando base de datos...")
                          
                          try {
                            const res = await fetch("/api/admin/backup/restore", {
                              method: "POST",
                              body: formData
                            })
                            const data = await res.json()
                            if (data.success) {
                              toast.success(data.message, { id: loadingToast })
                              setTimeout(() => window.location.reload(), 2000)
                            } else {
                              toast.error(data.error, { id: loadingToast })
                            }
                          } catch (error) {
                            toast.error("Error al restaurar", { id: loadingToast })
                          }
                        }}
                      />
                      <p className="text-[9px] font-bold text-amber-500/70 uppercase tracking-widest text-center">Solo archivos con extensión .db</p>
                    </div>
                  </Card>
                </div>

                <Card className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                  <div className="flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-amber-500">Protocolo de Emergencia</p>
                      <p className="text-[10px] text-amber-500/80 font-medium">
                        Se recomienda realizar una copia de seguridad antes de cualquier restauración. FostPOS utiliza SQLite como motor de base de datos; asegúrate de que el archivo que subes sea un respaldo legítimo generado por esta herramienta.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            {saTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">Usuarios Globales</h1>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Gestión Centralizada de Operadores y Administradores</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={userFilter.tenantId}
                      onChange={(e) => setUserFilter({ ...userFilter, tenantId: e.target.value })}
                      className="h-12 bg-muted/30 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest px-4 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      <option value="all">TODOS LOS NEGOCIOS</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.businessName.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                       <Input 
                         placeholder="Buscar por nombre o email..." 
                         value={userFilter.searchQuery}
                         onChange={(e) => setUserFilter({ ...userFilter, searchQuery: e.target.value })}
                         className="h-12 w-64 pl-10 bg-muted/30 border-border rounded-xl text-xs font-medium focus:border-emerald-500 transition-all"
                       />
                    </div>
                  </div>
                </div>

                <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Usuario</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Negocio / Sede</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Rol</th>
                          <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Estado</th>
                          <th className="text-right p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Operaciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {globalUsers.filter(u => 
                          u.name.toLowerCase().includes(userFilter.searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userFilter.searchQuery.toLowerCase())
                        ).map(user => (
                          <tr key={user.id} className="hover:bg-accent/30 transition-colors group">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                     {user.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-black text-sm tracking-tight uppercase leading-none mb-1">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold tracking-widest select-all">{user.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase text-foreground/80">{user.tenant?.businessName || 'SISTEMA CENTRAL'}</p>
                                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                     <MapPin className="w-2.5 h-2.5" /> {user.branch?.name || 'ADMINISTRACIÓN'}
                                  </p>
                               </div>
                            </td>
                            <td className="p-6">
                               <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-border">
                                  {user.role}
                               </Badge>
                            </td>
                            <td className="p-6">
                               <Badge className={`text-[9px] font-black tracking-widest uppercase border-transparent ${user.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                                  {user.isActive ? 'ACTIVO' : 'INACTIVO'}
                               </Badge>
                            </td>
                            <td className="p-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-9 h-9 border border-border hover:bg-emerald-500/10 hover:border-emerald-500/20 rounded-xl cursor-pointer"
                                    onClick={async () => {
                                       try {
                                          const res = await fetch(`/api/admin/users/${user.id}`, {
                                             method: "PATCH",
                                             headers: { "Content-Type": "application/json" },
                                             body: JSON.stringify({ isActive: !user.isActive })
                                          })
                                          if (res.ok) {
                                             toast.success(`Usuario ${user.isActive ? 'Desactivado' : 'Activado'}`)
                                             fetchGlobalUsers()
                                          }
                                       } catch (error) {
                                          toast.error("Error al cambiar estado")
                                       }
                                    }}
                                  >
                                    <Zap className={`w-4 h-4 ${user.isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-9 h-9 border border-border hover:bg-accent rounded-xl cursor-pointer"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Edit User Dialog (Password Reset) */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md bg-background border-border p-0 overflow-hidden text-foreground rounded-[2.5rem]">
          {selectedUser && (
            <div className="flex flex-col">
               <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 border-b border-border">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <KeyRound className="w-7 h-7 text-emerald-500" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">Seguridad de Usuario</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedUser.name}</p>
                     </div>
                  </div>
               </div>
               
               <form onSubmit={async (e) => {
                  e.preventDefault()
                  setIsUpdatingUser(true)
                  const formData = new FormData(e.currentTarget)
                  const password = formData.get("password") as string
                  const role = formData.get("role") as string
                  const name = formData.get("name") as string

                  try {
                     const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, role, password: password || undefined })
                     })
                     const data = await res.json()
                     if (data.success) {
                        toast.success("Usuario actualizado correctamente")
                        setSelectedUser(null)
                        fetchGlobalUsers()
                     } else {
                        toast.error(data.error)
                     }
                  } catch (error) {
                     toast.error("Error de servidor")
                  } finally {
                     setIsUpdatingUser(false)
                  }
               }} className="p-8 space-y-6">
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
                        <Input name="name" defaultValue={selectedUser.name} className="h-12 bg-muted/40 border-border rounded-xl mt-1 font-bold" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rol del Sistema</label>
                        <select name="role" defaultValue={selectedUser.role} className="w-full h-12 bg-muted/40 border border-border rounded-xl mt-1 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                           <option value="TENANT_ADMIN">ADMINISTRADOR DE NEGOCIO</option>
                           <option value="CASHIER">CAJERO EXCLUSIVO</option>
                           <option value="WAREHOUSE">GESTIÓN DE BODEGA</option>
                           <option value="SUPER_ADMIN">SUPER ADMIN (SISTEMA)</option>
                        </select>
                     </div>
                     <div className="pt-4 border-t border-border">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-1">Nueva Contraseña (Opcional)</label>
                        <Input name="password" type="password" placeholder="Dejar vacío para no cambiar" className="h-12 bg-emerald-500/5 border-emerald-500/20 rounded-xl mt-1 font-mono" />
                        <p className="text-[8px] font-bold text-gray-500 uppercase mt-2 ml-1 tracking-widest">El cambio de contraseña es instantáneo tras guardar.</p>
                     </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                     <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer" onClick={() => setSelectedUser(null)}>Cancelar</Button>
                     <Button type="submit" disabled={isUpdatingUser} className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
                        {isUpdatingUser ? "Guardando..." : "Guardar Cambios"}
                     </Button>
                  </div>
               </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Enhanced Tenant Details Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-xl bg-background border-border p-0 overflow-hidden text-foreground rounded-[3rem]">
          {selectedTenant && (
            <div className="flex flex-col">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-[10rem] group-hover:bg-white/20 transition-all pointer-events-none" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 flex items-center gap-6"
                >
                   <div className="w-20 h-20 rounded-3xl bg-background flex items-center justify-center font-black text-3xl text-foreground shadow-2xl">
                      {selectedTenant.businessName[0]}
                   </div>
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic text-background">{selectedTenant.businessName}</h2>
                      <div className="flex gap-2 mt-2">
                         <Badge className="bg-background text-foreground border-border font-black text-[9px] tracking-widest">{selectedTenant.status === "ACTIVE" ? "ACTIVO" : selectedTenant.status === "PENDING" ? "PENDIENTE" : "SUSPENDIDO"}</Badge>
                         <Badge className="bg-white/20 text-background border-transparent font-black text-[9px] tracking-widest">ID: {selectedTenant.id.slice(-8).toUpperCase()}</Badge>
                      </div>
                   </div>
                </motion.div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Identidad Corporativa</p>
                        <p className="text-sm font-bold text-foreground/80">NIT: {selectedTenant.nit}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Representante Legal</p>
                        <p className="text-sm font-bold text-foreground/80">{selectedTenant.ownerName}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Acceso Regional</p>
                        <p className="text-sm font-bold text-foreground/80 italic">{selectedTenant.city}, {selectedTenant.address || "Sede Principal"}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Contacto Seguro</p>
                        <p className="text-sm font-bold text-foreground/80">{selectedTenant.email}</p>
                        <p className="text-sm font-bold text-foreground/80">{selectedTenant.phone}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Ingreso a la Red</p>
                        <p className="text-sm font-bold text-foreground/80 italic">{new Date(selectedTenant.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="p-6 bg-muted rounded-2xl border border-border group hover:border-primary/30 transition-all text-center">
                      <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{selectedTenant._count?.products || 0}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Productos</p>
                   </div>
                   <div className="p-6 bg-muted rounded-2xl border border-border group hover:border-primary/30 transition-all text-center">
                      <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{selectedTenant._count?.sales || 0}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ventas</p>
                   </div>
                   <div className="p-6 bg-muted rounded-2xl border border-border group hover:border-primary/30 transition-all text-center">
                      <p className="text-2xl font-black text-primary">{formatCurrency(selectedTenant.totalSales || 0)}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Rendimiento</p>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <Button 
                     variant="ghost" 
                     className="flex-1 h-14 border border-destructive/20 text-destructive hover:bg-destructive/10 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl cursor-pointer" 
                     onClick={() => { handleDeleteTenant(selectedTenant.id); setSelectedTenant(null) }}
                   >
                     <Trash2 className="w-4 h-4 mr-3" />
                     Eliminar Nodo
                   </Button>
                   <Button 
                     className="flex-1 h-14 bg-primary text-primary-foreground hover:opacity-90 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl cursor-pointer shadow-lg shadow-primary/20 transition-all" 
                     onClick={() => setSelectedTenant(null)}
                   >
                     Cerrar
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
