"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
  RefreshCw, TrendingUp, ShoppingBag, DollarSign, 
  CreditCard, ArrowUpRight, ArrowDownRight, Target, 
  AlertTriangle, AlertCircle, BarChart3, Receipt 
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>
      
      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" variants={staggerContainer} initial="initial" animate="animate">
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
            <Card className="cursor-pointer border-none shadow-lg shadow-black/5 dark:shadow-emerald-500/5 transition-all duration-300 hover:shadow-xl overflow-hidden relative group h-full">
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 via-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-500/10 dark:bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <Badge variant="outline" className={`h-6 border-none ${stat.isUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'} text-[10px] font-black`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-1">{stat.label}</p>
                  <div className="text-2xl font-black text-foreground tabular-nums">
                    <AnimatedCounter value={stat.value as number} prefix={stat.prefix === "$" ? "$" : ""} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-background" />
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-background" />
                   </div>
                   <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">Ver informe</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Goal Widget */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Meta Mensual</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboardStats?.monthSales || 0)} / {formatCurrency(dashboardStats?.monthlyGoal || 0)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.min(Math.round(((dashboardStats?.monthSales || 0) / (dashboardStats?.monthlyGoal || 1)) * 100), 100)}%</span>
                </div>
              </div>
              <Target className="w-16 h-16 text-white/20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts and Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Tendencia de Ventas (7 días)</CardTitle>
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <SalesChart data={dashboardStats?.weeklySales || []} />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {(dashboardStats?.expiredCount || 0) > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="border-red-500/20 bg-red-500/10 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-500 font-medium">Productos Vencidos</p>
                    </div>
                    <p className="text-sm text-red-500/80">Tienes {dashboardStats?.expiredCount} productos que ya caducaron en esta sede.</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full bg-background/50 border-red-500/20 hover:bg-red-500/10 cursor-pointer text-red-600 dark:text-red-400" 
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
                <Card className="border-orange-500/20 bg-orange-500/10 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <p className="text-orange-500 font-medium">Por Vencer Pronto</p>
                    </div>
                    <p className="text-sm text-orange-500/80">Tienes {dashboardStats?.nearExpiryCount} productos por vencer pronto en esta sede.</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full bg-background/50 border-orange-500/20 hover:bg-orange-500/10 cursor-pointer text-orange-600 dark:text-orange-400" 
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
                <Card className="border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <p className={dashboardStats?.isGlobalView ? "text-orange-500 font-medium" : "text-yellow-500 font-medium"}>
                        {dashboardStats?.isGlobalView ? "Stock Bajo (Global)" : "Stock Bajo"}
                      </p>
                    </div>
                    <p className="text-sm opacity-80 mb-2">
                      Tienes {dashboardStats?.lowStockProducts} productos agotándose {dashboardStats?.isGlobalView ? "en todo el negocio" : "en esta sede"}:
                    </p>
                    <div className="flex flex-col gap-1 mb-3">
                      {dashboardStats?.stockItems?.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="text-[11px] font-bold bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10 flex justify-between items-center text-yellow-700 dark:text-yellow-300">
                          <span className="truncate mr-2">{item.name}</span>
                          <span className="shrink-0">{item.stock} / {item.minStock}</span>
                        </div>
                      ))}
                      {(dashboardStats?.stockItems?.length || 0) > 3 && (
                        <p className="text-[10px] text-yellow-600/60 font-medium italic">...y {(dashboardStats?.stockItems?.length || 0) - 3} más.</p>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-background/50 border-yellow-500/20 hover:bg-yellow-500/10 cursor-pointer text-yellow-600 dark:text-yellow-400 font-bold h-8 text-xs" onClick={() => onPosTabChange("products")}>Corregir Inventario</Button>
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
          
          <Card className="flex-1 bg-emerald-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-20 h-20" />
            </div>
            <CardContent className="p-6">
              <p className="text-emerald-300 text-sm font-medium mb-1">Tu progreso hoy</p>
              <h3 className="text-2xl font-bold mb-4">{Math.round(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100)}% de la meta</h3>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((dashboardStats?.todaySales || 0) / (dashboardStats?.dailyGoal || 1000000)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-emerald-200">¡Sigue así! Estás cerca de superar tu promedio diario.</p>
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
                <div key={product.id || i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.totalSold} vendidos</p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-500">{formatCurrency(product.totalRevenue)}</p>
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
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(sale.total)}</p>
                      <p className="text-sm text-muted-foreground">{sale.customer?.name || "Cliente general"} • {sale.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(sale.createdAt)}</p>
                      <Badge variant="outline" className="mt-1">{sale.paymentMethod}</Badge>
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
