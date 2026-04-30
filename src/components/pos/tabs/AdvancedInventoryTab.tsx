"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  History, ShoppingCart, Plus, Calendar, 
  Package, TrendingUp, TrendingDown, RefreshCw,
  CheckCircle2, XCircle, Clock, Truck, ChevronRight,
  Filter, Search, ArrowUpRight, ArrowDownRight, Settings2, Eye, PlusCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseOrderDialog } from "../dialogs/PurchaseOrderDialog"
import { PurchaseOrderDetailDialog } from "../dialogs/PurchaseOrderDetailDialog"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface AdvancedInventoryTabProps {
  products: any[]
  branches: any[]
  selectedBranch: string | null
  onRefreshData?: () => void
}

export const AdvancedInventoryTab = ({ products, branches, selectedBranch, onRefreshData }: AdvancedInventoryTabProps) => {
  const [activeTab, setActiveTab] = useState("kardex")
  const [movements, setMovements] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [showPODialog, setShowPODialog] = useState(false)
  const [selectedPO, setSelectedPO] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const fetchMovements = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/inventory")
      const data = await res.json()
      if (data.success) setMovements(data.data)
    } catch (error) {
      toast.error("Error al cargar Kardex")
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchaseOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/purchase-orders")
      const data = await res.json()
      if (data.success) setPurchaseOrders(data.data)
    } catch (error) {
      toast.error("Error al cargar órdenes")
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers")
      const data = await res.json()
      if (data.success) setSuppliers(data.data)
    } catch (error) {
      console.error("Error loading suppliers")
    }
  }

  useEffect(() => {
    if (activeTab === "kardex") fetchMovements()
    else {
      fetchPurchaseOrders()
      fetchSuppliers()
    }
  }, [activeTab])

  const handleCreatePO = async (data: any) => {
    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast.success("Orden de compra creada exitosamente")
        fetchPurchaseOrders()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Error al crear la orden")
    }
  }

  const handleReceivePO = async (id: string) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RECEIVED" })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Mercancía recibida y stock actualizado")
        fetchPurchaseOrders()
        if (onRefreshData) onRefreshData()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Error al procesar recepción")
    }
  }

  const handleViewPO = (po: any) => {
    setSelectedPO(po)
    setShowDetailDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            Inventario Avanzado
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Gestiona tu Kardex y Órdenes de Compra</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] h-12 bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-1 rounded-2xl backdrop-blur-sm">
            <TabsTrigger value="kardex" className="rounded-xl font-black text-[10px] uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg transition-all cursor-pointer hover:bg-white/50 dark:hover:bg-zinc-800/50">
              <History className="w-4 h-4 mr-2" /> Kardex
            </TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-xl font-black text-[10px] uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg transition-all cursor-pointer hover:bg-white/50 dark:hover:bg-zinc-800/50">
              <ShoppingCart className="w-4 h-4 mr-2" /> Compras
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "kardex" ? (
          <motion.div
            key="kardex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-50 dark:border-zinc-900/50 bg-slate-50/30 dark:bg-zinc-900/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black tracking-tight">Movimientos de Inventario</CardTitle>
                    <CardDescription>Traza cada entrada y salida de productos</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                      <Input 
                        placeholder="Buscar por producto..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10 bg-white/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 shrink-0 cursor-pointer">
                      <Filter className="w-4 h-4 mr-2 opacity-60" /> <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-900 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Producto</th>
                        <th className="px-4 py-3 text-left">Tipo</th>
                        <th className="px-4 py-3 text-right">Cant.</th>
                        <th className="px-4 py-3 text-right">Anterior</th>
                        <th className="px-4 py-3 text-right">Nuevo</th>
                        <th className="px-4 py-3 text-left">Responsable</th>
                        <th className="px-4 py-3 text-left">Referencia / Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {movements.filter(m => m.product.name.toLowerCase().includes(search.toLowerCase())).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer">
                          <td className="px-4 py-3 tabular-nums text-muted-foreground">
                            {format(new Date(m.createdAt), "dd MMM, HH:mm", { locale: es })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold">{m.product.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{m.branch.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`uppercase text-[9px] font-black ${
                              m.type === "SALE" || m.type === "OUT" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              m.type === "PURCHASE" || m.type === "IN" ? "bg-primary/10 text-primary border-primary/20" :
                              "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`} variant="outline">
                              {m.type === "SALE" && <TrendingDown className="w-2.5 h-2.5 mr-1" />}
                              {m.type === "PURCHASE" && <TrendingUp className="w-2.5 h-2.5 mr-1" />}
                              {m.type === "ADJUSTMENT" && <Settings2 className="w-2.5 h-2.5 mr-1" />}
                              {m.type}
                            </Badge>
                          </td>
                          <td className={`px-4 py-3 text-right font-black ${
                             m.type === "SALE" || m.type === "OUT" ? "text-red-500" : "text-primary"
                          }`}>
                            {m.type === "SALE" || m.type === "OUT" ? "-" : "+"}{m.quantity}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{m.previousStock}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-bold">{m.newStock}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-xs text-slate-700 dark:text-zinc-300">
                              {m.creator?.name || "Sistema"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-[10px] truncate max-w-[150px] text-slate-600 dark:text-zinc-400">
                              {m.referenceId || "Ajuste Directo"}
                            </div>
                            <div className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">
                              {m.reason || m.notes || "-"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="purchases"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-primary tracking-widest opacity-70">Inversión Total</p>
                      <h3 className="text-xl font-black tracking-tighter">{formatCurrency(purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0))}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-emerald-500/5 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest opacity-70">Recibidas</p>
                      <h3 className="text-xl font-black tracking-tighter">
                        {purchaseOrders.filter(po => po.status === "RECEIVED").length} <span className="text-xs font-bold text-muted-foreground ml-1">órdenes</span>
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-amber-500/5 bg-gradient-to-br from-amber-500/5 to-transparent rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-amber-600 tracking-widest opacity-70">Pendientes</p>
                      <h3 className="text-xl font-black tracking-tighter">
                        {purchaseOrders.filter(po => po.status === "PENDING").length} <span className="text-xs font-bold text-muted-foreground ml-1">órdenes</span>
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-blue-500/5 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-blue-600 tracking-widest opacity-70">Inversión Mes</p>
                      <h3 className="text-xl font-black tracking-tighter">
                        {formatCurrency(
                          purchaseOrders
                            .filter(po => new Date(po.createdAt).getMonth() === new Date().getMonth())
                            .reduce((sum, po) => sum + po.totalAmount, 0)
                        )}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-50 dark:border-zinc-900/50 bg-slate-50/30 dark:bg-zinc-900/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black tracking-tight">Registro de Órdenes</CardTitle>
                    <CardDescription className="text-sm font-medium">Historial detallado de compras a proveedores</CardDescription>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary dark:bg-primary dark:hover:bg-primary shadow-xl shadow-primary/20 rounded-xl h-11 px-6 font-black uppercase tracking-wider text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:cursor-not-allowed group"
                    onClick={() => setShowPODialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" /> Nueva Orden
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">

                <div className="grid grid-cols-1 gap-4">
                  {purchaseOrders.map((po) => (
                    <div key={po.id} className="group p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl transition-colors duration-500 ${
                            po.status === "RECEIVED" ? "bg-primary/10 text-primary dark:bg-primary/5 dark:text-primary" :
                            po.status === "PENDING" ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400" :
                            "bg-slate-500/10 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}>
                            <Truck className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm uppercase tracking-tighter">OC-{po.id.slice(-6)}</span>
                              <Badge className={`uppercase text-[8px] font-black ${
                                po.status === "RECEIVED" ? "bg-primary text-white" : "bg-amber-500 text-white"
                              }`}>
                                {po.status}
                              </Badge>
                            </div>
                            <p className="font-bold text-lg">{po.supplier.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {format(new Date(po.createdAt), "PPP", { locale: es })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Orden</p>
                            <p className="text-xl font-black text-foreground">{formatCurrency(po.totalAmount)}</p>
                            <p className="text-xs text-muted-foreground">{po.items.length} productos</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {po.status === "PENDING" && (
                              <Button 
                                className="bg-primary hover:bg-primary dark:bg-primary dark:hover:bg-primary font-bold rounded-xl transition-all hover:scale-105 cursor-pointer"
                                onClick={() => handleReceivePO(po.id)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Recibir
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                              onClick={() => handleViewPO(po)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {purchaseOrders.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-[32px] bg-slate-50/50 dark:bg-zinc-900/20 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl mx-auto mb-6 flex items-center justify-center border border-slate-50 dark:border-zinc-800">
                        <Truck className="w-10 h-10 text-primary opacity-20" />
                      </div>
                      <p className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Sin órdenes registradas</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto font-medium">Empieza a abastecer tu inventario creando tu primera orden de compra.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPODialog(true)}
                        className="mt-8 rounded-xl border-primary/20 text-primary font-bold hover:bg-emerald-50 cursor-pointer"
                      >
                        Crear Orden Ahora
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <PurchaseOrderDialog 
        open={showPODialog}
        onOpenChange={setShowPODialog}
        suppliers={suppliers}
        products={products}
        branches={branches}
        selectedBranch={selectedBranch}
        onCreate={handleCreatePO}
      />

      <PurchaseOrderDetailDialog 
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        po={selectedPO}
      />
    </div>
  )
}
