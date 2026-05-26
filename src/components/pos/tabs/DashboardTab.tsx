"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  RefreshCw, TrendingUp, ShoppingBag, DollarSign, 
  CreditCard, ArrowUpRight, ArrowDownRight, Target, 
  AlertTriangle, AlertCircle, BarChart3, Receipt, Package 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatedCounter } from "@/components/shared/AnimatedCounter"
import { Sparkline } from "@/components/shared/Sparkline"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency, formatDate } from "@/lib/utils"
import { SalesChart } from "../charts/SalesChart"

interface DashboardTabProps {
  dashboardStats: any
  fetchPOSData: () => void
  onPosTabChange: (tab: string) => void
  overdueCredits: any[]
  setCreditFilter: (filter: string) => void
}

export const DashboardTab = ({
  dashboardStats,
  fetchPOSData,
  onPosTabChange,
  overdueCredits,
  setCreditFilter
}: DashboardTabProps) => {
  return (
    <motion.div key="dashboard" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h1 className="text-xl font-black text-foreground uppercase tracking-tight">Resumen General</h1>
      </div>
      
      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4" variants={staggerContainer} initial="initial" animate="animate">
        {[
          { 
            icon: TrendingUp, label: "Ventas Hoy", value: dashboardStats?.todaySales || 0, 
            color: "emerald", trend: "+12%", isUp: true, prefix: "$",
            gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
            iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            borderHover: "hover:border-emerald-500/30"
          },
          { 
            icon: ShoppingBag, label: "Transacciones", value: dashboardStats?.todayTransactions || 0, 
            color: "blue", trend: "+5%", isUp: true, prefix: "",
            gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
            iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            borderHover: "hover:border-blue-500/30"
          },
          { 
            icon: DollarSign, label: "Este Mes", value: dashboardStats?.monthSales || 0, 
            color: "purple", trend: "+18%", isUp: true, prefix: "$",
            gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
            iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
            iconColor: "text-purple-600 dark:text-purple-400",
            badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            borderHover: "hover:border-purple-500/30"
          },
          { 
            icon: CreditCard, label: "Cobros Pendientes", value: dashboardStats?.pendingCredits || 0, 
            color: "orange", trend: "Créditos", isUp: false, prefix: "$",
            gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
            iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
            iconColor: "text-orange-600 dark:text-orange-400",
            badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            borderHover: "hover:border-orange-500/30"
          }
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }}>
            <Card className={`cursor-pointer border border-border/40 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-primary/5 transition-all duration-500 hover:shadow-xl overflow-hidden relative group h-full ${stat.borderHover}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <Badge variant="outline" className={`h-5 border ${stat.badge} text-[10px] font-black tracking-wider`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-1">{stat.label}</p>
                  <div className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                    <AnimatedCounter value={stat.value as number} prefix={stat.prefix === "$" ? "$" : ""} />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-muted/50 flex items-center justify-between">
                   <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-background" />
                      <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-background" />
                   </div>
                   <p className="text-[9px] font-black uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wider">Ver Detalles</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Goal Widget */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
        <Card className="bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 text-white border border-white/10 dark:border-white/5 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-teal-500/10 opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-white/80 text-[10px] uppercase font-black tracking-widest">Meta Mensual del Negocio</p>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tighter">{formatCurrency(dashboardStats?.monthSales || 0)}</p>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider">de {formatCurrency(dashboardStats?.monthlyGoal || 0)}</p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1 h-3 bg-white/10 dark:bg-zinc-800 rounded-full overflow-hidden p-[2px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full shadow-[0_0_12px_var(--primary)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1000000)) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs font-black bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full shadow-inner">{Math.min(Math.round(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1)) * 100), 100)}%</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end shrink-0 border-l border-white/10 pl-6 py-2">
                <p className="text-[9px] uppercase font-black text-white/40 mb-1 tracking-widest">Tu progreso hoy</p>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-2xl font-black leading-none text-primary">{Math.round(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100)}%</p>
                      <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider mt-1">Objetivo Diario</p>
                   </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts and Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full border border-border/40 dark:border-white/5 shadow-xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-5 pt-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Tendencia de Ventas (7 días)</CardTitle>
              <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 h-[220px]">
              <SalesChart data={dashboardStats?.weeklySales || []} />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {(dashboardStats?.expiredCount || 0) > 0 && (
              <motion.div key="expired" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border border-red-500/20 bg-red-500/5 backdrop-blur-md overflow-hidden shadow-lg shadow-red-500/5">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-red-500 text-xs font-black uppercase tracking-widest">Productos Vencidos</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Tienes <span className="font-black text-red-500">{dashboardStats?.expiredCount}</span> productos que ya caducaron y deben ser removidos.</p>
                    <Button 
                      size="sm" 
                      className="w-full h-9 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/15 cursor-pointer text-xs font-black uppercase tracking-wider rounded-xl transition-all" 
                      onClick={() => onPosTabChange("products")}
                    >
                      Sacar de Inventario
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {(dashboardStats?.nearExpiryCount || 0) > 0 && (
              <motion.div key="near-expiry" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border border-orange-500/20 bg-orange-500/5 backdrop-blur-md overflow-hidden shadow-lg shadow-orange-500/5">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <p className="text-orange-500 text-xs font-black uppercase tracking-widest">Por Vencer Pronto</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Tienes <span className="font-black text-orange-500">{dashboardStats?.nearExpiryCount}</span> productos por vencer. Recomendamos liquidarlos.</p>
                    <Button 
                      size="sm" 
                      className="w-full h-9 bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/15 cursor-pointer text-xs font-black uppercase tracking-wider rounded-xl transition-all" 
                      onClick={() => onPosTabChange("products")}
                    >
                      Crear Promoción
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {(dashboardStats?.lowStockProducts || 0) > 0 && (
              <motion.div key="low-stock" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md overflow-hidden shadow-lg shadow-yellow-500/5">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-500 text-xs font-black uppercase tracking-widest">
                        {dashboardStats?.isGlobalView ? "Stock Bajo (Global)" : "Alerta de Stock Bajo"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {dashboardStats?.stockItems?.slice(0, 2).map((item: any, i: number) => (
                        <div key={item.id || `stock-${i}`} className="text-[10px] font-black bg-white/50 dark:bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-yellow-500/10 flex justify-between items-center text-yellow-800 dark:text-yellow-400">
                          <span className="truncate mr-2 uppercase tracking-wide">{item.name}</span>
                          <span className="shrink-0 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/15">{item.stock} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full h-9 bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-md shadow-yellow-500/15 cursor-pointer text-xs font-black uppercase tracking-wider rounded-xl transition-all" 
                      onClick={() => onPosTabChange("products")}
                    >
                      Surtir Stock
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {overdueCredits.length > 0 && (
              <motion.div key="overdue" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border border-red-500/20 bg-red-500/10 backdrop-blur-md shadow-lg shadow-red-500/5">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-red-500 text-xs font-black uppercase tracking-widest">Créditos Vencidos</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Hay <span className="font-black text-red-500">{overdueCredits.length}</span> créditos vencidos en esta sede que requieren cobro urgente.</p>
                    <Button 
                      size="sm" 
                      className="w-full h-9 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/15 cursor-pointer text-xs font-black uppercase tracking-wider rounded-xl transition-all" 
                      onClick={() => { onPosTabChange("credits"); setCreditFilter("overdue") }}
                    >
                      Gestionar Cobros
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card className="flex-1 bg-gradient-to-br from-primary via-primary/95 to-teal-600 text-primary-foreground relative overflow-hidden border-none shadow-xl shadow-primary/20 rounded-2xl group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Target className="w-20 h-20" />
            </div>
            <CardContent className="p-5">
              <p className="text-primary-foreground/75 text-[10px] font-black uppercase tracking-widest mb-1.5">Tu progreso hoy</p>
              <h3 className="text-2xl font-black mb-3 leading-none tracking-tight">{Math.round(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100)}% <span className="text-[11px] font-bold text-primary-foreground/60 uppercase tracking-widest ml-1">de la meta</span></h3>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3.5 p-[1px]">
                <motion.div 
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-primary-foreground/75 italic">¡Sigue así! Estás cerca de superar tu promedio de ventas.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Productos Más Vendidos</CardTitle></CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {dashboardStats?.topProducts?.map((product: any, i: number) => (
                <div key={product.id || `top-${i}`} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary/20 text-primary border border-primary/20 rounded flex items-center justify-center text-xs font-black">{i + 1}</span>
                    <div>
                      <p className="text-xs font-black text-foreground uppercase tracking-tight">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.totalSold} vendidos</p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-primary">{formatCurrency(product.totalRevenue)}</p>
                </div>
              ))}
              {(!dashboardStats?.topProducts || dashboardStats.topProducts.length === 0) && (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No hay ventas aún</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-lg">Ventas Recientes</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-56">
              <div className="space-y-2">
                {dashboardStats?.recentSales?.map((sale: any, i: number) => (
                  <div key={sale.id || `sale-${i}`} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-xs font-black">{formatCurrency(sale.total)}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{sale.customer?.name || "Cliente general"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{formatDate(sale.createdAt)}</p>
                      <Badge variant="outline" className="h-4 text-[10px] font-black uppercase mt-0.5 px-1.5">{sale.paymentMethod}</Badge>
                    </div>
                  </div>
                ))}
                {(!dashboardStats?.recentSales || dashboardStats.recentSales.length === 0) && (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No hay ventas aún</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
