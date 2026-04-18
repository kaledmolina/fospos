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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h1 className="text-xl font-black text-foreground uppercase tracking-tight">Resumen General</h1>
      </div>
      
      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" variants={staggerContainer} initial="initial" animate="animate">
        {[
          { 
            icon: TrendingUp, label: "Ventas Hoy", value: dashboardStats?.todaySales || 0, 
            color: "emerald", trend: "+12%", isUp: true, prefix: "$" 
          },
          { 
            icon: ShoppingBag, label: "Transacciones", value: dashboardStats?.todayTransactions || 0, 
            color: "blue", trend: "+5%", isUp: true, prefix: "" 
          },
          { 
            icon: DollarSign, label: "Este Mes", value: dashboardStats?.monthSales || 0, 
            color: "purple", trend: "+18%", isUp: true, prefix: "$" 
          },
          { 
            icon: CreditCard, label: "Cobros Pendientes", value: dashboardStats?.pendingCredits || 0, 
            color: "orange", trend: "Créditos", isUp: false, prefix: "$" 
          }
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={fadeInUp} whileHover={{ scale: 1.02, y: -4 }}>
            <Card className="cursor-pointer border-none shadow-lg shadow-black/5 dark:shadow-primary/5 transition-all duration-300 hover:shadow-xl overflow-hidden relative group h-full">
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 via-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-3 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 bg-${stat.color}-500/10 dark:bg-${stat.color}-500/20 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-4.5 h-4.5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <Badge variant="outline" className={`h-5 border-none ${stat.isUp ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-600'} text-[9px] font-black`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60 mb-0.5">{stat.label}</p>
                  <div className="text-lg font-black text-foreground tabular-nums">
                    <AnimatedCounter value={stat.value as number} prefix={stat.prefix === "$" ? "$" : ""} />
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-muted/50 flex items-center justify-between">
                   <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-background" />
                      <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-background" />
                   </div>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Goal Widget */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
        <Card className="bg-gradient-to-r from-primary to-primary/60 text-white border-none shadow-lg shadow-primary/20 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-white/60" />
                  <p className="text-white/80 text-[10px] uppercase font-black tracking-widest">Meta Mensual</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black">{formatCurrency(dashboardStats?.monthSales || 0)}</p>
                  <p className="text-xs text-white/60">de {formatCurrency(dashboardStats?.monthlyGoal || 0)}</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full shadow-[0_0_8px_white]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1000000)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black">{Math.min(Math.round(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1)) * 100), 100)}%</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <p className="text-[8px] uppercase font-black text-white/40 mb-1">Tu progreso hoy</p>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-sm font-black leading-none">{Math.round(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100)}%</p>
                      <p className="text-[8px] text-white/60">Objetivo Diario</p>
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
          <Card className="h-full border-none shadow-sm bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-3">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Tendencia de Ventas (7 días)</CardTitle>
              <BarChart3 className="w-4 h-4 text-primary/40" />
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <SalesChart data={dashboardStats?.weeklySales || []} />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {(dashboardStats?.expiredCount || 0) > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-sm overflow-hidden border-none shadow-sm">
                  <CardContent className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-tight">Productos Vencidos</p>
                    </div>
                    <p className="text-[11px] text-red-500/80 leading-tight">Tienes {dashboardStats?.expiredCount} productos que ya caducaron.</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full h-7 bg-white dark:bg-zinc-900 border-red-500/20 hover:bg-red-500/10 cursor-pointer text-red-600 dark:text-red-400 text-[9px] font-black uppercase" 
                      onClick={() => onPosTabChange("products")}
                    >
                      Sacar de Inventario
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {(dashboardStats?.nearExpiryCount || 0) > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-orange-500/10 bg-orange-500/5 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-tight">Por Vencer Pronto</p>
                    </div>
                    <p className="text-[11px] text-orange-500/80 leading-tight">Tienes {dashboardStats?.nearExpiryCount} productos por vencer pronto.</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full h-7 bg-white dark:bg-zinc-900 border-orange-500/20 hover:bg-orange-500/10 cursor-pointer text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase" 
                      onClick={() => onPosTabChange("products")}
                    >
                      Crear Promoción
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {(dashboardStats?.lowStockProducts || 0) > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-yellow-500/10 bg-yellow-500/5 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-yellow-500" />
                      <p className={`text-[10px] font-black uppercase tracking-tight ${dashboardStats?.isGlobalView ? "text-orange-500" : "text-yellow-600"}`}>
                        {dashboardStats?.isGlobalView ? "Stock Bajo (Global)" : "Stock Bajo"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {dashboardStats?.stockItems?.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="text-[9px] font-black bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10 flex justify-between items-center text-yellow-700 dark:text-yellow-300">
                          <span className="truncate mr-2 uppercase">{item.name}</span>
                          <span className="shrink-0">{item.stock}</span>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full h-7 bg-white dark:bg-zinc-900 border-yellow-500/20 hover:bg-yellow-500/10 cursor-pointer text-yellow-600 dark:text-yellow-400 font-black text-[9px] uppercase" onClick={() => onPosTabChange("products")}>Surtir Stock</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {overdueCredits.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-red-500/20 bg-red-500/10 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-500 font-medium">Créditos Vencidos</p>
                    </div>
                    <p className="text-sm text-red-500/80">Hay {overdueCredits.length} créditos vencidos en esta sede que requieren cobro.</p>
                    <Button size="sm" variant="outline" className="w-full bg-background/50 border-red-500/20 hover:bg-red-500/10 cursor-pointer text-red-600 dark:text-red-400" onClick={() => { onPosTabChange("credits"); setCreditFilter("overdue") }}>Gestionar Cobros</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card className="flex-1 bg-primary text-primary-foreground relative overflow-hidden border-none shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-16 h-16" />
            </div>
            <CardContent className="p-4">
              <p className="text-primary-foreground/60 text-[9px] font-black uppercase tracking-widest mb-1">Tu progreso hoy</p>
              <h3 className="text-lg font-black mb-3">{Math.round(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100)}% <span className="text-[10px] font-normal text-primary-foreground/50">de la meta</span></h3>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[9px] opacity-60 italic">¡Sigue así! Estás cerca de superar tu promedio.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Productos Más Vendidos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardStats?.topProducts.map((product, i) => (
                <div key={product.id || i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary/20 text-primary border border-primary/20 rounded flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                    <div>
                      <p className="text-xs font-black text-foreground uppercase tracking-tight">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.totalSold} vendidos</p>
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
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {dashboardStats?.recentSales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-xs font-black">{formatCurrency(sale.total)}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{sale.customer?.name || "Cliente general"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted-foreground uppercase font-medium">{formatDate(sale.createdAt)}</p>
                      <Badge variant="outline" className="h-4 text-[8px] font-black uppercase mt-0.5 px-1.5">{sale.paymentMethod}</Badge>
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
