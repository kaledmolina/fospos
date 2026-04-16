"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  History, ShoppingCart, Plus, Calendar, 
  Package, TrendingUp, TrendingDown, RefreshCw,
  CheckCircle2, XCircle, Clock, Truck, ChevronRight,
  Filter, Search, ArrowUpRight, ArrowDownRight, Settings2, Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface AdvancedInventoryTabProps {
  products: any[]
  branches: any[]
}

export const AdvancedInventoryTab = ({ products, branches }: AdvancedInventoryTabProps) => {
  const [activeTab, setActiveTab] = useState("kardex")
  const [movements, setMovements] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

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

  useEffect(() => {
    if (activeTab === "kardex") fetchMovements()
    else fetchPurchaseOrders()
  }, [activeTab])

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
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Error al procesar recepción")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            Inventario Avanzado
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Gestiona tu Kardex y Órdenes de Compra</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] h-11 bg-slate-100 dark:bg-zinc-900 border p-1 rounded-xl">
            <TabsTrigger value="kardex" className="rounded-lg font-bold text-xs uppercase tracking-tighter data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              <History className="w-4 h-4 mr-2" /> Kardex
            </TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-lg font-bold text-xs uppercase tracking-tighter data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
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
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Movimientos de Inventario</CardTitle>
                    <CardDescription>Traza cada entrada y salida de productos</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar producto..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 bg-background/50 border-slate-200"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="w-4 h-4 mr-2" /> Filtros
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
                        <th className="px-4 py-3 text-left">Referencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {movements.filter(m => m.product.name.toLowerCase().includes(search.toLowerCase())).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
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
                              m.type === "PURCHASE" || m.type === "IN" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`} variant="outline">
                              {m.type === "SALE" && <TrendingDown className="w-2.5 h-2.5 mr-1" />}
                              {m.type === "PURCHASE" && <TrendingUp className="w-2.5 h-2.5 mr-1" />}
                              {m.type === "ADJUSTMENT" && <Settings2 className="w-2.5 h-2.5 mr-1" />}
                              {m.type}
                            </Badge>
                          </td>
                          <td className={`px-4 py-3 text-right font-black ${
                             m.type === "SALE" || m.type === "OUT" ? "text-red-500" : "text-emerald-500"
                          }`}>
                            {m.type === "SALE" || m.type === "OUT" ? "-" : "+"}{m.quantity}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{m.previousStock}</td>
                          <td className="px-4 py-3 text-right tabular-nums font-bold">{m.newStock}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-xs truncate max-w-[150px]">{m.referenceId || "Directo"}</div>
                            <div className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{m.notes}</div>
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
            className="space-y-4"
          >
             <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Órdenes de Compra</CardTitle>
                    <CardDescription>Abastece tu inventario con tus proveedores</CardDescription>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Orden
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {purchaseOrders.map((po) => (
                    <div key={po.id} className="group p-4 rounded-2xl border bg-background hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            po.status === "RECEIVED" ? "bg-emerald-500/10 text-emerald-600" :
                            po.status === "PENDING" ? "bg-amber-500/10 text-amber-600" :
                            "bg-slate-500/10 text-slate-600"
                          }`}>
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm uppercase tracking-tighter">OC-{po.id.slice(-6)}</span>
                              <Badge className={`uppercase text-[8px] font-black ${
                                po.status === "RECEIVED" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
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
                                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                                onClick={() => handleReceivePO(po.id)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Recibir
                              </Button>
                            )}
                            <Button variant="outline" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {purchaseOrders.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-3xl">
                      <Truck className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="font-bold text-slate-500 text-lg">No hay órdenes de compra</p>
                      <p className="text-sm text-slate-400">Crea tu primera orden para abastecer tu stock</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
